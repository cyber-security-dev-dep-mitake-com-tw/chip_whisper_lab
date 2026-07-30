
## Ch3 HW Security Ecosystem (硬體安全生態系統)

### 單元 3.8：Cryptographic Solutions (密碼學硬體解決方案)

#### 1. 核心定位：從「信任儲存」到「安全運算」

在前述單元中，我們探討了如何透過 PUF 與模糊提取器安全地「生成與儲存」金鑰。然而，有了金鑰之後，系統還需要進行加解密、數位簽章與身份驗證等運算。這正是密碼學硬體解決方案（Cryptographic Solutions）在硬體安全生態系中所扮演的角色。

雖然密碼學演算法完全可以透過純軟體（如 OpenSSL）在通用處理器（CPU）上執行，但在硬體安全（Hardware Security）的框架下，強烈要求將這些運算下放至**專屬的密碼學硬體協同處理器（Cryptographic Coprocessors）**。
其核心理由有三：

* **實體隔離（Physical Isolation）：** 確保金鑰明文在運算過程中，永遠不會載入到容易遭受緩衝區溢位攻擊的通用記憶體（DRAM）或 CPU 快取中。
* **效能與功耗（PPA Optimization）：** 硬體加速器能以數十倍的速度執行 AES 或 ECC 運算，同時大幅降低物聯網（IoT）邊緣裝置的能耗。
* **抗側信道攻擊能力（SCA Resistance）：** 軟體難以精確控制指令執行的時間與功耗，極易洩漏物理特徵；而硬體設計可從邏輯閘層級導入抗旁路攻擊的對策。

#### 2. 基礎密碼學硬體引擎 (Fundamental Cryptographic Engines)

一個符合現代安全規範（如 PSA Certified 或 FIPS 140-3）的密碼學硬體解決方案，必須包含以下三大類別的硬體加速引擎：

1. **對稱式加密與認證加密 (Symmetric Cryptography & AEAD)：**
* **AES 引擎：** 提供高吞吐量的大量資料加解密。現代硬體設計特別強調支援認證加密（AEAD）模式，如 AES-GCM (Galois/Counter Mode)。它能在加密資料的同時產生訊息鑑別碼（MAC），一次性確保資料的「機密性」與「完整性」，是安全啟動與 Flash 儲存加密的基石。


2. **非對稱式公鑰密碼學 (Asymmetric / Public Key Cryptography)：**
* **ECC (橢圓曲線密碼學) / RSA 引擎：** 由於涉及龐大的大數模運算（Modular Arithmetic），硬體實作通常會內建蒙哥馬利乘法器（Montgomery Multiplier）來加速。
* **主要應用：** ECDSA / EdDSA 用於驗證遠端韌體更新（OTA）的數位簽章；ECDH 用於與雲端伺服器安全地協商對話金鑰（Session Key Exchange）。


3. **密碼雜湊函數 (Cryptographic Hash Functions)：**
* **SHA-2 / SHA-3 引擎：** 負責將任意長度的資料壓縮為固定長度的摘要。在硬體信任根的「測量（Measurement）」階段，SHA 引擎是計算 Bootloader 雜湊值並建立信任鏈的關鍵組件。



#### 3. 抵禦實體攻擊的進階硬體設計 (Physical Attack Countermeasures)

一個優秀的密碼學硬體解決方案，不能僅僅「正確地」實作數學演算法，更必須「安全地」防禦側信道攻擊（SCA，如差分功耗分析 DPA）。在 RTL（暫存器傳輸級）與邏輯閘設計上，通常會導入以下反制技術：

* **遮蔽技術 (Masking)：**
透過隨機數將運算中的敏感資料（如金鑰與明文）隨機化。例如布林遮蔽（Boolean Masking），將變數 $v$ 拆分為多個份額（Shares），如 $v = m \oplus r$（其中 $r$ 為隨機遮蔽值，$m$ 為遮蔽後的資料）。這使得單次運算的功耗與真實資料脫鉤，攻擊者必須同時測量並結合多個點的洩漏才能破解，呈指數級增加了攻擊難度。
* **隱藏技術 (Hiding)：**
在時域（Time Domain）與振幅域（Amplitude Domain）上抹平功耗差異。
* *時域隱藏：* 導入隨機時脈抖動（Clock Jitter）或插入假指令（Dummy Operations），使攻擊者難以對齊功耗波形。
* *振幅域隱藏：* 使用雙軌預充電邏輯（Dual-Rail Pre-charge Logic, DPA-resistant Logic Gates），確保無論運算的是 `0` 還是 `1`，邏輯閘消耗的總電量始終保持恆定。



#### 4. 密碼學模組的安全邊界與標準合規 (Standardization & Compliance)

開發密碼學硬體解決方案時，必須嚴格界定**密碼模組邊界（Cryptographic Boundary）**。
根據美國國家標準暨技術研究院（NIST）的 FIPS 140-3 規範，邊界內的所有金鑰生成、儲存、匯入/匯出與加解密運算，都必須受到嚴格控管。

* **CAVP (Cryptographic Algorithm Validation Program)：** 驗證硬體引擎實作的數學演算法（如 AES, SHA）是否完全符合 NIST 頒布的標準。
* **CMVP (Cryptographic Module Validation Program)：** 進一步驗證整個硬體模組的安全架構，包括防篡改實體設計、金鑰清零機制（Zeroization）以及角色存取控制（Role-based Access Control）。

---

### 參考資料 (References & Sources)

1. **NIST SP 800-38D** - *Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC*. (美國國家標準暨技術研究院針對 AES-GCM 認證加密模式的官方標準，為現代安全晶片必備的硬體加速演算法)。
2. **Mangard, S., Oswald, E., & Popp, T. (2008).** *Power Analysis Attacks: Revealing the Secrets of Smart Cards*. Springer. (深入探討密碼學硬體設計如何抵禦差分功耗分析 (DPA) 以及 Masking / Hiding 技術實踐的權威教科書)。
3. **FIPS 140-3** - *Security Requirements for Cryptographic Modules*. (全球公認最嚴謹的密碼學模組安全設計、隔離邊界與實體防篡改驗證標準)。

