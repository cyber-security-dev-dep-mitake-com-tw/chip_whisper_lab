

## Ch1 HW Security Standard & Regulation (硬體安全標準與規範)

### 單元 1.9：DCMS Code of Practice (英國消費性物聯網安全實務守則)

#### 1. 法規背景與全球影響力 (Background and Global Impact)

隨著加州推動 SB-327 法案，歐洲也同步展開了物聯網安全的法規化進程。英國數位、文化、媒體暨體育部（Department for Digital, Culture, Media & Sport, 簡稱 **DCMS**）於 2018 年發布了《消費性物聯網安全實務守則》（Code of Practice for Consumer IoT Security）。

這份守則的歷史地位極為重要。它並非一份冗長難懂的技術手冊，而是提煉出了 13 項最核心的物聯網安全準則。這 13 項準則隨後成為了歐洲電信標準協會（ETSI）制定全球第一份消費性物聯網安全國際標準 **ETSI EN 303 645** 的直接藍本，並最終促成了英國在 2022 年通過具備強制法律效力的《產品安全與電信基礎設施法案》（PSTI Act）。

#### 2. 守則的核心三大基石 (The Three Core Pillars)

在 DCMS 提出的 13 項準則中，前三項被視為重中之重，也是現代硬體設備要進入歐洲市場的「絕對底線」：

1. **無通用預設密碼 (No default passwords)：**
與加州 SB-327 精神完全一致。所有物聯網設備的密碼必須是唯一的（Unique），且不能被重置為任何全域通用的出廠預設值（如 `admin`/`admin`）。
2. **實施漏洞揭露政策 (Implement a vulnerability disclosure policy)：**
製造商必須提供公開的聯絡管道，讓資安研究人員能安全地通報漏洞，並明確承諾修補的時程。
3. **保持軟體更新 (Keep software updated)：**
設備必須具備安全更新機制（Secure OTA），且製造商必須在產品包裝或購買前，明確告知消費者該設備「保證提供安全更新的最短年限」。

#### 3. 實務守則對 SoC 與底層硬體的具體要求

除了上述三大基石，DCMS 守則中的其他準則深刻影響了系統單晶片（SoC）的底層架構設計。如果 IC 晶片缺乏對應的硬體安全基元（Hardware Primitives），設備製造商將極難符合守則要求：

* **安全儲存機密資料 (Securely store credentials and security-sensitive data)：**
守則明文規定，任何硬體內部的憑證、加密金鑰或個人隱私資料，都必須受到安全保護。
* *硬體實作考量：* 晶片必須提供受硬體保護的非揮發性記憶體區塊（如 Anti-Fuse OTP 或 TrustZone 內的防篡改儲存），防止攻擊者透過快閃記憶體讀取器（Flash Dumper）直接竊取明文金鑰。


* **確保軟體完整性 (Ensure software integrity)：**
守則要求設備在啟動時，必須驗證軟體的完整性，防止載入未經授權的惡意韌體。
* *硬體實作考量：* 這直接要求晶片必須內建**硬體信任根（Hardware Root of Trust, HRoT）**，並強制執行**安全啟動（Secure Boot）**。開機第一階段的程式碼（Boot ROM）必須被固化在唯讀記憶體中，並利用內建的硬體密碼學引擎（如 SHA/RSA/ECC）來驗證後續程式碼的數位簽章。


* **最小化攻擊面 (Minimise exposed attack surfaces)：**
守則要求關閉不必要的實體連接埠與邏輯服務。
* *硬體實作考量：* 在晶片設計層面，必須具備生命週期狀態管理（Lifecycle Management）的硬體電路。當晶片從「製造測試階段」進入「現場部署階段」時，硬體必須能永久鎖死或透過憑證驗證才能開啟 JTAG 等除錯介面（Debug Ports），防止駭客利用除錯通道發動侵入式攻擊。



#### 4. 從自願守則到強制法律：UK PSTI Act

DCMS 的《實務守則》最初是以「自願性最佳實踐」的形式發布，旨在引導市場。然而，由於市場驅動力不足，英國政府最終將守則的前三大核心要求升級為強制法律——**《產品安全與電信基礎設施法案》（PSTI Act 2022）**，並於 2024 年 4 月 29 日正式生效。
這意味著，現今任何缺乏唯一識別密碼、無法提供安全軟體更新的連網硬體設備，在英國銷售將面臨巨額罰款甚至產品下架的法律制裁。

---

### 第一章總結 (Chapter 1 Summary)

在「Ch1 HW Security Standard & Regulation」中，我們探討了驅動硬體安全設計的最上游力量——**標準與法規**。

從極度嚴格、針對密碼學模組物理防篡改的 **FIPS 140-2/3** 與 **CAVP 演算法驗證**，到確保物理熵源不可預測性的 **NIST 800-22 / 800-90 系列**；再到因應歷史攻擊教訓，並由各國政府強制立法的 **加州 SB-327** 與 **英國 DCMS/PSTI** 物聯網安全法案。

這些規範清楚地傳達了一個訊息：**現代 IC 設計已無法將「安全」視為可有可無的選配功能。** 缺乏硬體信任根、安全儲存與抗攻擊密碼學引擎的晶片，將無法通過國際認證，更無法合法進入全球主要市場。這為我們後續章節探討「如何建構硬體信任根」與「晶片安全架構實作」奠定了堅實的法規與理論基礎。

---

### 參考資料 (References & Sources)

1. **UK Department for Digital, Culture, Media & Sport (DCMS).** *Code of Practice for Consumer IoT Security*. (英國政府發布之消費性物聯網安全 13 項核心實務準則)。
2. **UK Parliament.** *Product Security and Telecommunications Infrastructure (PSTI) Act 2022*. (將 DCMS 守則核心準則轉化為強制法律的英國國會法案)。
3. **ETSI EN 303 645** - *Cyber Security for Consumer Internet of Things: Baseline Requirements*. (基於 DCMS 守則發展而來，目前全球最廣泛採用之消費性物聯網網路安全基準國際標準)。