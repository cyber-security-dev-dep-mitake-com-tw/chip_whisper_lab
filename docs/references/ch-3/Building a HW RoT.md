

## Ch3 HW Security Ecosystem (硬體安全生態系統)

### 單元 3.3：Building a HW RoT (1) (建構硬體信任根 - 核心架構與組件)

#### 1. 信任根的建構思維：從「功能」走向「隔離」

在現代系統單晶片（SoC）中建構硬體信任根（Hardware Root of Trust, HRoT），並不是單純地將加密演算法的矽智財（IP）放進晶片中即可。建構 HRoT 的核心思維在於「安全邊界（Security Boundary）」的劃分。

如果密碼學引擎與一般的應用程式處理器（Application Processor, AP）共享同一條資料匯流排與記憶體空間，那麼作業系統層級的軟體漏洞（如緩衝區溢位）就能輕易跨越邊界，讀取正在執行加密運算的金鑰明文。因此，建構 HRoT 的第一步，是建立一個實體或微架構級別的隔離環境（Secure Enclave / Subsystem）。

#### 2. 建構 HRoT 的核心硬體組件 (Core Hardware Components)

一個標準且完善的 HRoT 子系統，必須在安全的實體邊界內整合以下基礎硬體組件：

* **專屬安全微控制器 (Secure MCU / Sequencer)：**
HRoT 內部通常擁有自己獨立的微型處理器（如精簡版的 ARM Cortex-M 或 RISC-V 核心），專門負責執行安全狀態機與密碼學協定，完全不依賴外部的主 CPU。
* **硬體唯一金鑰儲存 (Hardware Unique Key Storage)：**
用於存放晶片獨一無二的根金鑰。常見的實作方式包括一次性可程式化記憶體（OTP / eFuse）或物理不可複製功能（PUF）。此區域的電路設計必須保證外部軟體「絕對無法直接讀取」。
* **真隨機亂數產生器 (TRNG)：**
作為所有密碼學運算的熵源（Entropy Source），必須通過 NIST SP 800-90B 等嚴格的隨機性統計檢測。
* **密碼學硬體加速器 (Cryptographic Accelerators)：**
包含對稱式加密（AES）、非對稱式加密（RSA/ECC）與雜湊函數（SHA-256/384）的專屬邏輯電路，確保加解密過程高效且不會佔用主系統資源。

#### 3. 金鑰管理單元 (Key Management Unit, KMU)

建構 HRoT 的關鍵在於如何安全地「使用」金鑰。KMU 是一組特殊的硬體路由邏輯。當系統需要進行加密時，軟體只能發送「指令（Command）」與「密文/明文資料」給 HRoT。KMU 會在硬體內部將根金鑰（或推導出的子金鑰）直接匯入密碼學加速器中。
整個過程中，**金鑰明文永遠不會出現在一般的系統匯流排（System Bus）或主記憶體（DRAM）中**，達成嚴格的「金鑰不可見性（Key Invisibility）」。

---

### 單元 3.4：Building a HW RoT (2) (建構硬體信任根 - 系統整合與進階防禦)

#### 1. 信任根的動態執行機制 (Root of Trust Services)

在系統運作時，HRoT 必須提供多個維度的信任基礎。根據 TCG (Trusted Computing Group) 與全球平台 (GlobalPlatform) 的定義，一個完整的 HRoT 必須實現以下信任根服務：

| 信任根服務 (RoT Services) | 核心功能說明 |
| --- | --- |
| **測量信任根 (RoTM)** | 負責在系統啟動時，對 Bootloader 與作業系統計算密碼學雜湊值（Hash），確保程式碼未遭竄改。 |
| **儲存信任根 (RoTS)** | 提供硬體級別的金鑰綁定（Key Wrapping）與資料加密，保護存放於外部 Flash 中的靜態資料。 |
| **報告信任根 (RoTR)** | 利用硬體私鑰對系統的「測量狀態」進行數位簽章，向外部伺服器證明裝置的合法狀態（Device Attestation）。 |
| **更新信任根 (RoTU)** | 負責驗證遠端韌體更新（OTA）的簽章與授權，防止降級攻擊（Downgrade Attacks）。 |

#### 2. 安全啟動的硬體綁定 (Secure Boot Binding)

建構 HRoT 時，必須確保系統的「控制權移交」是不可逆且受驗證的。
HRoT 會控制晶片的主重置訊號（Main Reset Signal）。在上電（Power-on）初期，主 CPU 被強制處於停機狀態，只有 HRoT 內部的安全微處理器開始執行 **Boot ROM（不可變更的啟動唯讀記憶體）**。
HRoT 讀取外部快閃記憶體中的第一階段開機載入程式（First Stage Bootloader, FSBL），透過硬體 RSA/ECC 引擎驗證其數位簽章。只有當簽章完全吻合原廠公鑰時，HRoT 才會釋放主 CPU 的重置訊號，允許系統繼續開機。這建立了堅不可摧的**信任鏈（Chain of Trust）**。

#### 3. 實體與側信道防護設計 (Anti-Tamper & Side-Channel Countermeasures)

為了防止攻擊者繞過上述的邏輯防護，HRoT 在實體電路佈局（Physical Layout）上必須導入反制措施：

* **環境與故障偵測器 (Environmental & Fault Sensors)：**
在 HRoT 電路周邊佈建電壓毛刺偵測器（Voltage Glitch Detectors）、頻率監控器與溫度感測器。一旦偵測到異常（例如攻擊者企圖用雷射打擊晶片引發錯誤注入），HRoT 會立刻觸發警報，並瞬間抹除揮發性記憶體中的金鑰（Zeroization）。
* **側信道防護 (SCA Resistance)：**
對於執行 AES 或 ECC 的硬體電路，導入「布林遮蔽（Boolean Masking）」技術，在運算過程中加入隨機數，使晶片運算時的功耗波形（Power Profile）與正在處理的金鑰資料脫鉤，防禦差分功耗分析（DPA）。
* **主動防護網 (Active Mesh)：**
在高等級的安全晶片（如 Smart Card 或 HSM）頂層金屬佈置細密的感測網線。若攻擊者企圖使用化學腐蝕或聚焦離子束（FIB）破壞封裝，會立刻切斷網線改變電阻值，觸發硬體自毀機制。

---

### 參考資料 (References & Sources)

1. **GlobalPlatform** - *Root of Trust Definitions and Requirements*. (定義硬體信任根的隔離邊界、架構需求與各項信任根服務 (RoTM, RoTS, RoTR) 的國際標準文件)。
2. **Trusted Computing Group (TCG)** - *TCG Roots of Trust Specification*. (詳細論述測量信任根在安全啟動與裝置鑑證架構中扮演之核心角色的權威規範)。
3. **Kocher, P., et al. (1999).** *Differential Power Analysis*. Advances in Cryptology — CRYPTO. (奠定側信道攻擊（SCA）理論基礎，並推動現代安全晶片必須建構硬體級功耗遮蔽與防篡改設計之經典學術論文)。

