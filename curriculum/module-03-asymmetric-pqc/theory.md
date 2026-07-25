# Module 03: Asymmetric Cryptography & Post-Quantum Cryptography — Theory

## 1. Introduction

Asymmetric (public-key) cryptography enables secure communication without pre-shared secrets. This module covers the foundational algorithms — RSA and ECC — and the emerging post-quantum cryptographic schemes that will replace them in the quantum computing era.

## 2. RSA (Rivest-Shamir-Adleman)

### 2.1 Key Generation

1. **Generate two large primes**: $p$ and $q$ (each 1024 bits for 2048-bit RSA)
2. **Compute modulus**: $n = p \cdot q$
3. **Compute Euler's totient**: $\phi(n) = (p-1)(q-1)$
4. **Choose public exponent**: $e$ such that $1 < e < \phi(n)$ and $\gcd(e, \phi(n)) = 1$
   - Common choice: $e = 65537 = 2^{16} + 1$ (Fermat prime $F_4$)
5. **Compute private exponent**: $d = e^{-1} \pmod{\phi(n)}$
   - Using extended Euclidean algorithm: $ed \equiv 1 \pmod{\phi(n)}$

**Key pairs:**
- Public key: $(n, e)$
- Private key: $(n, d)$ or $(d, p, q, d_p, d_q, q_{inv})$ (CRT form)

### 2.2 RSA Encryption/Decryption

**Textbook RSA:**
$$
C = M^e \bmod n
$$
$$
M = C^d \bmod n
$$

**RSA-OAEP (Optimal Asymmetric Encryption Padding):**

OAEP provides semantic security (IND-CCA2):

$$
\text{OAEP-Encode}(M, \text{label}) = \text{MGF}_1(r) \oplus M \| \text{MGF}_2(\text{MGF}_1(r) \oplus M \| \text{label}) \| r
$$

Where MGF is a mask generation function based on a hash function.

### 2.3 RSA Signatures

**PKCS#1 v1.5 Signature:**
$$
\text{Sign}(M) = H(M)^d \bmod n
$$

**RSASSA-PSS (Probabilistic Signature Scheme):**

More secure than PKCS#1 v1.5:
1. Hash message: $mHash = \text{Hash}(M)$
2. Generate random salt: $salt$
3. Compute: $M' = \text{0x00} \cdot 8 \| mHash \| salt$
4. Compute hash: $H = \text{Hash}(M')$
5. Generate DB: $DB = \text{PS} \| \text{0x01} \| salt$ (where PS is padding string)
6. Compute: $dbMask = \text{MGF}(H, \text{emLen} - \text{hashLen} - 1)$
7. MaskedDB: $maskedDB = DB \oplus dbMask$
8. Encoded message: $EM = maskedDB \| H \| \text{0xBC}$
9. Signature: $S = EM^d \bmod n$

### 2.4 RSA Security Parameters

| Key Size | Security (bits) | NIST Recommendation | Status |
|----------|-----------------|---------------------|--------|
| 1024 | ~80 | Deprecated | Insecure |
| 2048 | ~112 | Acceptable until 2030 | Minimum |
| 3072 | ~128 | Recommended | Current |
| 4096 | ~140 | High security | Future |

### 2.5 RSA CRT (Chinese Remainder Theorem) Optimization

Private key operations use CRT for ~4× speedup:

$$
M_p = C^{d_p} \bmod p, \quad d_p = d \bmod (p-1)
$$
$$
M_q = C^{d_q} \bmod q, \quad d_q = d \bmod (q-1)
$$
$$
h = q_{inv} \cdot (M_p - M_q) \bmod p
$$
$$
M = M_q + h \cdot q
$$

**Side-channel vulnerability:** CRT-based RSA is vulnerable to Bellcore attacks (fault injection). A single fault during CRT computation can reveal $p$ and $q$.

## 3. Elliptic Curve Cryptography (ECC)

### 3.1 Elliptic Curves over Finite Fields

An elliptic curve over $\mathbb{F}_p$ (prime field) is defined by the Weierstrass equation:

$$
y^2 = x^3 + ax + b \pmod{p}
$$

where $4a^3 + 27b^2 \neq 0$ (non-singular curve).

**Point addition:** Given $P = (x_1, y_1)$ and $Q = (x_2, y_2)$ on the curve:

$$
\lambda = \begin{cases}
\frac{y_2 - y_1}{x_2 - x_1} \pmod{p} & \text{if } P \neq Q \\
\frac{3x_1^2 + a}{2y_1} \pmod{p} & \text{if } P = Q
\end{cases}
$$

$$
x_3 = \lambda^2 - x_1 - x_2 \pmod{p}
$$
$$
y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}
$$

