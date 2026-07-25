# Module 02: Symmetric Cryptography & Hash Functions — Theory

## 1. Introduction

Symmetric cryptography and hash functions form the backbone of modern data security. The Advanced Encryption Standard (AES) encrypts data at rest and in transit, while cryptographic hash functions ensure data integrity and enable digital signatures. This module provides the mathematical foundations needed for side-channel analysis of these primitives.

## 2. Advanced Encryption Standard (AES)

### 2.1 Overview

AES (FIPS 197) is a substitution-permutation network (SPN) block cipher standardized in 2001. It operates on 128-bit blocks with key sizes of 128, 192, or 256 bits.

| Parameter | AES-128 | AES-192 | AES-256 |
|-----------|---------|---------|---------|
| Key length (bits) | 128 | 192 | 256 |
| Block size (bits) | 128 | 128 | 128 |
| Number of rounds | 10 | 12 | 14 |
| Round keys needed | 11 | 13 | 15 |

### 2.2 State Representation

The 128-bit plaintext block is arranged as a 4×4 matrix of bytes (the "state"):

$$
\begin{pmatrix}
s_{0,0} & s_{0,1} & s_{0,2} & s_{0,3} \\
s_{1,0} & s_{1,1} & s_{1,2} & s_{1,3} \\
s_{2,0} & s_{2,1} & s_{2,2} & s_{2,3} \\
s_{3,0} & s_{3,1} & s_{3,2} & s_{3,3}
\end{pmatrix}
$$

Bytes are filled column-major: the first 4 bytes of the plaintext go in column 0, the next 4 in column 1, etc.

### 2.3 AES Round Operations

Each AES round consists of four operations (except the last round, which omits MixColumns):

#### 2.3.1 SubBytes (Non-linear Substitution)

Each byte is replaced using the AES S-box, an invertible 8-bit substitution:

$$
b' = S(b)
$$

The S-box is constructed by:
1. Computing the multiplicative inverse in GF(2⁸) (with irreducible polynomial $x^8 + x^4 + x^3 + x + 1$)
2. Applying an affine transformation over GF(2)

**AES S-box (first row, partial):**

| $b$ | 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 0A | 0B | 0C | 0D | 0E | 0F |
|-----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|
| $S(b)$ | 63 | 7C | 77 | 7B | F2 | 6B | 6F | C5 | 30 | 01 | 67 | 2B | FE | D7 | AB | 76 |

The S-box is the primary source of non-linearity in AES and the target of power analysis attacks (Module 08).

#### 2.3.2 ShiftRows (Permutation)

Rows of the state are cyclically shifted left by their row index:

$$
\begin{pmatrix}
s_{0,0} & s_{0,1} & s_{0,2} & s_{0,3} \\
s_{1,0} & s_{1,1} & s_{1,2} & s_{1,3} \\
s_{2,0} & s_{2,1} & s_{2,2} & s_{2,3} \\
s_{3,0} & s_{3,1} & s_{3,2} & s_{3,3}
\end{pmatrix}
\xrightarrow{\text{ShiftRows}}
\begin{pmatrix}
s_{0,0} & s_{0,1} & s_{0,2} & s_{0,3} \\
s_{1,1} & s_{1,2} & s_{1,3} & s_{1,0} \\
s_{2,2} & s_{2,3} & s_{2,0} & s_{2,1} \\
s_{3,3} & s_{3,0} & s_{3,1} & s_{3,2}
\end{pmatrix}
$$

#### 2.3.3 MixColumns (Linear Transformation)

Each column is multiplied by a fixed polynomial in GF(2⁸)[x]:

$$
\begin{pmatrix}
s'_{0,j} \\
s'_{1,j} \\
s'_{2,j} \\
s'_{3,j}
\end{pmatrix}
=
\begin{pmatrix}
02 & 03 & 01 & 01 \\
01 & 02 & 03 & 01 \\
01 & 01 & 02 & 03 \\
03 & 01 & 01 & 02
\end{pmatrix}
\begin{pmatrix}
s_{0,j} \\
s_{1,j} \\
s_{2,j} \\
s_{3,j}
\end{pmatrix}
\pmod{x^4 + 1}
$$

