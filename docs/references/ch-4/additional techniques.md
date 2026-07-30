

### 1. 應用場景與運作原理

當晶片執行密碼學演算法（例如 AES 加密的 S-box 查表、或當代後量子密碼演算法如 CRYSTALS-Kyber）時，底層硬體通常會處理多個獨立的資料區塊或位元組（例如 AES 的 16 個 Bytes）。

* **未施加 Shuffling 的情況（固定順序）：**
硬體每次執行加密時，運算指令的發生順序完全固定。攻擊者透過示波器採集晶片在運行時的功耗波形，能夠輕易將多次執行的功耗軌跡進行「時間對齊（Time Alignment）」，進而透過統計分析萃取出對應的金鑰位元。
* **施加 Shuffling 的情況（隨機打亂）：**
晶片內部的亂數產生器（TRNG）會在每次加密運算開始前，動態生成一個隨機排列順序（例如透過硬體友好的 Fisher-Yates 混洗演算法），將原本固定的運算步驟**隨機打亂（洗牌）**。例如：原本的執行順序是 $1 \rightarrow 2 \rightarrow 3 \rightarrow 4$，被洗牌後變成 $3 \rightarrow 1 \rightarrow 4 \rightarrow 2$。

---

### 2. 為什麼要用 Shuffling？（安全效益）

* **破壞時域對齊（Temporal Misalignment）：**
由於每次運算的內部執行順序隨機改變，攻擊者收集到的功耗波形在時間軸上會產生錯位。這使得傳統的 DPA/CPA 統計分析失去對應基準，功耗特徵被模糊化。
* **與遮蔽技術（Masking）互補：**
在高等級的安全晶片中，Shuffling 通常與「布林遮蔽（Boolean Masking）」聯手使用，形成雙重防線，在有效控制硬體面積與效能耗損（PPA）的前提下，大幅增加側信道攻擊的破解門檻。

---

### 參考資料 (References & Sources)

1. **Mangard, S., et al. (2008).** *Power Analysis Attacks: Revealing the Secrets of Smart Cards*. Springer. (詳細論述在硬體功耗分析防禦中，採用時域隱藏與 Shuffling 混洗技術的經典原理)。
2. **A Hardware-Friendly Shuffling Countermeasure Against Side-Channel Attacks for Kyber** (探討在密碼硬體實作中，如何透過最佳化硬體混洗架構與隨機置換生成器來抵禦側信道攻擊)。

---

---

## 側信道攻擊之核心隱藏防禦技術 (Core Hiding Countermeasures)

### 一、 時域隱藏技術 (Time-Domain Hiding)

時域隱藏的目標是**打亂指令執行的時間順序或頻率**，使攻擊者無法利用示波器將多次執行的功耗波形進行時間對齊（Time Alignment），從而破壞統計分析的基礎。

1. **隨機時脈抖動 (Random Clock Jitter / Frequency Hopping)**
* **運作原理：** 晶片內部的時脈產生器（Clock Generator）不再使用固定頻率的震盪器，而是透過亂數源（TRNG）即時、隨機地微調每一個時脈週期（Clock Cycle）的長度。
* **安全效益：** 相同的加密指令在不同的執行回合中，出現的時間點會前後漂移。這使得攻擊者在收集波形時，時間軸上的功耗特徵會被嚴重「平滑化（Smearing）」，導致差分功耗分析的相關係數大幅下降。


2. **插入虛擬指令 / 隨機延遲 (Dummy Operations / Dummy Cycles)**
* **運作原理：** 硬體控制邏輯在執行加密演算法時，會在關鍵運算步驟之間隨機插入一些「無實際數學意義的虛擬指令（Dummy Instructions）」或無用時脈週期。
* **安全效益：** 攻擊者無法預測某一個位元加密完成的確切時間點。即便功耗波形中有特徵洩漏，由於其在時間軸上的相對位置不斷隨機變動，統計分析工具也無法精確捕捉。



---

### 二、 振幅域 / 功率域隱藏技術 (Amplitude & Power-Domain Hiding)

與時域隱藏不同，振幅域隱藏不改變時間，而是**從邏輯閘的電路層級出發，強制消除功耗與內部資料（`0` 或 `1`）之間的相依性**。

1. **雙軌預充電邏輯 (Dual-Rail Pre-charge Logic, e.g., WDDL / SABL)**
* **運作原理：** 這是硬體電路級別最強力的防禦之一。傳統 CMOS 邏輯中，只有當電晶體切換時才消耗動態功耗。雙軌邏輯將每一個訊號拆分為兩條線（代表真實值與其反相值），並將運算循環嚴格劃分為兩個階段：
* *預充電階段 (Pre-charge Phase)：* 將所有內部節點強制歸零（或充電至特定狀態）。
* *評估階段 (Evaluation Phase)：* 根據輸入資料計算結果。


* **安全效益：** 無論當前運算的資料是 `0` 或是 `1`，電路中經歷邏輯翻轉的電晶體數量和方向在統計上完全保持一致。這使得晶片在運算時的**總功耗維持恆定**，從根本上消除了差分功耗分析（DPA）賴以維繫的功耗差異。


2. **功率均衡器與晶片內建去耦電容 (Power Equalizers & On-chip Decoupling)**
* **運作原理：** 在晶片電源網路（Power Distribution Network, PDN）中加入主動或被動的電路補償元件。當某個邏輯閘大量耗電時，功率均衡器會自動釋放額外電流；反之則吸收電流。
* **安全效益：** 透過平滑化電源供應端（VDD）感測到的電流波動，隱藏晶片內部的實際運算動態。



---

### 三、 補充架構概念：隱藏（Hiding）與遮蔽（Masking）的差異

在實際的 IC 安全設計中，通常會將上述的隱藏技術（Hiding）與另一大類防禦——遮蔽技術（Masking，如布林遮蔽 Boolean Masking）結合使用：

* **隱藏技術（如 Shuffling、Clock Jitter、Dual-Rail）：** 試圖讓攻擊者「測不到」有意義的功耗特徵或使其對齊失效。
* **遮蔽技術（Masking）：** 屬於數學層面的防禦（Information-Theoretic Countermeasure），將敏感資料與隨機遮蔽值進行 XOR 運算，使攻擊者即便精確測出功耗，測到的也只是隨機值而非真實資料。

兩者相輔相成，共同構成高等級安全晶片（如 FIPS 140-3 Level 3/4）防禦旁路攻擊的實體防線。

---

### 參考資料 (References & Sources)

1. **Mangard, S., Oswald, E., & Popp, T. (2008).** *Power Analysis Attacks: Revealing the Secrets of Smart Cards*. Springer. (系統性論述時域隱藏、時脈抖動、虛擬指令與雙軌預充電邏輯（WDDL）等硬體防禦機制的經典專書)。
2. **Kris Chapman, et al.** *Designing DPA-Resistant CMOS Circuits*. (深入探討邏輯閘層級之雙軌預充電邏輯與動態功率平衡技術的工程實務文獻)。