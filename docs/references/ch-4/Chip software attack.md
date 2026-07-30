

## Ch4 Security on Chip (晶片內建安全架構)

### 單元 4.2：Software Attacks (軟體攻擊與硬體防禦機制)

#### 1. 晶片設計視角下的軟體威脅模型 (Threat Model of Software Attacks)

在探討晶片安全時，雖然實體攻擊（如探針、雷射錯誤注入）破壞力強大，但**軟體攻擊（Software Attacks）**才是現實世界中最常發生、影響範圍最廣的威脅。其原因在於，軟體攻擊通常可以**遠端發動（Remote Exploitation）**，攻擊者無需取得設備的物理接觸權限。

從硬體設計者的角度來看，上層作業系統與應用程式必定充滿漏洞。晶片安全的終極目標，是確保即使非安全處理環境（NSPE）的軟體被駭客完全控制（例如取得了 Root 權限），攻擊者依然無法打破硬體隔離邊界去存取安全處理環境（SPE）中的密碼學金鑰或破壞信任根。

#### 2. 常見的純軟體攻擊手法 (Common Software Attack Vectors)

駭客經常利用程式碼在記憶體操作上的失誤來發動攻擊。這些軟體漏洞若無硬體機制的阻擋，將直接導致系統淪陷：

* **緩衝區溢位與記憶體破壞 (Buffer Overflow & Memory Corruption)：**
當程式未正確檢查輸入長度時，攻擊者可寫入超過緩衝區容量的資料，進而覆蓋相鄰的記憶體空間。這不僅能篡改重要變數，更常被用來覆蓋堆疊（Stack）中的「返回位址（Return Address）」，將程式的執行流程導向攻擊者植入的惡意程式碼（Shellcode）。
* **控制流劫持 (Control-Flow Hijacking - ROP/JOP)：**
現代系統普遍啟用了防止惡意程式碼執行的防護（如不可執行位元 NX Bit）。為繞過此限制，攻擊者發展出**返回導向編程 (Return-Oriented Programming, ROP)** 與**跳轉導向編程 (Jump-Oriented Programming, JOP)**。攻擊者不寫入新的程式碼，而是利用系統記憶體中現有的、合法程式碼片段（稱為 Gadgets），透過精心構造的返回位址鏈，將這些合法片段拼接起來，執行惡意邏輯。

#### 3. 微架構漏洞：以軟體手段發動的實體攻擊 (Microarchitectural Attacks)

近年來，軟體攻擊進化到了直接針對「晶片微架構設計（Microarchitecture）」缺陷的層次。這類攻擊證明了，即使軟體在邏輯與權限上完全正確，硬體為了追求效能所做的設計，仍可能洩漏機密。

* **推測執行攻擊 (Speculative Execution Attacks)：**
以著名的 **Spectre** 與 **Meltdown** 漏洞為代表。現代高效能 CPU 為了隱藏記憶體延遲，會預測程式的分支走向並提前「推測執行（Speculate Execution）」指令。如果預測錯誤，CPU 會捨棄運算結果（邏輯上狀態恢復）。
然而，推測執行過程中，資料會被載入**快取記憶體 (Cache)** 中。攻擊者可利用精巧的軟體程式碼，引誘 CPU 推測執行去讀取本不該有權限存取的高機密記憶體區塊。隨後，利用快取時間差攻擊（Cache Side-Channel，如 Flush+Reload），推測出被讀取的機密資料內容。這種攻擊成功跨越了作業系統與硬體設置的安全邊界。

#### 4. 晶片設計的硬體反制機制 (Hardware Countermeasures for Software Security)

為抵禦上述軟體與微架構攻擊，現代晶片設計（SoC）必須在底層提供強大的硬體安全基元（Hardware Security Primitives），主動協助軟體進行防禦：