In GF(2⁸) with AES irreducible polynomial $m(x) = x^8 + x^4 + x^3 + x + 1$:

- $02 \cdot b = b \lll 1$ if $b < 128$, else $(b \lll 1) \oplus 0x1B$
- $03 \cdot b = 02 \cdot b \oplus b$

**MixColumns properties:**
- Branch number: 5 (maximum diffusion)
- Each output byte depends on all 4 input bytes in the column
- Linear over GF(2⁸), making it susceptible to differential attacks if combined with weak non-linearity

#### 2.3.4 AddRoundKey

The round key is XORed with the state:

$$
s'_{i,j} = s_{i,j} \oplus k_{i,j}
$$

### 2.4 Key Schedule

The AES key schedule expands the original key into round keys:

**AES-128 Key Expansion:**
1. The 16-byte key is divided into 4 words: $w_0, w_1, w_2, w_3$
2. For $i = 4, 5, \ldots, 43$:
   - If $i \mod 4 = 0$: $w_i = w_{i-4} \oplus \text{SubWord}(\text{RotWord}(w_{i-1})) \oplus R_{i/4}$
   - Else: $w_i = w_{i-4} \oplus w_{i-1}$

Where:
- $\text{RotWord}$: Cyclic byte rotation $[a_0, a_1, a_2, a_3] \to [a_1, a_2, a_3, a_0]$
- $\text{SubWord}$: Apply S-box to each byte
- $R_j$: Round constant (Rcon) defined as $R_j = [r_j, 0, 0, 0]$ where $r_0 = 1$, $r_j = 2 \cdot r_{j-1}$ in GF(2⁸)

### 2.5 Complete AES-128 Encryption

```
AddRoundKey(state, key)
for round = 1 to 9:
    SubBytes(state)
    ShiftRows(state)
    MixColumns(state)
    AddRoundKey(state, round_key[round])
SubBytes(state)
ShiftRows(state)
AddRoundKey(state, round_key[10])
```

## 3. Modes of Operation

### 3.1 Electronic Codebook (ECB)

$$
C_i = E_K(P_i)
$$

**Properties:**
- Each block encrypted independently
- Identical plaintext blocks produce identical ciphertext blocks
- **INSECURE**: Leaks plaintext patterns (e.g., the famous "ECB penguin" image)
- No IV required
- Not recommended for any application

### 3.2 Cipher Block Chaining (CBC)

$$
C_i = E_K(P_i \oplus C_{i-1}), \quad C_0 = IV
$$

**Properties:**
- Each ciphertext block depends on all previous plaintext blocks
- Requires a random, unpredictable IV
- Vulnerable to padding oracle attacks (POODLE, Lucky13)
- Sequential encryption (not parallelizable)
- Decryption is parallelizable

### 3.3 Counter (CTR)

$$
C_i = P_i \oplus E_K(\text{Nonce} \| i)
$$

**Properties:**
- Turns block cipher into stream cipher
- Nonce + counter value must never repeat for the same key
- Fully parallelizable (both encryption and decryption)
- No padding needed
- Vulnerable to nonce reuse (XOR of two ciphertexts reveals XOR of plaintexts)

### 3.4 Galois/Counter Mode (GCM)

$$
C_i = P_i \oplus E_K(\text{Nonce} \| i), \quad i \geq 1
$$
$$
\text{Tag} = GHASH_H(C) \oplus E_K(\text{Nonce} \| 0)
$$

Where GHASH is defined over GF(2¹²⁸):

$$
\text{GHASH}_H(X) = (X_1 \cdot H^{m} \oplus X_2 \cdot H^{m-1} \oplus \cdots \oplus X_m \cdot H) \bmod P
$$

With $P = x^{128} + x^7 + x^2 + x + 1$ (the GF(2¹²⁸) irreducible polynomial).

**Properties:**
- Provides both confidentiality and authenticity
- Parallelizable encryption
- Single-pass authentication
- Nonce must never repeat (nonce-misuse catastrophic for authenticity)
- Widely used in TLS 1.3, IPsec, WireGuard

### 3.5 Mode Comparison

