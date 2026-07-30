

## Ch1 HW Security Standard & Regulation (硬體安全標準與規範)

### 單元 1.1：FIPS 140-2 overview (FIPS 140-2 標準概述)

#### 1. 什麼是 FIPS 140-2？ (Introduction to FIPS 140-2)

FIPS 140-2 全稱為《聯邦資訊處理標準第 140-2 號》（Federal Information Processing Standard Publication 140-2），是由美國國家標準暨技術研究院（NIST）與加拿大通訊安全局（CSE）共同制定的權威性資訊安全標準。

該標準的核心目的，在於規範「**密碼模組（Cryptographic Modules）**」的安全需求。任何被美國與加拿大聯邦政府機構採購，用於保護「敏感但非機密（Sensitive but Unclassified, SBU）」資訊的軟硬體產品，其內部的加解密運作機制皆必須通過 FIPS 140-2 的認證。如今，該標準已跨越政府採購範疇，成為全球金融、醫療與高科技產業界公認的硬體安全基礎標竿。

#### 2. 密碼模組與安全邊界 (Cryptographic Module and Boundary)

在探討 FIPS 140-2 時，對 IC 設計工程師而言最重要的概念是「**密碼邊界（Cryptographic Boundary）**」。

FIPS 140-2 強制要求開發者明確定義哪些硬體元件、軟體程式碼與資料路徑包含在密碼模組之內。在晶片設計中，這意味著必須將執行 AES/RSA 運算的硬體加速器、金鑰儲存記憶體（如 SRAM、eFuse）以及相關的控制邏輯，與主系統（如一般的 CPU 核心與外部匯流排）在物理與邏輯上明確隔離。邊界內部的所有明文金鑰與關鍵安全參數（Critical Security Parameters, CSPs），絕對不允許未經授權與未經加密地穿越邊界流出。

#### 3. 四個安全等級 (The Four Security Levels)

FIPS 140-2 並非單一標準，而是依據應用的風險程度，將密碼模組的安全要求由低至高劃分為四個等級（Level 1 到 Level 4）。對於硬體安全（Hardware Security）而言，Level 3 與 Level 4 才是 IC 設計真正的考驗：

* **Security Level 1（等級 1）：**
最低的安全要求。僅要求模組使用 NIST 核准的密碼演算法（如 AES, SHA-256），對實體防護（Physical Security）沒有任何特殊要求。通常純軟體的密碼學函式庫（如標準版 OpenSSL）即可達到此等級。
* **Security Level 2（等級 2）：**
在 Level 1 的基礎上，增加了防篡改跡象（Tamper-Evident）的實體要求。例如硬體設備必須使用防拆封條或特殊的防拆塗層，一旦被打開就會留下無法抹滅的物理痕跡。此外，要求基於角色（Role-based）的身份驗證。
* **Security Level 3（等級 3）：**
這是高階安全晶片（如智慧卡、HSM）的基礎門檻。不僅要求 Tamper-Evident，更要求**防篡改抵抗力（Tamper-Resistant）**。模組必須具備主動偵測實體入侵的電路。一旦偵測到晶片封裝被強行打開或探針接觸，必須在毫秒內自動觸發「**歸零機制（Zeroization）**」，徹底抹除內部的明文金鑰與 CSP。此外，要求更嚴格的基於身份（Identity-based）的驗證機制，且金鑰的匯入/匯出必須與其他資料路徑在實體連接埠上完全隔離。
* **Security Level 4（等級 4）：**
最高安全等級。除了 Level 3 的嚴格物理防護外，還強制要求**環境失效保護（Environmental Failure Protection, EFP）**。攻擊者經常利用極端的高低溫或電壓突波（Voltage Glitching）來引發晶片邏輯錯誤，藉此繞過安全機制。Level 4 的晶片必須內建精密的環境感測器，當電壓或溫度超出正常運作的容許範圍時，模組能主動將自身鎖定或清零機密資料，以抵禦進階的錯誤注入攻擊（Fault Injection Attacks）。

#### 4. FIPS 140-2 對 IC 設計的深遠影響

對於現代 SoC 開發者而言，了解 FIPS 140-2 的意義在於將「法規規範」轉化為「硬體規格」。為了取得高等級（Level 3/4）認證，硬體工程師在架構初期就必須導入獨立的安全微處理器（Secure MCU）、硬體真隨機亂數產生器（TRNG）以及防側信道洩漏的電路設計，這些概念正是建立硬體信任根（HRoT）的核心基礎。

---

### 參考資料 (References & Sources)

1. **NIST FIPS PUB 140-2** - *Security Requirements for Cryptographic Modules*. (由美國國家標準暨技術研究院發布的官方標準文件，詳細定義了密碼模組的 11 個安全檢驗領域與四個等級的技術要求)。
2. **NIST Cryptographic Module Validation Program (CMVP)** - *Implementation Guidance for FIPS PUB 140-2 and the Cryptographic Algorithm Validation Program*. (為 IC 與設備製造商提供的實作指引，解釋如何設計硬體隔離邊界與實體防護機制以通過實驗室審查)。