**Scalar multiplication:** $[k]P = P + P + \cdots + P$ ($k$ times)
- Computed efficiently via double-and-add algorithm: $O(\log k)$ operations

### 3.2 Common Elliptic Curves

| Curve | Field | Key Size | Security | Use |
|-------|-------|----------|----------|-----|
| NIST P-256 | $\mathbb{F}_p$ | 256 | 128 | TLS, Bitcoin |
| NIST P-384 | $\mathbb{F}_p$ | 384 | 192 | High security |
| Curve25519 | $\mathbb{F}_p$ | 256 | 128 | Signal, WireGuard |
| secp256k1 | $\mathbb{F}_p$ | 256 | 128 | Bitcoin |

### 3.3 Elliptic Curve Diffie-Hellman (ECDH)

Key exchange protocol:
1. Alice generates random $a$, computes $A = [a]G$
2. Bob generates random $b$, computes $B = [b]G$
3. Shared secret: $S = [a]B = [b]A = [ab]G$

**Security:** Based on the Elliptic Curve Discrete Logarithm Problem (ECDLP): given $G$ and $[k]G$, finding $k$ is computationally infeasible for curves over $\mathbb{F}_p$ with $|p| \geq 256$.

### 3.4 Elliptic Curve Digital Signature Algorithm (ECDSA)

**Key Generation:**
1. Choose random $d \in [1, n-1]$ (private key)
2. Compute $Q = [d]G$ (public key)

**Signing (message $m$, hash function $H$):**
1. $z = H(m)$ (truncated to bit length of $n$)
2. Loop:
   a. Choose random $k \in [1, n-1]$
   b. $(x_1, y_1) = [k]G$
   c. $r = x_1 \bmod n$; if $r = 0$, retry
   d. $s = k^{-1}(z + rd) \bmod n$; if $s = 0$, retry
3. Signature: $(r, s)$

**Verification:**
1. Verify $r, s \in [1, n-1]$
2. $w = s^{-1} \bmod n$
3. $u_1 = zw \bmod n$, $u_2 = rw \bmod n$
4. $(x_1, y_1) = [u_1]G + [u_2]Q$
5. Valid if $r \equiv x_1 \pmod{n}$

**Side-channel vulnerability:** ECDSA signing with a biased or reused nonce $k$ leaks the private key (Sony PS3 hack, 2010).

## 4. Key Exchange Protocols

### 4.1 Diffie-Hellman (DH)

$$
\text{Alice: } A = g^a \bmod p
$$
$$
\text{Bob: } B = g^b \bmod p
$$
$$
\text{Shared secret: } s = A^b = B^a = g^{ab} \bmod p
$$

### 4.2 Ephemeral Diffie-Hellman (DHE/ECDHE)

Provides **forward secrecy**: compromise of long-term keys does not compromise past sessions.

TLS 1.3 mandates ECDHE for all key exchanges.

### 4.4 Key Transport vs. Key Agreement

| Method | Description | Examples |
|--------|-------------|----------|
| Key Transport | One party generates and encrypts key | RSA, RSA-OAEP |
| Key Agreement | Both parties contribute to shared secret | DH, ECDH, ECDHE |

## 5. Post-Quantum Cryptography (PQC)

### 5.1 The Quantum Threat

Shor's algorithm (1994) can factor large integers and compute discrete logarithms in polynomial time:
- **RSA**: Broken by quantum computer with ~4000 logical qubits
- **ECC**: Broken by quantum computer with ~2500 logical qubits
- **AES-256**: Grover's algorithm provides quadratic speedup (effectively halving key length; still 128-bit secure)

