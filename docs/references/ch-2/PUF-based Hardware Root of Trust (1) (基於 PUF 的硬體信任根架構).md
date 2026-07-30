

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


---

## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.9：PUF-based Hardware Root of Trust (2) (基於 PUF 的硬體信任根架構 - 生命週期與進階防護)

#### 1. 晶片安全生命週期管理 (Silicon Lifecycle Management)

基於 PUF 的硬體信任根（HRoT）不僅僅在系統啟動（Boot）時發揮作用，它更涵蓋了晶片從製造、佈建、營運到報廢的完整生命週期管理。

* **初始註冊與佈建 (Enrollment & Provisioning)：**
傳統金鑰需要在受信任的無塵室環境中進行實體燒錄（Key Injection），這在複雜的全球供應鏈中極易成為安全漏洞。而在 PUF HRoT 架構中，製造商只需在安全的測試機台上進行一次「讀取」——提取出 PUF 的輔助資料（Helper Data）並生成公鑰（Public Key），私鑰則由晶片內部動態生成。這大幅降低了供應鏈被內鬼或外部攻擊者竊取靜態金鑰的風險。
* **安全遠端更新 (Secure Over-The-Air, OTA Updates)：**
當設備在現場（In-field）運行時，若發現韌體漏洞，必須進行 OTA 更新。HRoT 會利用 PUF 衍生出的更新金鑰，驗證新版韌體映像檔的數位簽章，並在內部安全記憶體中進行解密，確保設備不會被降級攻擊（Downgrade Attack）或植入惡意韌體。
* **生命週期終止與金鑰撤銷 (End-of-Life & Key Revocation)：**
當設備報廢或遭到嚴重攻破時，由於 PUF 的物理特徵無法被抹除，系統可透過抹除儲存區中的「輔助資料」或更改金鑰推導函數（KDF）的上下文參數（Context），使得原始的 PUF 輸出再也無法還原出先前的根金鑰，達到實質上的金鑰撤銷與設備註銷。

#### 2. 進階實體攻擊防護 (Advanced Physical Attack Resistance)

高階的 HRoT 必須通過嚴格的硬體安全認證（如 FIPS 140-3 Level 3/4 或 CC EAL 4+ 以上）。基於 PUF 的設計在面對實體攻擊時具有先天優勢，但仍需搭配防篡改電路：

* **旁路攻擊（Side-Channel Attacks, SCA）：**
攻擊者會透過測量晶片運算時的功耗（DPA）或電磁輻射（EMA）來反推金鑰。HRoT 內部的密碼學引擎與 PUF 讀取電路必須採用遮蔽（Masking）**與**隱藏（Hiding）技術，在運算過程中加入隨機亂數干擾，打破功耗與金鑰資料之間的關聯性。
* **錯誤注入攻擊（Fault Injection, FI）：**
攻擊者利用雷射、電壓突波（Voltage Glitching）或時脈毛刺（Clock Glitching）精準干擾 CPU，企圖讓安全啟動過程中的「驗證跳轉指令（如 `if (signature_valid)`）」發生位元反轉，進而繞過安全檢查。HRoT 的狀態機必須設計冗餘邏輯（Redundant Logic），並在晶片層級佈署電壓/頻率異常偵測器（Glitch Detectors）。
* **動態篡改響應（Active Tamper Response）：**
一旦感測器偵測到物理入侵，HRoT 會立即切斷 PUF 電路的供電或重置輔助資料暫存器。因為 PUF 是「動態生成金鑰」，只要切斷電源，金鑰便瞬間化為烏有（Zeroization），攻擊者無法從靜態記憶體中挖出任何機密。

#### 3. 與可信執行環境的協同運作 (Integration with TEE)

硬體信任根是底層的基石，而可信執行環境（Trusted Execution Environment, TEE，例如 ARM TrustZone 或 RISC-V PMP）則是建立在其上的系統架構。

* **信任鏈的延伸：** HRoT 在完成最底層的硬體與 Bootloader 驗證後，會將執行權限移交給 TEE 中的安全作業系統（Secure OS，如 OP-TEE）。
* **金鑰的隔離配發：** HRoT 會利用 PUF 為 TEE 衍生出專屬的加密金鑰，確保 TEE 內部運行的安全應用程式（Trusted Applications, TAs，如行動支付、生物辨識）具備絕對獨立的安全儲存空間，即使外部的 Rich OS（如 Android/Linux）遭到完全控制，也無法讀取 TEE 的機密。

#### 4. 第二章總結：邁向零信任的硬體基礎

總結「Ch2 Hardware Root of Trust」的內容：在現代 IC 設計中，安全不能僅依賴軟體層面的修補。PUF 提供了不可複製的物理熵源，而 HRoT 將這個熵源轉化為系統的信任錨點。這種「從矽晶片底層建立信任（Silicon-to-Cloud Trust）」的架構，正是實現現代零信任架構（Zero Trust Architecture）不可或缺的硬體基礎。

---

### 參考資料 (References & Sources)

1. **FIPS 140-3** - *Security Requirements for Cryptographic Modules*. National Institute of Standards and Technology (NIST). (定義了密碼學模組在面臨實體篡改與旁路攻擊時的防護標準與金鑰銷毀機制)。
2. **GlobalPlatform** - *TEE System Architecture*. (詳細定義了硬體信任根如何與可信執行環境 TEE 進行金鑰派發與權限隔離的國際標準規範)。
3. **Rostami, M., Koushanfar, F., & Karri, R. (2014).** *A Primer on Hardware Security: Models, Methods, and Metrics*. Proceedings of the IEEE. (涵蓋了晶片生命週期管理、硬體木馬防禦及信任根架構設計的學術綜述)。

