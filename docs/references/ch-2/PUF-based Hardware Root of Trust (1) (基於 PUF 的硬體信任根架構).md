這是一份為您撰寫的課程教材。本篇針對「Ch2 Hardware Root of Trust」的第八節內容進行專業且嚴謹的論述。

---

## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.8：PUF-based Hardware Root of Trust (1) (基於 PUF 的硬體信任根架構 - 基礎整合)

#### 1. 概念演進：從安全元件到系統信任根

在先前的單元中，我們將 PUF 視為一個獨立的物理熵源或產生位元字串的安全元件（Security Primitive）。然而，單憑 PUF 裸晶片（Raw PUF）並不能直接保護一個複雜的運算系統。
要成為一個「硬體信任根（Hardware Root of Trust, HRoT）」，PUF 必須與密碼學引擎、安全狀態機（Secure State Machine）以及硬體隔離邊界（Hardware Security Boundary）深度整合。PUF 在此架構中扮演了**不可變的信任錨點（Immutable Trust Anchor）**，為上層系統提供最底層的安全保證。

#### 2. PUF 信任根的硬體架構組成

一個完整的基於 PUF 的 HRoT 子系統，通常封裝在系統單晶片（SoC）內部的一個獨立硬體模組中，其核心組件包含：

* **PUF 巨集電路（PUF Macro）：** 負責擷取硬體物理變異，提供原始的挑戰-回應特徵。
* **輔助資料控制器與錯誤更正（Helper Data Controller & ECC）：** 負責執行模糊提取（Fuzzy Extraction），將帶有微小物理雜訊的 PUF 輸出轉換為 $100\%$ 穩定且具備高熵值的**硬體唯一金鑰（Hardware Unique Key, HUK）**。
* **密碼學硬體加速器（Cryptographic Accelerators）：** 內建 AES（對稱加密）、SHA（雜湊）、RSA/ECC（非對稱簽章）等硬體引擎。這確保了金鑰在使用過程中，運算皆在 HRoT 內部完成，不依賴主處理器（CPU）。
* **安全金鑰匯流排（Secure Key Routing/Bus）：** 一條與系統主匯流排（如 AXI/AHB）物理隔離的專屬內部通道。HUK 或衍生出的根金鑰只能透過這條專屬通道直接傳遞給密碼學引擎，軟體永遠無法讀取金鑰的明文值。

#### 3. 核心運作機制：PUF 驅動的安全啟動 (PUF-driven Secure Boot)

系統上電（Power-on）是資安防護最脆弱的時刻。基於 PUF 的 HRoT 必須在主處理器執行任何外部快閃記憶體的程式碼之前，率先完成**信任根的建立與測量（Root of Trust for Measurement, RoTM）**。

其標準的安全啟動序列如下：

1. **硬體初始化與金鑰生成：** 系統上電重置（Reset）後，HRoT 優先啟動。PUF 擷取物理特徵並透過 ECC 演算法，在內部揮發性暫存器中動態生成 HUK。
2. **Boot ROM 驗證：** HRoT 從唯讀記憶體（ROM）載入不可篡改的第一階段啟動程式碼。
3. **Bootloader 測量與解密：**
* HRoT 從外部 Flash 讀取第二階段的 Bootloader。
* 利用 PUF 產生的金鑰（或推導出的子金鑰）配合內建的 SHA/RSA 引擎，驗證 Bootloader 的數位簽章與完整性。
* 若 Bootloader 被加密，則利用 PUF 金鑰進行解密。


4. **信任鏈移交（Chain of Trust Handover）：** 只有在驗證完美通過後，HRoT 才會解除對主 CPU 的重置訊號，並將控制權與下一階段的金鑰移交給主系統。若驗證失敗，系統將被強制鎖定或進入安全恢復模式（Secure Recovery）。

#### 4. 硬體安全邊界與防篡改 (Hardware Security Boundary)

基於 PUF 的 HRoT 必須在 SoC 內部劃定嚴格的實體隔離區（Isolation）。
這意味著 HRoT 的記憶體映射（Memory Mapping）對於 Rich OS（如 Linux 或 Android）是完全隱藏的。即使攻擊者利用了作業系統的核心漏洞（Kernel Exploit）取得了最高權限（Root），他們也只能向 HRoT 發送高階的密碼學運算「請求」（如要求簽章），而無法透過軟體指令越界讀取 HRoT 內部的狀態機、PUF 控制暫存器或任何金鑰明文。

---

### 參考資料 (References & Sources)

1. **NIST SP 800-193** - *Platform Firmware Resiliency Guidelines*. (美國國家標準暨技術研究院針對平台韌體彈性與硬體信任根在安全啟動（Secure Boot）中扮演之角色的核心指引)。
2. **Arm Platform Security Architecture (PSA)** - *PSA Certified Root of Trust Security Requirements*. (定義了晶片級別安全隔離與硬體信任根防護邊界（Security Boundary）的業界標準架構)。
3. **Trusted Computing Group (TCG)** - *DICE (Device Identifier Composition Engine) Specification*. (探討如何利用硬體唯一機密（如 PUF HUK）來建構分層的信任與安全啟動鏈的標準協定)。