### 5.2 NIST PQC Standardization

NIST completed its PQC standardization process in 2024, selecting three algorithms:

| Standard | Algorithm | Type | Use Case |
|----------|-----------|------|----------|
| **FIPS 203** | ML-KEM (Kyber) | Lattice-based | Key encapsulation |
| **FIPS 204** | ML-DSA (Dilithium) | Lattice-based | Digital signatures |
| **FIPS 205** | SLH-DSA (SPHINCS+) | Hash-based | Digital signatures |

### 5.3 Lattice-Based Cryptography

#### 5.3.1 Learning With Errors (LWE)

Given: matrix $A \in \mathbb{Z}_q^{n \times m}$, secret vector $\mathbf{s} \in \mathbb{Z}_q^n$, error vector $\mathbf{e} \leftarrow \chi$ (error distribution)

**LWE problem:** Given $(A, \mathbf{b} = A\mathbf{s} + \mathbf{e})$, find $\mathbf{s}$.

**Security:** Reduces to worst-case lattice problems (GapSVP, SIS), which are believed to be hard even for quantum computers.

#### 5.3.2 Ring-LWE (RLWE)

Uses polynomial rings for efficiency:

$$
\mathbf{b} = \mathbf{a} \cdot \mathbf{s} + \mathbf{e} \in R_q = \mathbb{Z}_q[x]/(x^n + 1)
$$

Where $n$ is typically a power of 2 (e.g., 256, 512, 1024).

#### 5.3.3 Module-LWE (ML-KEM / Kyber)

Kyber uses Module-LWE over $\text{GR}(q, k, d)$ (module rank $k$, degree $d$):

**KeyGen:**
1. Sample $\mathbf{A} \leftarrow R_q^{k \times k}$
2. Sample $\mathbf{s}, \mathbf{e} \leftarrow \chi^k$
3. Compute $\mathbf{t} = \mathbf{A}\mathbf{s} + \mathbf{e}$
4. Public key: $(\mathbf{t}, \mathbf{A})$; Secret key: $\mathbf{s}$

**Encaps:**
1. Sample $\mathbf{r}, \mathbf{e}_1, e_2 \leftarrow \chi$
2. Compute $\mathbf{u} = \mathbf{A}^T\mathbf{r} + \mathbf{e}_1$
3. Compute $v = \mathbf{t}^T\mathbf{r} + e_2 + \lceil q/2 \rfloor \cdot m$
4. Ciphertext: $(\text{Compress}(\mathbf{u}), \text{Compress}(v))$
5. Shared secret: $K = \text{KDF}(\text{Hash}(\mathbf{u}, v))$

**Decaps:**
1. $m' = \text{Decompress}(v - \mathbf{s}^T \cdot \text{Decompress}(\mathbf{u}))$
2. Re-encrypt and verify to prevent chosen-ciphertext attacks

#### 5.3.4 Dilithium / ML-DSA

Uses Module-LWE + Module-SIS (Short Integer Solution):

**Signing:**
1. Hash message: $\mu = H(pk \| m)$
2. Sample masking vector $\mathbf{y} \leftarrow S_\gamma^l$
3. Compute $\mathbf{w} = \mathbf{A}\mathbf{y}$
4. $c = H(\mu \| \mathbf{w}_1)$ (challenge)
5. $\mathbf{z} = \mathbf{y} + c\mathbf{s}_1$
6. Check $\|\mathbf{z}\|_\infty < \beta$ (rejection sampling)
7. Signature: $(\mathbf{z}, c)$

### 5.4 Hash-Based Signatures: SPHINCS+ / SLH-DSA

**Security:** Based solely on the security of the underlying hash function.

**Structure:** Forest of XMSS trees (eXtended Merkle Signature Scheme)

**Key properties:**
- Stateless (no need to track which keys have been used)
- Conservative security assumptions
- Larger signatures (~8–50 KB) compared to lattice-based (~2–4 KB)

**Parameters (SLH-DSA-128f):**
- Public key: 32 bytes
- Signature: 17,088 bytes
- Security: 128 bits

### 5.5 Code-Based Cryptography: McEliece