| Mode | Parallelizable | Authenticated | IV/Nonce | Security |
|------|---------------|---------------|----------|----------|
| ECB | Yes | No | None | Insecure |
| CBC | Decrypt only | No | Required | Moderate |
| CTR | Both | No | Required | Good |
| GCM | Both | Yes | Required | Excellent |

## 4. SHA-2 Family

### 4.1 Merkle-Damgård Construction

SHA-2 uses the Merkle-Damgård iterative structure:

$$
H_0 = IV
$$
$$
H_i = f(H_{i-1}, M_i)
$$
$$
\text{SHA-2}(M) = H_n
$$

Where $f$ is the compression function and $M_i$ are message blocks.

### 4.2 SHA-256 Compression Function

**Initial Hash Values (H0):**
$$
H_0 = \texttt{6a09e667, bb67ae85, 3c6ef372, a54ff53a,}
$$
$$
\texttt{510e527f, 9b05688c, 1f83d9ab, 5be0cd19}
$$

These are the first 32 bits of the fractional parts of the square roots of the first 8 primes.

**Round Constants (K):**
64 round constants, the first 32 bits of the fractional parts of the cube roots of the first 64 primes.

**Message Schedule (W):**
$$
W_t = \begin{cases}
M_t & 0 \leq t \leq 15 \\
\sigma_1(W_{t-2}) + W_{t-7} + \sigma_0(W_{t-15}) + W_{t-16} & 16 \leq t \leq 63
\end{cases}
$$

Where:
$$
\sigma_0(x) = \text{ROTR}^7(x) \oplus \text{ROTR}^{18}(x) \oplus \text{SHR}^3(x)
$$
$$
\sigma_1(x) = \text{ROTR}^{17}(x) \oplus \text{ROTR}^{19}(x) \oplus \text{SHR}^{10}(x)
$$

**Round Function:**
$$
T_1 = h + \Sigma_1(e) + \text{Ch}(e, f, g) + K_t + W_t
$$
$$
T_2 = \Sigma_0(a) + \text{Maj}(a, b, c)
$$
$$
(a, b, c, d, e, f, g, h) = (T_1 + T_2, a, b, c, d + T_1, e, f, g)
$$

Where:
$$
\text{Ch}(x, y, z) = (x \land y) \oplus (\neg x \land z)
$$
$$
\text{Maj}(x, y, z) = (x \land y) \oplus (x \land z) \oplus (y \land z)
$$
$$
\Sigma_0(x) = \text{ROTR}^2(x) \oplus \text{ROTR}^{13}(x) \oplus \text{ROTR}^{22}(x)
$$
$$
\Sigma_1(x) = \text{ROTR}^6(x) \oplus \text{ROTR}^{11}(x) \oplus \text{ROTR}^{25}(x)
$$

### 4.3 SHA-2 Family Variants

| Variant | Digest Size | Block Size | Rounds | Security (bits) |
|---------|-------------|------------|--------|-----------------|
| SHA-224 | 224 | 512 | 64 | 112 |
| SHA-256 | 256 | 512 | 64 | 128 |
| SHA-384 | 384 | 1024 | 80 | 192 |
| SHA-512 | 512 | 1024 | 80 | 256 |

## 5. SHA-3 / Keccak

### 5.1 Sponge Construction

SHA-3 (FIPS 202) uses the sponge construction instead of Merkle-Damgård:

$$
\text{Sponge}[f, \text{pad}, r](M) = \text{queeze}(f, \text{absorb}(f, \text{pad}(r, M)), z)
$$

**Two phases:**
1. **Absorb**: XOR message blocks into the rate portion of the state, apply permutation $f$
2. **Squeeze**: Extract output from the rate portion, apply permutation $f$ as needed

### 5.2 Keccak-f Permutation

The Keccak-$f$ permutation operates on a 1600-bit state (5×5×64 array):

$$
\text{Keccak-}f = \iota \circ \chi \circ \pi \circ \theta \circ \rho
$$

Five steps per round, 24 rounds for Keccak-$f[1600]$:

