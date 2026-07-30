
## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.3：PUF properties (PUF 的關鍵特性與評估指標)

#### 1. 為什麼需要評估 PUF 特性？

並非所有半導體的隨機變異都能直接作為密碼學上的金鑰或信任根。一個合格的 PUF 必須在「隨機性」與「穩定性」之間取得完美的平衡。為了將硬體的物理特性標準化為可用的資安元件，業界與學術界訂定了嚴格的統計學特性來評估 PUF 的品質。國際標準組織（如 ISO/IEC）與 NIST 皆對這些特性提出了具體的量化指標。

#### 2. 核心特性：唯一性 (Uniqueness)

唯一性衡量的是「不同晶片之間的差異程度」。
當我們給予兩個不同的晶片（晶片 $A$ 與晶片 $B$）完全相同的挑戰（Challenge, $C$）時，它們產生的回應（Response, $R_A$ 與 $R_B$）應該要盡可能不同。

* **評估指標：** 類間漢明距離（Inter-class Hamming Distance, Inter-HD）。
* **理論基礎：** 漢明距離計算的是兩個等長字串間，對應位置字元不同的數量。對於二進位輸出的 PUF，理想的狀態下，任何兩個不同晶片的輸出位元應該有 $50\%$ 的機率是不一樣的。
* **理想值：** $\text{Inter-HD} \approx 50\%$。若數值遠低於 $50\%$，代表不同晶片產生的金鑰容易發生碰撞（Collision），失去作為唯一識別碼的價值。

#### 3. 核心特性：可靠性 (Reliability / Reproducibility)

可靠性衡量的是「同一個晶片在不同環境下的穩定程度」。
當我們在不同的時間點，或者在不同的環境條件下（如極端溫度變化、供電電壓波動、晶片老化），對同一個晶片輸入相同的挑戰 $C$，PUF 應該要能穩定地輸出相同的回應。

* **評估指標：** 類內漢明距離（Intra-class Hamming Distance, Intra-HD），有時也稱為位元錯誤率（Bit Error Rate, BER）。
* **理想值：** $\text{Intra-HD} \approx 0\%$。這意味著無論環境如何改變，PUF 每次產生的金鑰都完全一致。
* **工程挑戰：** 現實中的物理測量必定會受到熱雜訊（Thermal Noise）或電壓波動的干擾，因此原始的 PUF 輸出（Raw PUF Response）通常無法達到完美的 $0\%$ 錯誤率。在實際的 IC 設計中，必須搭配錯誤更正碼（Error Correction Code, ECC）或輔助資料（Helper Data）演算法，才能將最終輸出的可靠性提升至密碼學要求的 $100\%$ 穩定。

#### 4. 核心特性：均勻性與隨機性 (Uniformity & Randomness)

均勻性衡量的是「單一晶片輸出結果的分佈均衡度」。
一個高品質的 PUF 所產生的二進位回應序列中，邏輯 `0` 與邏輯 `1` 的出現比例應該要相等，以確保生成的金鑰具備最高的資訊熵（Entropy），從而抵禦窮舉攻擊（Brute-force Attack）。

* **理想值：** $1$ 的比例 $\approx 50\%$，$0$ 的比例 $\approx 50\%$。
* 如果均勻性發生嚴重偏移（例如出現 $70\%$ 的 `1`），攻擊者在猜測金鑰時就能利用這個統計學上的偏誤大幅縮小搜尋空間。

#### 5. 核心特性：不可預測性 (Unpredictability)

不可預測性是 PUF 抵禦機器學習攻擊（Machine Learning Attacks）的關鍵防線。
假設攻擊者攔截或收集了某個 PUF 的大量「挑戰-回應對（CRP）」子集，他們不應該能夠藉由訓練神經網路或建立數學模型，來準確預測出該 PUF 面對「未曾見過的挑戰」時會輸出什麼回應。此特性高度依賴於 PUF 內部電路設計的非線性（Non-linearity）與複雜度。

---

### 參考資料 (References & Sources)

1. **ISO/IEC 20897-1:2020** - *Information security, cybersecurity and privacy protection — Physical unclonable functions — Part 1: Security requirements*. (國際標準化組織針對 PUF 安全性要求與特性評估的最高國際標準)。
2. **Maiti, A., Gunnala, J., & Schaumont, P. (2010).** *A systematic method to evaluate and compare SKRO PUFs.* In Constructive Side-Channel Analysis and Secure Design (COSADE). (學術界廣泛引用，用於計算 Inter-HD 與 Intra-HD 評估指標的系統性方法論)。
3. **NIST SP 800-90B** - *Recommendation for the Entropy Sources Used for Random Bit Generation*. (NIST 針對隨機位元生成之熵源評估標準，常用於檢驗 PUF 輸出的隨機性與均勻性)。