**Based on:** The hardness of decoding a random linear code (syndrome decoding problem).

**Key Generation:**
1. Choose a random $[n, k, t]$-Goppa code with generator matrix $G$
2. Compute scrambled generator matrix: $G' = SGP$ ($S$: random invertible, $P$: permutation)
3. Public key: $G'$; Secret key: $(S, G, P)$

**Encryption (message $m \in \{0,1\}^k$):**
1. Compute $c' = mG'$
2. Add error vector: $c = c' + e$ ($\|e\| = t$)

**Decryption:**
1. $c = mG' + e = mSGP + e$
2. Decode using $P^{-1}$ to recover $mSG$
3. Decode using $G$-based decoder to recover $mS$
4. Multiply by $S^{-1}$ to get $m$

**Parameters:**
- Public key: ~261 KB (classical) or ~1 MB (quantum-resistant)
- Signature: N/A (encryption only; for signatures, see CFS variant)
- Security: Believed secure against quantum attacks

### 5.6 PQC Algorithm Comparison

| Algorithm | Type | Use | PK Size | Sig/CT Size | Security Basis |
|-----------|------|-----|---------|-------------|----------------|
| ML-KEM-512 | Lattice | KEM | 800 B | 768 B | Module-LWE |
| ML-KEM-768 | Lattice | KEM | 1,184 B | 1,088 B | Module-LWE |
| ML-KEM-1024 | Lattice | KEM | 1,568 B | 1,568 B | Module-LWE |
| ML-DSA-44 | Lattice | Sig | 1,312 B | 2,420 B | Module-LWE/SIS |
| ML-DSA-65 | Lattice | Sig | 1,952 B | 3,293 B | Module-LWE/SIS |
| ML-DSA-87 | Lattice | Sig | 2,592 B | 4,595 B | Module-LWE/SIS |
| SLH-DSA-128f | Hash | Sig | 32 B | 17,088 B | Hash security |
| SLH-DSA-128s | Hash | Sig | 32 B | 7,856 B | Hash security |

## 6. Side-Channel Relevance

### 6.1 RSA Side-Channel Attacks
- **Timing attack** (Kocher, 1996): Measure modular exponentiation time
- **Power analysis (SPA/DPA)**: Attack CRT-based private key operations
- **Bellcore attack**: Fault injection during CRT reveals $p$ and $q$

### 6.2 ECC Side-Channel Attacks
- **Simple Power Analysis**: Identify double-and-add pattern
- **Horizontal DPA**: Extract nonce $k$ from ECDSA signing
- **Ladder attack**: Exploit non-constant-time Montgomery ladder

### 6.3 PQC Side-Channel Considerations
- **Kyber/ML-KEM**: NTT operations may leak; compression/decompression are targets
- **Dilithium/ML-DSA**: Rejection sampling timing can leak information
- **SPHINCS+**: Hash operations are typically constant-time
- **McEliece**: Goppa decoding may have data-dependent timing

## 7. References

1. Rivest, R., Shamir, A., Adleman, L. "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems." CACM, 1978.
2. NIST. FIPS 186-5: Digital Signature Standard. February 2023.
3. Bernstein, D. et al. "Curve25519: New Diffie-Hellman Speed Records." PKC 2006.
4. Peikert, C. "A Decade of Lattice Cryptography." Foundations and Trends in TCS, 2016.
5. NIST. FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard. August 2024.
6. NIST. FIPS 204: Module-Lattice-Based Digital Signature Standard. August 2024.
7. NIST. FIPS 205: Stateless Hash-Based Digital Signature Standard. August 2024.
8. Bernstein, D. et al. "SPHINCS+: Submission to the NIST Post-Quantum Cryptography Project." 2020.
9. McEliece, R. "A Public-Key Cryptosystem Based on Algebraic Coding Theory." DSN Progress Report, 1978.
10. Hoffstein, J., Pipher, J., Silverman, J. An Introduction to Mathematical Cryptography. Springer, 2014.
11. Chen, L. et al. "Report on Post-Quantum Cryptography." NIST IR 8105, 2016.
12. Cisco. "Post-Quantum Cryptography: Readiness Report." 2024.
