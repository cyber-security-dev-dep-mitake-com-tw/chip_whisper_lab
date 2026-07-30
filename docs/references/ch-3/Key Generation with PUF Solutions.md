

## Ch3 HW Security Ecosystem (硬體安全生態系統)

### 單元 3.6 & 3.7：Key Generation with PUF Solutions (基於 PUF 的金鑰生成解決方案)

#### 1. 從「物理特徵」到「密碼學金鑰」的挑戰 (The Gap Between PUF and Crypto Keys)

物理不可複製功能 (PUF) 雖然能提供每顆晶片獨一無二的數位指紋，但原始的 PUF 輸出（Raw PUF Response）無法直接作為密碼學金鑰（如 AES-256 或 ECC 私鑰）。這主要歸因於兩個根本性的物理限制：

1. **環境雜訊導致的位元錯誤率 (Bit Error Rate, BER)：**
受到溫度變化、供電電壓波動與熱雜訊的影響，同一個晶片在不同時間點讀取 PUF 時，其回應字串會產生微小的翻轉（通常 BER 介於 $1\%$ 到 $15\%$ 之間）。然而，現代密碼學演算法具備嚴格的「雪崩效應 (Avalanche Effect)」：只要有 $1$ 個位元錯誤，解密結果就會完全變成亂碼。密碼學金鑰要求 $100\%$ 的穩定性。
2. **不完美的均勻性與資訊熵 (Imperfect Entropy)：**
原始 PUF 輸出的 `0` 與 `1` 比例可能並非完美的 $50\% / 50\%$，且相鄰位元之間可能存在物理關聯性。這種非隨機性會降低金鑰的實際資訊熵，使其容易遭受窮舉攻擊。

為了解決上述問題，必須在 PUF 硬體與密碼學引擎之間，插入一個強大的演算法轉換層——**模糊提取器 (Fuzzy Extractor)**。

#### 2. 核心解決方案：模糊提取器 (Fuzzy Extractor) 的兩階段流程

模糊提取器是由 Dodis 等人在密碼學界提出的標準模型，專門用於將帶有雜訊的生物特徵或物理特徵，穩定轉換為高強度的加密金鑰。其實務運作分為兩個階段：

* **階段一：註冊階段 (Enrollment Phase)**
此階段僅在晶片出廠前，於受信任的安全環境（如原廠測試機台）中執行一次。
1. 系統對 PUF 輸入挑戰，讀取原始回應 $R$。
2. 模糊提取器利用生成演算法 $\text{Gen}(R)$，產生出一組**密碼學金鑰 $K$** 以及對應的**輔助資料 (Helper Data, $W$)**。
3. 金鑰 $K$ 絕不會被儲存；而輔助資料 $W$ 則會以明文形式，寫入晶片外部的一般非揮發性記憶體（如 Flash 或 EEPROM）中。


* **階段二：重建階段 (Reproduction / Reconstruction Phase)**
此階段發生在設備部署至現場（In-field）且每次系統上電開機時。
1. 系統再次讀取 PUF，獲得帶有環境雜訊的回應 $R'$。
2. 系統從外部記憶體讀入公開的輔助資料 $W$。
3. 模糊提取器利用還原演算法 $\text{Rep}(R', W)$，完美消除 $R'$ 中的雜訊，並穩定重建出與出廠時完全相同的**金鑰 $K$**。



#### 3. 關鍵技術 I：資訊協調與錯誤更正 (Information Reconciliation & ECC)

模糊提取器能夠修正雜訊的核心，在於**錯誤更正碼 (Error Correction Code, ECC)** 的應用。這個過程被稱為資訊協調 (Information Reconciliation)。

為了應對 PUF 高達 $15\%$ 的錯誤率，傳統通訊領域的漢明碼 (Hamming Code) 並不夠用。硬體安全設計中通常採用多層級的糾錯編碼機制：

* **重複碼 (Repetition Code)：** 作為第一層防護，利用多數決原理大幅降低原始 BER，但代價是浪費大量的 PUF 隨機位元。
* **BCH 碼 (Bose-Chaudhuri-Hocquenghem Codes) 或 Reed-Muller 碼：** 作為第二層代數糾錯機制，能精準定位並翻轉錯誤位元。
* **硬體負擔權衡 (Hardware Overhead Trade-off)：** ECC 解碼電路往往是整個 PUF 信任根中面積最大、功耗最高的區塊。因此，IC 設計師必須在「容錯能力」與「晶片面積成本」之間進行嚴格的妥協設計。

#### 4. 關鍵技術 II：隱私放大 (Privacy Amplification)

在透過 ECC 將 $R'$ 修正回完美的 $R$ 之後，該字串仍然存在「熵分佈不均」的問題，且輔助資料 $W$ 的公開可能會洩漏部分關於 $R$ 的資訊。

* **熵池壓縮 (Entropy Compression)：**
隱私放大 (Privacy Amplification) 是一系列密碼學雜湊運算。系統會將長度較長、但熵密度不足的糾錯後字串，輸入至**通用雜湊函數 (Universal Hash Function)** 或標準密碼學雜湊函數（如 SHA-256、AES-CBC-MAC）中進行壓縮。
* **完美金鑰的誕生：**
例如，將 $2048$ bits 且實際熵僅有 $300$ bits 的原始字串，壓縮成 $256$ bits 的最終金鑰 $K$。經過此步驟，這 $256$ bits 中的每一個 bit 都具備完美的數學隨機性（Full Entropy），從而達到最高等級的安全強度。

#### 5. 輔助資料 (Helper Data) 的安全性要求

在基於 PUF 的金鑰生成架構中，最常被攻擊者盯上的便是公開儲存的輔助資料 $W$。設計模糊提取器時必須嚴格遵守以下安全數學邊界：

* **零洩漏原則 (Zero-Leakage Principle)：**
根據資訊理論（香農熵，Shannon Entropy），輔助資料 $W$ 絕對不能洩漏任何關於最終金鑰 $K$ 的資訊。即使攻擊者攔截並完全解析了 $W$，他們猜測出 $K$ 的機率，不能高於直接進行盲目窮舉攻擊（Brute-force）的機率。
* **防篡改驗證 (Tamper Evidence for Helper Data)：**
如果攻擊者惡意竄改 Flash 中的 $W$，會導致重建階段的 ECC 演算法崩潰，或者產生錯誤的金鑰。為防止此種阻斷服務攻擊 (DoS) 或惡意金鑰注入，系統在讀取 $W$ 時，通常會結合安全啟動機制，先驗證 $W$ 的數位簽章或 MAC 值，確保其完整性。

---

### 參考資料 (References & Sources)

1. **Dodis, Y., Reyzin, L., & Smith, A. (2004).** *Fuzzy extractors: How to generate strong keys from biometrics and other noisy data*. Advances in Cryptology-EUROCRYPT. (這篇是硬體與生物特徵金鑰生成領域的基石論文，嚴謹定義了模糊提取器、資訊協調與隱私放大的數學模型)。
2. **Maes, R., Tuyls, P., & Verbauwhede, I. (2012).** *Low-overhead implementation of a soft decision helper data algorithm for SRAM PUFs*. Cryptographic Hardware and Embedded Systems (CHES). (探討如何以極低的硬體面積成本，在晶片上實作高效能 ECC 與 Helper Data 演算法的工程實務文獻)。
3. **NIST SP 800-90B** - *Recommendation for the Entropy Sources Used for Random Bit Generation*. (美國國家標準暨技術研究院針對如何評估物理熵源，以及如何利用隱私放大（Privacy Amplification）技術生成高強度金鑰的官方指南)。

