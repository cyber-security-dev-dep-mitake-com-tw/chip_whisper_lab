這是一份為您撰寫的課程教材。本篇針對「Ch2 Hardware Root of Trust」的第四節內容進行專業且嚴謹的論述。

---

## Ch2 Hardware Root of Trust (硬體信任根)

### 單元 2.4：PUF Implementations (PUF 的常見硬體實作技術)

#### 1. 實作分類概述 (Overview of PUF Architectures)

雖然 PUF 的核心概念皆是擷取製造過程中的物理變異，但在積體電路（IC）的設計上，擷取這些變異的電路架構有多種不同的實作方式。為了控制製造成本並提高相容性，目前主流的 PUF 大多採用標準的 CMOS（互補式金屬氧化物半導體）製程，而不需要額外的光罩或特殊材料。

從電路特性的角度來看，CMOS PUF 主要可劃分為兩大類別：**記憶體型 PUF（Memory-based PUFs）** 與 **延遲型 PUF（Delay-based PUFs）**。

#### 2. 記憶體型 PUF：以 SRAM PUF 為例

記憶體型 PUF 是目前商業應用最廣泛的實作方式之一，其代表技術為 **SRAM PUF**。

* **運作原理：**
標準的 SRAM 單元（Cell）由六個電晶體（6T）組成，內部包含兩個交叉耦合的反相器（Cross-coupled Inverters）。在理論上，這兩個反相器的電氣特性應該完全對稱。然而，由於製程變異（如閾值電壓 $V_{th}$ 的微小差異），這兩個反相器的驅動能力必定會存在些微的不平衡。
* **物理熵源的提取：**
當 SRAM 剛通電（Power-up）時，交叉耦合電路會處於亞穩態（Metastable State），並迅速因為內部微小的物理不平衡，而倒向邏輯 `0` 或邏輯 `1`。這使得晶片每次上電時，未初始化的 SRAM 陣列會呈現一組固定且獨特的 `0` 與 `1` 隨機分佈圖案。
* **優勢與挑戰：**
SRAM PUF 的最大優勢在於不需要修改任何電路設計，即可直接利用現成的標準 SRAM 矽智財（IP）。然而，SRAM 狀態容易受到環境溫度與電壓老化的影響，因此必須搭配強大的錯誤更正碼（ECC）來確保其「可靠性（Reliability）」。

#### 3. 延遲型 PUF：Arbiter PUF 與 RO PUF

延遲型 PUF 利用的是邏輯閘或導線在訊號傳輸時間（Propagation Delay）上的隨機變異。

* **Arbiter PUF（仲裁器 PUF）：**
* **原理：** 電路設計出兩條理論上長度與延遲完全相等的訊號傳輸路徑。輸入一個脈衝訊號後，利用「挑戰（Challenge）」作為多工器（Multiplexers）的控制訊號，來決定脈衝在這兩條路徑上的實際走向。
* **提取：** 在路徑的終點放置一個仲裁器（通常是一個 D 型正反器）。由於製程變異，兩條路徑的實際延遲會有些微差異，仲裁器會判斷哪一條路徑的訊號先抵達，若上方路徑先抵達則輸出 `1`，反之輸出 `0`。


* **Ring Oscillator PUF（RO PUF，環形振盪器 PUF）：**
* **原理：** 藉由奇數個反相器串聯形成環形振盪器。理論上，設計相同的 RO 應該具備相同的振盪頻率。但受限於製程變異，每個 RO 的實際振盪頻率會產生微小偏移。
* **提取：** 系統挑選兩個 RO 進行頻率比較。如果 $\text{Freq}(RO_A) > \text{Freq}(RO_B)$，則輸出 `1`，否則輸出 `0`。RO PUF 在現場可程式化邏輯閘陣列（FPGA）的實作上非常受歡迎。



#### 4. 實作考量：強 PUF (Strong PUF) 與弱 PUF (Weak PUF)

在實務應用中，PUF 的實作架構決定了其支援的「挑戰-回應對（CRP）」數量，進而影響其安全應用場景：

* **弱 PUF（Weak PUF）：**
例如 SRAM PUF。其 CRP 數量通常與硬體面積成正比（例如 1KB 的 SRAM 只能產生 8192 bits 的回應）。由於 CRP 數量有限，攻擊者可能在安全環境中將所有回應讀取完畢，因此弱 PUF 通常只能用於**內部金鑰生成（Key Generation）**，不可將回應直接暴露於外部介面。
* **強 PUF（Strong PUF）：**
例如 Arbiter PUF。其 CRP 數量會隨著硬體級數呈現指數型成長（Exponential Growth），例如 64 級的 Arbiter PUF 可以產生 $2^{64}$ 組 CRP。龐大的 CRP 空間使得攻擊者無法窮舉所有組合，因此強 PUF 可直接用於開放環境中的裝置鑑證（Device Attestation）協定。

---

### 參考資料 (References & Sources)

1. **Holcomb, D. E., Burleson, W. P., & Fu, K. (2009).** *Power-Up SRAM State as an Identifying Fingerprint and Source of True Random Numbers*. IEEE Transactions on Computers. (詳細闡述 SRAM PUF 的運作機制與物理變異分析的權威文獻)。
2. **Suh, G. E., & Devadas, S. (2007).** *Physical Unclonable Functions for Device Authentication and Secret Key Generation*. Proceedings of the 44th Annual Design Automation Conference (DAC). (探討 Arbiter PUF 與 Ring Oscillator PUF 實作架構的重要學術基礎)。
3. **Herder, C., et al. (2014).** *Physical Unclonable Functions and Applications: A Tutorial*. Proceedings of the IEEE. (全面探討各類型 PUF 硬體實作優劣勢與 Strong/Weak PUF 分類的學術回顧報告)。