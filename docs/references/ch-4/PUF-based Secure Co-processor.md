

## Ch4 Security on Chip (晶片內建安全架構)

### 單元 4.4 & 4.5：PUF-based Secure Co-processor (基於 PUF 的安全協同處理器架構與整合)

#### 1. 從「密碼學加速器」到「安全協同處理器」的演進

在傳統的系統單晶片（SoC）設計中，為了提升加密效能，通常會加入「密碼學加速器（Crypto Accelerator）」。然而，單純的加速器只負責數學運算，金鑰的管理與安全啟動流程仍需依賴主處理器（Main CPU）與作業系統，這在面對軟體與實體攻擊時顯得極為脆弱。

**安全協同處理器（Secure Co-processor）**則是一個獨立自治的硬體子系統。它擁有自己的微控制器（MCU）、專屬記憶體與安全狀態機。當我們將**物理不可複製功能（PUF）**作為最高信任錨點（Trust Anchor）深度整合進安全協同處理器時，便形成了現代高階 IC 晶片中最強大的防護架構：**「無靜態金鑰（Keyless）」的硬體信任根平台**。

#### 2. 基於 PUF 的安全協同處理器架構設計 (架構與組件)

一個完整的 PUF-based Secure Co-processor 必須在矽晶片上劃定嚴格的實體與邏輯邊界（Security Boundary）。其核心硬體架構包含：

* **實體熵源與金鑰生成區：**
包含 PUF 巨集電路（PUF Macro）與模糊提取器（Fuzzy Extractor / ECC 引擎）。這部分專門負責在系統上電時，動態擷取晶片的微觀物理變異，並穩定生成**硬體唯一金鑰（Hardware Unique Key, HUK）**。
* **動態金鑰管理單元 (Key Management Unit, KMU)：**
這是協同處理器的神經中樞。KMU 負責將 PUF 生成的 HUK 直接路由（Route）到對應的密碼學引擎。在硬體線路設計上，**金鑰的資料流（Data Path）與主系統的控制流（Control Path）是完全物理隔離的**。
* **密碼學叢集 (Crypto Cluster)：**
包含防禦側信道攻擊（SCA）的 AES、SHA、RSA/ECC 硬體引擎，以及真隨機亂數產生器（TRNG）。
* **信箱通訊介面 (Mailbox / IPC Interface)：**
協同處理器與主處理器唯一的溝通橋樑。主處理器只能將「待處理的明文/密文」與「指令參數」放入信箱，無法存取協同處理器內部的任何暫存器與金鑰。

#### 3. 核心運作機制與安全服務 (動態執行與隔離)

基於 PUF 的協同處理器不僅僅保護金鑰，它接管了整個系統的安全生命週期：

* **無靜態金鑰儲存 (Keyless Storage at Rest)：**
在傳統架構中，若攻擊者利用電子顯微鏡（SEM）或 FIB 觀察 eFuse，可能竊取靜態金鑰。而在 PUF 協同處理器中，只要系統斷電，HUK 便不復存在。所有的應用金鑰（如硬碟加密金鑰、雲端連線金鑰）都是在運行時，透過 NIST SP 800-108 標準的金鑰推導函數（KDF），以 HUK 為基礎動態衍生出來的。
* **安全啟動的絕對控制權 (Absolute Control of Secure Boot)：**
系統上電後，主處理器的重置訊號（Reset Signal）是被鎖定的。PUF 協同處理器會率先甦醒，動態生成根金鑰，驗證外部快閃記憶體中第一階段 Bootloader 的數位簽章。只有當驗證完美通過，協同處理器才會釋放主 CPU，完成信任鏈（Chain of Trust）的移交。
* **雲端零接觸佈建 (Zero-Touch Provisioning)：**
協同處理器可利用 PUF 動態生成非對稱式金鑰對（Public/Private Key Pair）。私鑰永遠不出硬體邊界，公鑰則交由憑證授權中心（CA）簽署為 X.509 憑證，供物聯網設備在首次連網時向 AWS/Azure 進行基於硬體的自動化身份鑑證。

#### 4. 高階實體攻擊之主動反制 (Active Countermeasures)

身為系統的最後一道防線，PUF 協同處理器內部佈署了最嚴密的防篡改機制，以應對上一節提到的「惡意實體攻擊（Malicious Attacks）」：

1. **環境感測與主動清零 (Environmental Sensing & Zeroization)：**
協同處理器內部整合了電壓、頻率與溫度感測器。一旦攻擊者企圖發動雷射錯誤注入（FI）或電壓毛刺（Glitching），感測器會瞬間觸發最高級別的硬體中斷。KMU 會在幾微秒內切斷 PUF 電源，並利用隨機數覆寫內部 SRAM，將所有衍生金鑰「清零（Zeroized）」，確保攻擊者一無所獲。
2. **抗側信道保護層 (SCA Resistance at the Core)：**
由於 PUF 的讀取與金鑰重建過程是側信道攻擊的高危險區，協同處理器在電路設計上會對 PUF 讀取邏輯與密碼學引擎全面實施布林遮蔽（Boolean Masking）與時鐘抖動（Clock Jittering），打破功耗、電磁輻射與金鑰之間的統計相關性。

#### 5. 課程總結：邁向零信任的 IC 設計基礎

總結《IC 設計中必須懂的資安基礎 (Security Considerations for IC Design)》全系列課程：
從傳統的法規標準（Ch1）、硬體信任根與 PUF 的物理機制（Ch2），到生態系中的實體威脅與防禦標準（Ch3），最終收斂於系統層級的隔離架構與 PUF 安全協同處理器（Ch4）。

我們可以看到，**「安全（Security）」已經不再只是軟體工程師的責任。** 現代零信任架構（Zero Trust Architecture）的根基，完全建立在不可變、抗攻擊且具備唯一物理指紋的「硬體矽晶片」之上。只有透過 Security-by-Design（安全源於設計）的方法論，將 PUF 信任根深度整合於 SoC 中，才能在日益險惡的物聯網與邊緣運算環境中，提供真正堅不可摧的安全防禦。

---

### 參考資料 (References & Sources)

1. **Fletcher, C. W., et al. (2012).** *A PUF-based secure processor architecture*. Proceedings of the IEEE. (探討如何將物理不可複製功能深度整合至處理器微架構中，以實現動態金鑰管理與隔離的先驅學術論文)。
2. **FIPS 140-3** - *Security Requirements for Cryptographic Modules*. National Institute of Standards and Technology. (美國國家標準暨技術研究院針對硬體密碼學模組（如協同處理器）在物理防篡改邊界、環境感測器與主動清零機制的最高設計規範)。
3. **GlobalPlatform** - *TEE Hardware Security Root Specification*. (定義硬體安全協同處理器如何為上層的可信執行環境（TEE）提供底層加密服務、安全綁定與金鑰推導之國際標準)。

