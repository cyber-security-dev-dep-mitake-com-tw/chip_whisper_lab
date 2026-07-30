

## Ch1 HW Security Standard & Regulation (硬體安全標準與規範)

### 單元 1.3：CAVP and Security Objectives (CAVP 演算法驗證與安全目標)

#### 1. 什麼是 CAVP？ (Cryptographic Algorithm Validation Program)

在探討硬體安全模組認證（如 FIPS 140-3）時，必須釐清一個核心觀念：**系統的安全建立在底層演算法的正確實作之上**。為此，美國國家標準暨技術研究院（NIST）與加拿大通訊安全局（CSE）共同設立了**密碼演算法驗證計畫（CAVP）**。

CAVP 的唯一目的，是透過嚴格的測試向量（Test Vectors），驗證軟體或硬體矽智財（IP）所實作的密碼學演算法（如 AES, SHA-3, RSA, ECC, DRBG 等）是否「在數學與邏輯上」完全符合 NIST 發布的聯邦資訊處理標準（FIPS）與特別出版品（NIST SP）規範。

* **CAVP 與 CMVP 的相依性：**
CAVP 驗證的是「演算法本身」，而前兩節探討的 CMVP（密碼模組驗證計畫，即 FIPS 140 認證）驗證的則是「整個硬體模組的安全架構與實體防護」。在申請 CMVP 認證之前，模組內部所使用的所有密碼學演算法，**必須無一例外地先取得 CAVP 認證憑證**。

#### 2. CAVP 測試機制與自動化 (From CAVS to ACVP)

對於 IC 設計工程師而言，將密碼學演算法實作於硬體（RTL 階段）後，必須確保其邏輯閘的運算結果完美無瑕。

* **已知答案測試 (Known Answer Tests, KAT)：**
CAVP 會提供包含明文、金鑰與初始化向量（IV）的測試集合。硬體引擎必須處理這些資料，並輸出密文或雜湊值。若輸出與 CAVP 提供的「已知正確答案」有一個位元的落差，驗證即宣告失敗。
* **蒙地卡羅測試 (Monte Carlo Tests)：**
為了驗證硬體引擎在連續執行大量加密運算時的狀態穩定性（例如 AES 引擎在處理串流資料時的內部計數器與緩衝區），CAVP 會要求執行數百萬次的迭代運算，並檢查最終狀態的正確性。
* **ACVP 自動化測試協定：**
傳統的 CAVP 測試依賴人工交換測試檔案（CAVS 工具）。隨著技術演進，NIST 已全面過渡至 **ACVP (Automated Cryptographic Validation Protocol)**。硬體開發商需透過網路 API 直接與 NIST 伺服器對接，自動獲取測試向量並回傳運算結果，大幅縮短了硬體演算法 IP 的驗證週期。

#### 3. 硬體密碼模組的安全目標 (Security Objectives)

無論是通過 CAVP 還是 CMVP，這些標準與驗證計畫最終都是為了達成密碼模組的核心「安全目標」。在 IC 設計中，這些目標被具體轉化為硬體架構的要求：

1. **機密性 (Confidentiality)：**
確保敏感資料（特別是明文金鑰、PIN 碼、種子亂數）絕對不被未經授權的實體讀取。
* *硬體實現：* 透過記憶體隔離、安全匯流排（Secure Bus），以及抗實體探針的防篡改電路來達成。


2. **完整性 (Integrity)：**
保證資料、韌體程式碼或密碼學演算法在儲存與傳輸過程中未遭惡意竄改。
* *硬體實現：* 透過 SHA 硬體引擎計算雜湊值，並結合 ECDSA/RSA 進行數位簽章驗證（如 Secure Boot 過程），防禦惡意韌體注入。


3. **鑑別性與不可否認性 (Authentication & Non-repudiation)：**
確認通訊對端或設備的真實身分，並確保發送方無法否認曾發出過該訊息。
* *硬體實現：* 透過硬體信任根（HRoT）內部安全儲存的裝置私鑰（Device Private Key）進行簽章，向雲端伺服器進行裝置鑑證（Device Attestation）。


