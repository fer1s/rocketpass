use crate::error::Error;
use openssl::error::ErrorStack;
use openssl::hash::MessageDigest;
use openssl::rand::rand_bytes;
use openssl::symm::{decrypt, decrypt_aead, encrypt, encrypt_aead, Cipher};
use serde::{de::DeserializeOwned, Serialize};
use std::marker::PhantomData;

const AAD_MESSAGE: &[u8] = b"RocketPass v1.0.0";

#[derive(Default)]
pub struct EncryptedBlob<T> {
    iv: [u8; 12],
    tag: [u8; 16],
    data: Vec<u8>,
    _t: PhantomData<T>,
}

impl<T: Serialize + DeserializeOwned> EncryptedBlob<T> {
    pub fn encrypt(t: &T, key: &[u8]) -> Result<Self, Error> {
        let iv = random_bytes::<12>();
        let mut tag = [0; 16];
        let serialized = serde_json::to_vec(&t)?;
        let data = encrypt_aead(
            Cipher::aes_256_gcm(),
            key,
            Some(&iv),
            AAD_MESSAGE,
            &serialized,
            &mut tag,
        )?;
        Ok(Self {
            iv,
            tag,
            data,
            _t: PhantomData,
        })
    }

    pub fn decrypt(&self, key: &[u8]) -> Result<T, Error> {
        let bytes = decrypt_aead(
            Cipher::aes_256_gcm(),
            key,
            Some(&self.iv),
            AAD_MESSAGE,
            &self.data,
            &self.tag,
        )?;
        let t = serde_json::from_slice(&bytes)?;
        Ok(t)
    }

    pub fn from_bytes(bytes: &[u8]) -> Result<Self, Error> {
        if bytes.len() < (12 + 16 + 1) {
            return Err(Error::InvalidDatabase);
        }
        Ok(Self {
            iv: bytes[0..12].try_into().unwrap(),
            tag: bytes[12..12 + 16].try_into().unwrap(),
            data: bytes[12 + 16..].to_vec(),
            _t: PhantomData,
        })
    }

    pub fn bytes(&self) -> impl Iterator<Item = u8> + '_ {
        self.iv
            .iter()
            .chain(self.tag.iter())
            .chain(self.data.iter())
            .copied()
    }
}

pub fn random_bytes<const SIZE: usize>() -> [u8; SIZE] {
    let mut bytes = [0; SIZE];
    rand_bytes(&mut bytes).expect("failed to generate random bytes");
    bytes
}

pub fn pbkdf2_hmac(password: &[u8], salt: &[u8]) -> [u8; 32] {
    let mut key = [0; 32];
    openssl::pkcs5::pbkdf2_hmac(password, salt, 100_000, MessageDigest::sha256(), &mut key)
        .expect("pbkdf2 should not fail");
    key
}

pub fn encrypt_key(master_key: &[u8], key: &[u8]) -> Result<([u8; 32], [u8; 16]), ErrorStack> {
    let nonce = random_bytes::<16>();
    let ciphertext = encrypt(Cipher::aes_256_ctr(), master_key, Some(&nonce), key)?;
    Ok((ciphertext.try_into().unwrap(), nonce))
}

pub fn decrypt_key(
    master_key: &[u8],
    encrypted_key: &[u8],
    nonce: &[u8],
) -> Result<[u8; 32], ErrorStack> {
    let plaintext = decrypt(
        Cipher::aes_256_ctr(),
        master_key,
        Some(nonce),
        encrypted_key,
    )?;
    Ok(plaintext.try_into().unwrap())
}

pub fn generate_password(alphabet: &[u8], len: usize) -> String {
    assert!(alphabet.len() < 256);
    let mod_ceil = alphabet.len().next_power_of_two();
    (0..len)
        .map(|_| loop {
            let [b] = random_bytes::<1>();
            if let Some(&c) = alphabet.get(b as usize % mod_ceil) {
                return c as char;
            }
        })
        .collect()
}