**Step θ (Theta):** Column parity mixing
$$
C[x] = s[x, 0] \oplus s[x, 1] \oplus s[x, 2] \oplus s[x, 3] \oplus s[x, 4]
$$
$$
D[x] = C[x-1] \oplus \text{rot}(C[x+1], 1)
$$
$$
s[x, y] \leftarrow s[x, y] \oplus D[x]
$$

**Step ρ (Rho):** Bitwise rotation of each lane

**Step π (Pi):** Lane permutation
$$
\pi: (x, y) \to (y, 2x + 3y) \bmod 5
$$

**Step χ (Chi):** Non-linear mixing of rows
$$
s[x, y] \leftarrow s[x, y] \oplus (\neg s[x+1, y] \land s[x+2, y])
$$

**Step ι (Iota):** Round constant addition
$$
s[0, 0] \leftarrow s[0, 0] \oplus RC
$$

### 5.3 SHA-3 Variants

| Variant | Rate (bits) | Capacity (bits) | Output (bits) | Security |
|---------|-------------|-----------------|---------------|----------|
| SHA3-224 | 1152 | 448 | 224 | 112 |
| SHA3-256 | 1088 | 512 | 256 | 128 |
| SHA3-384 | 832 | 768 | 384 | 192 |
| SHA3-512 | 576 | 1024 | 512 | 256 |

## 6. HMAC (Hash-based Message Authentication Code)

### 6.1 Definition

$$
\text{HMAC}_K(M) = H\bigl((K' \oplus \text{opad}) \;\|\; H\bigl((K' \oplus \text{ipad}) \;\|\; M\bigr)\bigr)
$$

Where:
- $K'$: Key processed to block size $B$ (zero-padded if shorter, hashed if longer)
- $\text{ipad} = \texttt{0x36}$ repeated $B$ times
- $\text{opad} = \texttt{0x5C}$ repeated $B$ times

### 6.2 Security Properties

HMAC's security relies on:
1. The hash function being a **pseudorandom function (PRF)**
2. The hash function having reasonable **collision resistance**

**Key result (Bellare, Canetti, Krawczyk, 1996):**
HMAC is secure as long as the underlying compression function is a PRF, even if the hash function is not collision-resistant.

### 6.3 HMAC-SHA256 Example

```
HMAC-SHA256(K, M):
    K' = K padded/hashed to 64 bytes (SHA-256 block size)
    return SHA256((K' ⊕ opad) ‖ SHA256((K' ⊕ ipad) ‖ M))
```

## 7. Relevance to Side-Channel Analysis

### 7.1 AES as a Side-Channel Target

- The S-box substitution is the critical operation: its output intermediate value $s_{out} = S(s_{in} \oplus k)$ leaks information through power consumption
- **CPA attack target**: Guess key byte $k$, compute $s_{out}$, correlate with measured power (Module 08)
- **Leakage model**: Hamming weight or Hamming distance of $s_{out}$

### 7.2 Hash Functions

- Less commonly targeted in power analysis (no secret key in standard use)
- HMAC implementations may leak the inner/outer key pads
- Timing attacks on hash comparison can reveal key bytes

## 8. References

1. NIST. FIPS 197: Advanced Encryption Standard. November 2001.
2. Daemen, J. and Rijmen, V. The Design of Rijndael: AES — The Advanced Encryption Standard. Springer, 2002.
3. NIST. FIPS 180-4: Secure Hash Standard (SHS). August 2015.
4. NIST. FIPS 202: SHA-3 Standard. August 2015.
5. Bertoni, G. et al. "On the Indifferentiability of the Sponge Construction." EUROCRYPT 2008.
6. Bellare, M., Canetti, R., Krawczyk, H. "Keying Hash Functions for Message Authentication." CRYPTO 1996.
7. Mangard, S. et al. Power Analysis Attacks: Revealing the Secrets of Smart Cards. Springer, 2007.
8. Standaert, F. et al. "A Unified Framework for the Analysis of Side-Channel Key Recovery Attacks." EUROCRYPT 2009.
9. IETF. RFC 3394: Advanced Encryption Standard (AES) Key Wrap Algorithm. 2002.
10. IETF. RFC 5288: AES-GCM Cipher Suites for TLS. 2008.