1. **記憶體執行保護 (eXecute-Never, XN / NX Bit)：**
在記憶體管理單元（MMU）或記憶體保護單元（MPU）的分頁表中，加入屬性控制位元。強制規定「可寫入（Writable）」的資料區塊（如 Stack 或 Heap）絕對「不可執行（Non-Executable）」。這能直接阻斷傳統 Shellcode 的執行。
2. **控制流完整性 (Control Flow Integrity, CFI) 與指標認證：**
針對 ROP/JOP 攻擊，晶片架構導入了硬體層級的防護。例如 ARM 的**指標認證 (Pointer Authentication, PAC)** 技術，利用密碼學機制，在函數返回位址寫入堆疊前，結合一個硬體專屬金鑰與上下文計算出一個驗證碼（MAC）並附加於指標高位元。返回時若驗證失敗，硬體將觸發例外錯誤，直接阻斷控制流劫持。
3. **記憶體標籤擴充 (Memory Tagging Extension, MTE)：**
這是一種硬體輔助的記憶體安全機制。晶片在配置記憶體時，會為每一個記憶體區塊（例如 16 Bytes）分配一個隨機的「實體標籤」。同時，指向該區塊的指標（Pointer）也必須攜帶相同的「邏輯標籤」。當 CPU 存取記憶體時，硬體會自動比對兩者是否吻合。這能在極低的效能損耗下，於硬體層級徹底消滅緩衝區溢位與釋放後使用（Use-After-Free）等記憶體破壞漏洞。

---

### 參考資料 (References & Sources)

1. **Kocher, P., et al. (2019).** *Spectre Attacks: Exploiting Speculative Execution*. IEEE Symposium on Security and Privacy (S&P). (揭示如何透過純軟體手法，利用現代處理器之推測執行機制發動微架構側信道攻擊的權威論文)。
2. **ARM Architecture Reference Manual.** *Pointer Authentication and Branch Target Identification*. (詳細說明 ARM 處理器如何透過硬體密碼學指令（PAC）來防禦 ROP/JOP 控制流劫持攻擊的技術規格書)。
3. **Szekeres, L., Payer, M., Wei, T., & Song, D. (2013).** *SoK: Eternal War in Memory*. IEEE Symposium on Security and Privacy. (系統性總結軟體記憶體破壞漏洞，以及作業系統與底層硬體防護機制演進的經典文獻)。


---


## Ch4 Security on Chip (晶片內建安全架構)

### 單元 4.3：Malicious Attacks (惡意硬體攻擊與實體威脅)

#### 1. 威脅模型：從軟體漏洞到主動式實體破壞

在前一節探討的「軟體攻擊」中，攻擊者通常是利用程式碼的邏輯缺陷（如緩衝區溢位）來發動遠端攻擊。然而，在「惡意攻擊（Malicious Attacks）」的範疇中，我們將焦點轉向具備**實體接觸能力（Physical Access）**或**硬體設計介入能力**的高階攻擊者。

這類攻擊並非依賴系統原有的軟體 Bug，而是攻擊者主動對晶片施加極端的物理干擾，或是直接從物理層面破壞、讀取、甚至篡改硬體的運作邏輯。這對高度重視實體安全的設備（如智慧卡、硬體錢包、車用安全模組）構成最嚴峻的挑戰。

#### 2. 主動式干擾：錯誤注入攻擊 (Fault Injection Attacks, FI)

錯誤注入攻擊是指攻擊者在晶片執行關鍵安全運算（如驗證密碼或加密資料）的瞬間，刻意施加超出硬體容忍範圍的物理干擾，迫使晶片內部的電晶體狀態發生短暫的位元翻轉（Bit Flip）或時序違規（Timing Violation）。

常見的錯誤注入手段包含：

* **電壓與時脈毛刺 (Voltage & Clock Glitching)：** 攻擊者瞬間拉低供電電壓或大幅縮短時脈週期。這會導致邏輯閘來不及完成信號傳遞，使得正反器（Flip-Flop）鎖存到錯誤的數值。這常被用來跳過安全啟動時的指令，例如將 `if (signature_valid)` 判斷式強行翻轉為 `True`。
* **光學與雷射錯誤注入 (Optical & Laser Fault Injection)：** 在晶片開蓋（Decapsulation）後，利用高能雷射脈衝精準照射特定的矽電路區域。光子會激發出電子電洞對（Electron-Hole Pairs），產生瞬間的光電流，精準改變單一暫存器的狀態。
* **差分錯誤分析 (Differential Fault Analysis, DFA)：** 這是一種結合錯誤注入與密碼學分析的高階攻擊。攻擊者在 AES 或 RSA 運算過程中注入一個隨機錯誤，並收集錯誤的密文（Faulty Ciphertext）。透過比對正確密文與錯誤密文之間的數學關聯性，攻擊者往往只需極少數的樣本就能反推出隱藏的私鑰。

