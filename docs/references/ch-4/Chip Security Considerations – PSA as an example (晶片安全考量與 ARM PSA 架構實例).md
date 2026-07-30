

## Ch4 Security on Chip (晶片內建安全架構)

### 單元 4.1：Chip Security Considerations – PSA as an example (晶片安全考量與 ARM PSA 架構實例)

#### 1. 晶片層級的安全設計考量 (Chip Security Considerations)

在前一章探討了廣泛的硬體安全生態系後，本章將焦點縮小至單一「系統單晶片 (SoC)」內部的安全架構設計。現代物聯網 (IoT) 與邊緣運算設備面臨著軟體遠端攻擊與實體近端攻擊的雙重威脅，因此在晶片設計初期，必須考量以下核心安全原則：

* **實體與邏輯隔離 (Isolation)：** 確保不受信任的第三方應用程式（或主作業系統）無法直接越界存取密碼學金鑰與安全周邊設備。
* **不可變的信任錨點 (Immutable Trust Anchor)：** 晶片必須具備硬體信任根 (HRoT)，以執行無可篡改的安全啟動 (Secure Boot)。
* **安全生命週期狀態 (Secure Lifecycle States)：** 晶片必須能感知自身處於製造、佈建、現場運行或報廢狀態，並依此嚴格限縮除錯介面（如 JTAG）的硬體存取權限。
* **信任服務的標準化 (Standardized Trust Services)：** 提供統一的安全應用程式介面 (API)，供上層軟體呼叫加解密或裝置鑑證服務。

#### 2. ARM 平台安全架構 (Platform Security Architecture, PSA) 簡介

為了解決物聯網晶片安全設計過度碎片化的問題，ARM 提出了 **Platform Security Architecture (PSA)**。PSA 並非單一的矽智財 (IP) 或單純的軟體，而是一套從威脅建模到安全認證的**完整框架與方法論**。它為 IC 設計公司與軟體開發者提供了一套標準化的「安全藍圖」。

PSA 框架包含四個核心階段：

1. **Analyze (分析)：** 針對不同的應用場景（如智慧電表、無人機），提供標準化的威脅模型與安全分析 (TMSA)，定義設備需要防禦哪些特定攻擊向量。
2. **Architect (架構)：** 制定硬體與韌體架構規範。最核心的概念是將系統的執行空間嚴格劃分為**安全處理環境 (Secure Processing Environment, SPE)** 與**非安全處理環境 (Non-Secure Processing Environment, NSPE)**。
3. **Implement (實作)：** ARM 提供開源的參考實作，例如 Trusted Firmware-M (TF-M)，協助開發者快速將 PSA 規範落地到硬體微控制器上。
4. **Certify (認證)：** 透過獨立的第三方實驗室，提供「PSA Certified」的安全等級評估，為晶片與設備的抗攻擊能力提供客觀背書。

#### 3. 核心架構：PSA 韌體框架 (PSA Firmware Framework, PSA-FF)

為了落實硬體層級的隔離，PSA 定義了韌體框架 (PSA-FF)。如上圖所示，這套框架的運作邏輯建構在嚴格的邊界之上：

https://www.symmetryelectronics.com/blog/arm-platform-security-architecture-can-it-secure-the-iot/

* **執行環境的二分法：**
一般的作業系統 (如 FreeRTOS, Linux) 與應用程式運行在左側的 **NSPE (Non-Secure Processing Environment)** 中。而所有涉及機密的密碼學運算、信任根服務與硬體金鑰，則全部被封裝在右側的 **SPE (Secure Processing Environment)** 內部。
* **安全分區 (Secure Partitions, SP)：**
在 SPE 內部，不同的安全服務（例如：加密服務、儲存服務、鑑證服務）會被劃分成獨立的「安全分區」。這確保了即使某一個次要的安全服務存在漏洞，攻擊者也無法橫向越權波及其他的機密服務。
* **安全分區管理員 (Secure Partition Manager, SPM)：**
SPM 是 SPE 內部的核心特權軟體（類似於微核心）。它負責管理安全分區之間的硬體隔離機制，以及處理 NSPE 與 SPE 之間的**安全跨行程通訊 (Secure IPC)**。當外部應用程式需要加密時，只能透過 SPM 提供的標準 API 傳遞請求參數，而無法直接存取 SPE 的記憶體空間。這從根本上切斷了駭客利用緩衝區溢位等軟體漏洞竊取金鑰的途徑。

#### 4. 以 PSA 為例的架構價值

以 PSA 作為晶片安全考量的實例，它證明了現代 IC 設計已經從「單純堆疊密碼學硬體」進化為「建立系統級的隔離與通訊規範」。透過標準化的硬體隔離機制（如 ARM TrustZone 搭配記憶體保護單元 MPU），結合 SPM 的軟體權限調度，晶片能夠在效能、硬體成本與最高等級的安全性之間取得最佳平衡。

---

### 參考資料 (References & Sources)

1. **ARM Ltd.** - *Platform Security Architecture (PSA) Overview*. (詳細規範物聯網與邊緣設備如何透過隔離架構與標準化介面達成硬體安全的官方指南)。
2. **PSA Certified** - *PSA Firmware Framework (PSA-FF) Architecture Specification*. (定義安全處理環境 (SPE) 與安全分區管理員 (SPM) 實作細節的系統架構標準書)。
3. **TrustedFirmware.org** - *Trusted Firmware-M (TF-M) Documentation*. (基於 ARM PSA 架構的開源韌體實作平台，提供安全啟動與隔離服務的底層參考原始碼)。