4. **可用性與防護彈性 (Availability & Resiliency)：**
在面臨攻擊或極端環境干擾時，系統應能維持基本運作，或至少能安全地關閉，避免洩漏機密。
* *硬體實現：* 包含看門狗計時器（Watchdog Timers）、雙核鎖步執行（Lockstep）錯誤偵測，以及在遭受錯誤注入攻擊時瞬間觸發的金鑰清零機制（Zeroization）。



#### 4. CAVP 對 IC 設計的實務意義

對開發安全 SoC 的企業而言，取得 CAVP 認證代表該晶片的密碼硬體加速器具備了最高等級的運算正確性與合規性保證。這不僅是進軍政府採購、金融支付（如 EMVCo）、車用安全與高階物聯網市場的「入場券」，更是向客戶證明晶片底層安全品質的最佳背書。

---

### 參考資料 (References & Sources)

1. **NIST SP 800-140C** - *CMVP Approved Security Functions*. (詳細列出了 FIPS 140-3 框架下，哪些密碼學演算法是核准使用的，並且必須通過 CAVP 測試)。
2. **NIST Cryptographic Algorithm Validation Program (CAVP) Official Guidelines** - (提供關於已知答案測試 (KAT) 與蒙地卡羅測試方法學的官方技術文件)。
3. **IETF RFC 8959** - *Automated Cryptographic Validation Protocol (ACVP)*. (定義了現代自動化密碼演算法驗證系統架構與網路通訊協定的國際標準)。

---

## Ch1 HW Security Standard & Regulation (硬體安全標準與規範)

### 單元 1.4：Case Studies: Attacks on HW Security (硬體安全攻擊實例分析)

#### 1. 案例分析在 IC 安全設計中的價值

在探討了 FIPS 標準與 CAVP 驗證後，我們必須理解：所有的安全規範與標準，皆是建立在過去無數次慘痛的遭駭經驗之上（即所謂的「Security is written in blood」）。硬體與軟體最大的不同在於其**不可變性（Immutability）**。軟體漏洞可以透過線上更新（OTA）修補，但一旦 IC 流片（Tape-out）並佈建於市場，底層硬體的邏輯缺陷或實體防護漏洞將造成無法挽回的災難。

透過剖析歷史上具代表性的硬體安全攻擊事件，IC 設計工程師能更深刻地理解威脅模型（Threat Model），並體認到嚴格遵守安全規範（如 FIPS 140-3 要求的抗側信道設計與防篡改機制）的必要性。

#### 2. 案例一：唯讀記憶體漏洞與不可變更的代價 (Fusée Gelée 攻擊)

* **攻擊目標：** Nvidia Tegra X1 系統單晶片（廣泛應用於 Nintendo Switch 與多款車載資訊系統）。
* **攻擊手法 (USB 控制傳輸溢位)：**
攻擊者發現在晶片處於 USB 恢復模式（RCM）時，其內建的 **Boot ROM（開機唯讀記憶體）** 處理 USB 控制傳輸請求的程式碼中，存在一個傳統的緩衝區溢位（Buffer Overflow）漏洞。攻擊者透過發送特製長度的 USB 封包，成功覆蓋了處理器的直接記憶體存取（DMA）緩衝區，進而劫持了系統的控制流（Control Flow），在最高權限下執行未經數位簽章的任意程式碼。
* **硬體安全省思：**
Boot ROM 是硬體信任根（HRoT）的第一環，被固化在矽晶片中，絕不可被修改。這個漏洞證明了，即使後續的韌體與作業系統再安全，只要「第零層」的 Boot ROM 有瑕疵，整個信任鏈便瞬間瓦解。受影響的數千萬顆晶片無法透過軟體修補，原廠只能被迫重新設計光罩並發布新版晶片。這凸顯了在 RTL 設計與流片前進行正規驗證（Formal Verification）的極端重要性。

#### 3. 案例二：演算法實作瑕疵與密碼學災難 (ROCA 攻擊 / CVE-2017-15361)