#### 3. 侵入式篡改：實體探針與聚焦離子束 (Invasive Probing & FIB)

這類惡意攻擊需要極高的實驗室設備與資本，屬於最具破壞性的侵入式攻擊（Invasive Attacks）。

* **微探針技術 (Micro-probing)：** 攻擊者利用化學酸液移除晶片封裝後，在顯微鏡下將次微米級的探針直接接觸晶片內部的金屬資料匯流排（Data Bus），在資料傳輸時直接竊聽（Sniffing）金鑰明文。
* **聚焦離子束 (Focused Ion Beam, FIB) 篡改：** FIB 設備不僅能像電子顯微鏡般觀察電路，更具備「奈米級的手術能力」。攻擊者可利用高能鎵離子（Gallium Ions）切斷現有的金屬佈線，或沉積鉑（Platinum）來連接本不相連的節點。透過 FIB，攻擊者可實體短路掉硬體的安全檢查電路，或強行將加密防護的控制位元綁定為授權狀態。

#### 4. 惡意邏輯植入：硬體木馬 (Hardware Trojans) 的威脅

硬體木馬是供應鏈安全中最致命的惡意攻擊之一。它是指在 IC 的設計（RTL）、合成（Synthesis）或光罩製造（Foundry）階段，被惡意插入的隱蔽電路。

* **運作機制：** 為了躲避出廠時的邏輯測試（如 ATPG），硬體木馬通常由極其罕見的條件觸發（Trigger），例如特定的一長串外部輸入序列，或是經過數百萬個時脈週期的計數器。
* **有效酬載 (Payload)：** 一旦觸發，木馬可能癱瘓整個晶片（Denial of Service）、降低密碼學引擎的亂數品質（削弱加密強度），或透過外部介面（如 UART、甚至射頻天線）偷偷洩漏內部儲存的機密金鑰。

#### 5. 晶片內建的安全防護策略 (On-Chip Countermeasures)

為抵禦上述惡意實體與硬體攻擊，現代 SoC 在設計時必須導入多層次的硬體安全基元（Hardware Primitives）：

1. **環境感測器與自毀機制 (Environmental Sensors & Zeroization)：**
晶片內部散佈各種偵測器（電壓突波偵測、頻率異常偵測、光感測器與溫度感測器）。一旦偵測到 FI 攻擊的特徵，晶片會立即觸發系統重置，並瞬間抹除揮發性記憶體中的金鑰明文。
2. **主動式防護網 (Active Shield Mesh)：**
在晶片的最高層金屬佈置細密且持續傳送隨機密碼訊號的交錯網線。如果攻擊者企圖使用 FIB 進行切割或探針鑽孔，會立刻改變網線的電阻與電容值，或破壞密碼訊號的完整性，晶片便會永久鎖死。
3. **邏輯冗餘與錯誤偵測 (Logic Redundancy & Error Detection)：**
針對故障注入（FI），高安全等級的處理器會採用**雙核鎖步執行 (Dual-Core Lockstep)** 或是時間/空間冗餘設計（如指令重複執行兩次）。只要兩次運算結果不一致，硬體便判定遭到攻擊。密碼學引擎內部亦會加入同位元檢查（Parity Checks）與糾錯碼（ECC），防止 DFA 攻擊。

---

### 參考資料 (References & Sources)

1. **Biham, E., & Shamir, A. (1997).** *Differential fault analysis of secret key cryptosystems*. Advances in Cryptology—CRYPTO. (奠定利用錯誤注入攻擊進行密碼學破解（DFA）的理論基礎與數學模型的開創性論文)。
2. **Skorobogatov, S., & Anderson, R. (2002).** *Optical fault induction attacks*. Cryptographic Hardware and Embedded Systems (CHES). (首次公開展示如何利用光學與雷射脈衝對半導體安全晶片進行精準錯誤注入的經典文獻)。
3. **Bhunia, S., et al. (2014).** *Hardware Trojan attacks: Threat analysis and countermeasures*. Proceedings of the IEEE. (全面剖析硬體木馬植入手腕、觸發機制，以及現代 IC 供應鏈在流片前/流片後防護策略的權威綜述報告)。
