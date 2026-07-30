
## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.6：PUF-based Applications (1) (基於 PUF 的安全應用 - 基礎篇)

#### 1. 應用概述：從實體特徵到資安服務

在前述單元中，我們探討了 PUF 作為「晶片指紋」的物理機制與硬體實作。然而，原始的 PUF 輸出（Raw Response）只是一串具備隨機性但可能含有微小雜訊的二進位字串。要將這些實體特徵轉化為具體的資訊安全應用，主要聚焦於兩大基礎核心：**無金鑰儲存（Keyless Storage）**與**裝置唯一識別/鑑證（Device Identification and Authentication）**。

#### 2. 應用一：高強度密碼學金鑰生成與無金鑰儲存

這是 PUF 在現代系統晶片（SoC）中最基礎且最關鍵的應用，旨在取代傳統的非揮發性記憶體（如 eFuse 或 EEPROM）來保管最高機密的根金鑰（Root Key）。

* **無金鑰儲存（Keyless Storage）的優勢：**
傳統架構中，金鑰以靜態資料（Data at Rest）的形式停留在記憶體內，容易遭受物理探針、剝層分析（Reverse Engineering）或冷開機攻擊（Cold Boot Attack）。PUF 則達成「靜態時無金鑰」的狀態：金鑰只在系統通電且發出特定請求時，才由硬體即時測量生成（Generated on-the-fly）。斷電後，金鑰便消失化為無形的物理微觀特徵。
* **模糊提取器（Fuzzy Extractor）的關鍵角色：**
由於多數 PUF（如 SRAM PUF）在不同環境下讀取時，會產生微小的位元錯誤率（BER）。為了生成密碼學要求 $100\%$ 穩定的對稱金鑰（如 AES-256 金鑰），必須引入「模糊提取器」演算法。
其運作包含兩個階段：
1. **註冊階段（Enrollment）：** 讀取原始 PUF 回應 $R$，計算出輔助資料（Helper Data, $W$）並將其公開儲存在一般記憶體中。同時生成密碼學金鑰 $K$。
2. **重建階段（Reproduction）：** 設備重新上電時，給予相同挑戰，PUF 產生帶有雜訊的回應 $R'$。系統利用公開的 $W$ 與錯誤更正碼（ECC），透過運算 $K = \text{Reproduce}(R', W)$ 完美還原出原始金鑰 $K$。由於 $W$ 本身不洩漏任何關於 $K$ 的資訊，因此即使 $W$ 被竊取也是安全的。



#### 3. 應用二：晶片識別與半導體防偽 (IC Anti-Counterfeiting)

全球半導體供應鏈面臨嚴重的仿冒與過度生產（Overproduction）威脅。惡意代工廠可能私自多生產晶片並流入黑市，或者回收廢棄晶片重新標記（Remarking）為高規格新品。

* **基於 PUF 的防偽機制：**
由於 PUF 取決於製程中的自然物理變異，這意味著「製造商自己也無法製造出兩個 PUF 輸出完全相同的晶片」。每一顆晶片在出廠前，測試機台會讀取其 PUF 回應並登記於原廠的安全資料庫中。
* **應用情境：**
當系統整合商或終端用戶取得晶片時，只需讀取該晶片的 PUF 特徵並與原廠資料庫進行比對。如果晶片是未經授權生產的黑數，或者是被替換的偽造品，其 PUF 物理特徵絕對無法與資料庫匹配，從而從根本上解決了硬體供應鏈的溯源與防偽問題。

#### 4. 應用三：輕量級裝置鑑證 (Lightweight Device Authentication)

在物聯網（IoT）場景中，邊緣裝置通常缺乏足夠的運算資源來執行複雜的非對稱式加密演算法（如 RSA 或 ECC）進行身份驗證。

* **挑戰-回應協定（Challenge-Response Protocol）：**
若使用強 PUF（Strong PUF，具備龐大 CRP 空間，如 Arbiter PUF），可直接實作極輕量級的鑑證機制。
1. **伺服器發起挑戰：** 伺服器從資料庫中隨機挑選一組尚未使用的挑戰 $C$ 發送給 IoT 裝置。
2. **裝置回應：** 裝置將 $C$ 輸入其硬體 PUF，產生回應 $R$ 並傳回伺服器。
3. **伺服器驗證：** 伺服器比對傳回的 $R$ 是否與資料庫吻合。驗證成功後，該組 $(C, R)$ 便被作廢，以防禦重播攻擊（Replay Attack）。整個過程完全不需要複雜的密碼學運算，極大降低了 IoT 裝置的功耗與硬體成本。



---

### 參考資料 (References & Sources)

1. **Dodis, Y., Reyzin, L., & Smith, A. (2004).** *Fuzzy extractors: How to generate strong keys from biometrics and other noisy data*. Advances in Cryptology-EUROCRYPT. (奠定如何從含有物理雜訊的 PUF 訊號中，穩定提取出高品質密碼學金鑰的理論基礎與數學模型)。
2. **Ruhrmair, U., et al. (2010).** *Modeling attacks on physical unclonable functions*. Proceedings of the 17th ACM conference on Computer and communications security. (探討強 PUF 在大量 Challenge-Response 應用下，如何防禦機器學習建模攻擊的關鍵文獻)。
3. **IEEE 802.1AR** - *Secure Device Identity*. (規範設備唯一識別碼之標準，現代許多符合此標準的硬體實作皆開始採用 PUF 作為其安全基礎元件)。

## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.7：PUF-based Applications (2) (基於 PUF 的安全應用 - 進階篇)

#### 1. 應用四：真隨機亂數產生器 (TRNG) 之高熵源

在前一節中，我們利用 PUF 的「穩定性」來生成固定的密碼學金鑰。然而，PUF 系統中無可避免的熱雜訊（Thermal Noise）或亞穩態（Metastable State）所造成的「不穩定位元」，在密碼學中同樣具有極高的應用價值。

* **從雜訊到熵（Entropy）：**
一個完善的安全晶片不僅需要靜態的金鑰，還需要在執行加密協定（如 TLS 握手、產生 Nonce 或 Session Key）時，動態產生無法被預測的隨機數。PUF 電路每次讀取時所產生的微小變異（例如 SRAM 啟動時處於臨界狀態的單元，或 Ring Oscillator 頻率的相位雜訊），可作為真隨機亂數產生器（True Random Number Generator, TRNG）的優質物理熵源。
* **混合架構優勢：**
現代硬體安全模組通常將 PUF 的穩定輸出（用於 Key Generation）與不穩定輸出（輸入給 Deterministic Random Bit Generator, DRBG 進行展頻運算）結合在同一個矽智財（IP）中，大幅節省了晶片面積與功耗。

#### 2. 應用五：軟硬體綁定與矽智財保護 (Hardware-Software Binding & IP Protection)

在物聯網與邊緣運算設備中，韌體（Firmware）與機器學習模型（AI Models）往往是企業最核心的商業機密（Intellectual Property, IP）。若無硬體防護，攻擊者可輕易透過 Flash 讀取器將程式碼完全複製到另一台未授權的設備上執行（即韌體克隆, Firmware Cloning）。

* **PUF 金鑰封裝（Key Wrapping）：**
韌體在寫入外部快閃記憶體之前，會先經過對稱式加密（如 AES-GCM）。而用來解密這份韌體的「密碼」，並非寫死在程式碼中，而是由該設備內部的 PUF 動態生成。
* **絕對的硬體關聯性：**
由於每顆晶片的 PUF 特徵皆不相同，一旦攻擊者將加密的韌體複製到另一台設備上，另一台設備的 PUF 無法產生正確的解密金鑰，導致韌體無法啟動。這種機制實現了韌體與特定實體晶片的「強綁定」，徹底根絕了設備克隆與未授權量產的威脅。

#### 3. 應用六：金鑰推導與多層次安全隔離 (Key Derivation and Isolation)

一個複雜的系統單晶片（SoC）或作業系統，通常需要多組不同用途的金鑰（例如：硬碟加密金鑰、通訊對話金鑰、MAC 簽章金鑰）。直接讓所有應用程式存取 PUF 的根金鑰（Root Key）將造成極大的安全風險。

* **金鑰推導函數（Key Derivation Function, KDF）：**
PUF 通常被架構為系統的**硬體唯一金鑰（Hardware Unique Key, HUK）**。HUK 不會直接暴露給任何軟體。相反地，系統會結合 HUK 與不同的應用程式識別碼（Context / App ID），輸入至硬體實作的 KDF（如符合 NIST SP 800-108 規範的 HMAC-KDF）。
* **安全隔離：**
透過此機制，每個應用程式或虛擬環境（如 ARM TrustZone 的 Secure World 與 Normal World）只能獲取由 KDF 衍生出的「子金鑰」（Sub-keys）。即使某個應用程式遭到攻破，其子金鑰外洩，也不會危及 PUF 根金鑰或其他應用程式的安全性。

#### 4. 應用七：雲端零接觸佈建 (Zero-Touch Cloud Onboarding)

隨著物聯網設備數量暴增，手動為每台設備注入憑證並註冊到雲端平台（如 AWS IoT Core 或 Azure IoT Hub）變得極具挑戰且成本高昂。

* **基於 PUF 的公鑰基礎設施（PKI）整合：**
在晶片製造階段，晶片會利用 PUF 生成一對非對稱式金鑰（Public/Private Key Pair）。公鑰（Public Key）會被抽出並交由憑證授權中心（Certificate Authority, CA）簽署成為 X.509 設備憑證，而私鑰（Private Key）則由 PUF 內部動態生成，永遠不會離開硬體邊界。
* **自動化信任建立：**
當設備首次連接上網並嘗試連線至雲端時，雲端伺服器可透過驗證其 X.509 憑證，確認該設備的實體身份與原廠授權狀態，實現完全自動化且具備硬體級安全保障的設備佈建（Onboarding）流程。

---

### 參考資料 (References & Sources)

1. **NIST SP 800-108** - *Recommendation for Key Derivation Using Pseudorandom Functions*. (定義了如何安全地從一個根金鑰，如 PUF HUK，衍生出多組特定用途子金鑰的國際標準)。
2. **Maes, R. (2013).** *Physically Unclonable Functions: Constructions, Properties and Applications*. Springer. (系統性論述 PUF 應用，特別是軟硬體綁定與 IP 保護機制的權威專著)。
3. **FIDO Alliance** - *FIDO Device Onboard (FDO) Specification*. (探討物聯網設備自動化雲端佈建的業界標準，其中強調了基於硬體信任根與 PUF 在 Zero-Touch 流程中的應用價值)。