* **攻擊目標：** 德國英飛凌（Infineon）生產的 Trusted Platform Module (TPM) 安全晶片。該晶片廣泛應用於全球數億台企業級筆記型電腦、伺服器，甚至國家發行的國民身分證（如愛沙尼亞 e-ID）中。
* **攻擊手法 (RSA 金鑰生成演算法缺陷)：**
英飛凌為了加速晶片內部 RSA 金鑰對的生成速度，採用了一種名為 "Fast Prime" 的專利演算法來產生質數。然而，研究人員發現，該演算法產生的質數存在特定的數學結構與規律（即熵值嚴重不足）。攻擊者只需取得使用者的 RSA「公鑰（Public Key）」，就能利用 Coppersmith 攻擊法，在幾天甚至幾個小時內，透過普通的雲端運算資源反推出對應的「私鑰（Private Key）」。
* **硬體安全省思：**
該晶片雖然通過了 Common Criteria (CC) 與 FIPS 的高等級認證，但其底層的演算法「實作方式」卻存在數學缺陷。此案例呼應了前一節探討的 **CAVP（密碼演算法驗證）** 核心價值：硬體加速引擎為了追求效能（PPA）所做的任何捷徑與優化，都絕不能以犧牲密碼學嚴謹度與隨機性為代價。

#### 4. 案例三：硬體實體攻擊與錯誤注入 (Xbox 360 Reset Glitch Hack)

* **攻擊目標：** 微軟 Xbox 360 遊戲主機的主處理器。
* **攻擊手法 (電壓/時脈錯誤注入, CPU Glitching)：**
Xbox 360 具備極其嚴格的硬體安全啟動（Secure Boot）機制，會逐層驗證開機程式碼的數位簽章。攻擊者（如知名的駭客 GliGli）發現，如果在 CPU 驗證數位簽章（執行 `memcmp` 記憶體比對指令）的極短瞬間，透過外部改裝晶片向 CPU 的重置腳位（Reset Pin）或供電線路發送一個長度僅有幾十奈秒（Nanoseconds）的精準電壓脈衝（Glitch）。
這個微小的干擾不會讓 CPU 當機，但會造成其內部邏輯閘的狀態瞬間錯亂，迫使 CPU 跳過驗證失敗的指令，直接判定「簽章合法」，進而載入盜版或自製作業系統。
* **硬體安全省思：**
這是一個典型的**錯誤注入攻擊（Fault Injection, FI）**。軟體程式碼的邏輯再嚴密（如 `if (signature_valid)`），在物理攻擊面前依然脆弱。為了抵禦此類攻擊，現代安全 IC 必須符合 FIPS 140-3 Level 3/4 的要求，內建**環境感測器（Environmental Sensors）**以偵測異常的電壓/時脈毛刺，並導入**邏輯冗餘（Logic Redundancy）**，確保關鍵的安全判斷不會因為單一的位元翻轉而遭到繞過。

#### 5. 總結：從案例中學習的防禦縱深

上述三個案例分別展示了硬體設計在**韌體邏輯（Boot ROM）**、密碼學實作（演算法缺陷）**以及**實體運作環境（錯誤注入）三個維度上的脆弱性。這清楚地說明了，IC 的安全設計不能僅依賴單一防線，必須建構縱深防禦（Defense in Depth），這也正是後續我們將探討密碼學金鑰與真隨機亂數（TRNG）標準的根本原因。

---

### 參考資料 (References & Sources)

1. **Temkin, K. (2018).** *Vulnerability Disclosure: Fusée Gelée*. (詳細記錄 Nvidia Tegra X1 Boot ROM 緩衝區溢位漏洞與硬體不可變性災難的技術披露報告)。
2. **Nemec, M., et al. (2017).** *The Return of Coppersmith's Attack: Practical Factorization of Widely Used RSA Moduli*. ACM SIGSAC Conference on Computer and Communications Security. (ROCA 攻擊的原始學術論文，揭露了晶片內部演算法實作瑕疵如何導致 RSA 私鑰被攻破)。
3. **Bulygin, Y., & Samyde, D. (2012).** *Fault injection attacks on secure systems*. Black Hat Briefings. (剖析如何利用微小的電壓/時脈毛刺繞過硬體安全啟動邏輯，並探討硬體層次的反制措施)。

