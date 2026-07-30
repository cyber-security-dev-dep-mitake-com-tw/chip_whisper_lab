

## Ch3 HW Security Ecosystem (硬體安全生態系統)

### 單元 3.1：Background of Hardware Security (1) (硬體安全的背景與演進)

#### 1. 典範轉移：從軟體防護到硬體信任 (Paradigm Shift)

傳統的資訊安全架構高度集中於軟體層面，例如防毒軟體、防火牆、作業系統的權限控管與軟體加密協定（如 TLS）。這些防護機制的運作，皆建立在一個未經證實的假設上：**底層硬體會忠實且安全地執行軟體指令。**

然而，硬體是整個運算系統的「第零層（Layer 0）」。一旦底層硬體遭到竄改或存在實體漏洞，上層軟體所建立的密碼學防護、記憶體隔離與存取控制將瞬間瓦解。隨著攻擊技術的演進，攻擊者逐漸發現，與其與成熟的軟體防護機制正面交鋒，不如直接從物理層或硬體微架構（Microarchitecture）發動降維打擊。

#### 2. 驅動力：全球化與碎片化的 IC 供應鏈 (The Globalized IC Supply Chain)

推動硬體安全成為獨立生態系統的最主要原因，在於現代半導體產業鏈的結構性改變。

早期的垂直整合製造商（IDM, Integrated Device Manufacturer）擁有從設計、製造到封裝的完整內部控制權，安全風險相對可控。然而，現代 IC 產業高度依賴無晶圓廠模式（Fabless Model）與全球化分工：

1. **第三方矽智財（3rd-Party IP）：** SoC 整合了來自全球各地供應商的 IP 核心（如 CPU, DSP, Crypto Engines），設計公司難以逐行驗證這些外部 IP 是否含有惡意後門。
2. **委外晶圓製造（Foundry）：** 設計圖（GDSII 格式）被送往海外晶圓代工廠製造。在缺乏信任的製造環境中，晶片設計可能被竊取，或被植入惡意邏輯閘。
3. **委外封裝測試（OSAT）：** 在封裝與測試階段，同樣面臨晶片被替換、過度生產（Overproduction）或非授權讀取測試金鑰的風險。

這種漫長且涉及多方利益關係人的供應鏈，使得「硬體信任」不再是理所當然，必須依賴嚴格的技術規範與安全標準來確保。

#### 3. 硬體面臨的核心威脅分類 (Taxonomy of Hardware Threats)

在硬體安全生態系的背景下，產業界目前面臨四大核心實體威脅：

* **硬體木馬 (Hardware Trojans, HT)：**
在 IC 設計或光罩製造階段，被惡意植入的隱蔽電路。硬體木馬通常包含兩個部分：「觸發器（Trigger）」與「有效酬載（Payload）」。在特定條件滿足前（如特定計數器數值、特定外部訊號），木馬保持休眠以躲避出廠測試；一旦觸發，便會改變晶片邏輯、洩漏加密金鑰或引發系統癱瘓。
* **旁路攻擊 (Side-Channel Attacks, SCA)：**
攻擊者不直接破解密碼學演算法的數學基礎，而是藉由監控晶片在執行加密運算時產生的「物理洩漏」——如功耗變化（Power Analysis）、電磁輻射（EM Analysis）或運算時間差（Timing Analysis），利用統計學方法反推出內部儲存的私鑰。
* **逆向工程與智財盜竊 (Reverse Engineering & IP Piracy)：**
攻擊者利用化學腐蝕劑剝離晶片封裝（Delayering），並透過掃描式電子顯微鏡（SEM）拍攝每一層金屬佈線，企圖還原電路網表（Netlist）。這不僅會導致企業核心專利流失，更方便攻擊者尋找實體漏洞。
* **晶片仿冒與過度生產 (Counterfeiting & Overproduction)：**
惡意代工廠在未經授權的情況下，利用客戶提供的光罩生產額外的晶片流入黑市（Ghost ICs）；或回收電子垃圾中的舊晶片，重新打磨標示（Remarking）為高規格新品出售。這會對國防、航太或醫療設備造成致命的可靠度危機。

#### 4. 硬體漏洞的特性：極高的修復成本

軟體漏洞通常可以透過發布修補程式（Patch）或線上更新（OTA）快速解決。然而，硬體在物理上具有**不可變性（Immutability）**。
如果晶片在流片（Tape-out）後被發現存在實體層級的安全漏洞或硬體木馬，幾乎無法透過軟體完美修補。即便能用軟體繞過，往往也會伴隨嚴重的效能衰退。唯一的徹底解決方案是重新設計並再次流片（Re-spin），這將耗費數百萬美元的成本與數個月的時間。因此，硬體安全生態系統的核心訴求，便是推動「Security by Design（安全源於設計）」，在晶片架構規劃的初期便導入安全驗證與防護機制。

---

### 參考資料 (References & Sources)

1. **Tehranipoor, M., & Koushanfar, F. (2010).** *A Survey of Hardware Trojan Taxonomy and Detection*. IEEE Design & Test of Computers. (系統性定義硬體木馬威脅模型與供應鏈風險的經典文獻)。
2. **Defense Science Board (DSB), US Department of Defense.** *High Performance Microchip Supply*. (美國國防部科學委員會針對全球半導體供應鏈安全脆弱性與硬體信任危機所發布的權威政策與技術報告)。
3. **Bhasin, S., et al. (2021).** *Hardware Security: A Primer*. Springer. (全面涵蓋硬體逆向工程、旁路攻擊與供應鏈防護機制的現代學術專著)。

---


1. 威脅驅動的產業變革：建立完整的安全生態系
在單元 3.1 中，我們探討了硬體設計與供應鏈面臨的嚴峻實體威脅。面對這些無法單靠軟體修補的硬體漏洞，全球半導體產業逐漸意識到，單打獨鬥無法保障終端產品的安全。這促使了一個由多方利害關係人共同組成的「硬體安全生態系統」的誕生。

這個生態系統的核心參與者包含：

安全矽智財供應商 (Security IP Providers)： 專門研發並提供經過驗證的硬體信任根 (HRoT)、PUF、防篡改密碼學引擎等模組。

電子設計自動化廠商 (EDA Vendors)： 將安全驗證工具（如資訊流追蹤、硬體木馬偵測、旁路洩漏模擬）整合進傳統的晶片設計流程中。

晶圓代工廠與封測廠 (Foundries & OSATs)： 建立安全的製造環境與零接觸佈建 (Zero-Touch Provisioning) 流程，確保金鑰注入與特徵提取階段不被竊聽。

獨立安全測試實驗室與認證機構 (Certification Bodies)： 提供第三方的安全性評估（如 Common Criteria, FIPS 140-3 實驗室），為 IC 的抗攻擊能力背書。

2. 安全源於設計 (Security-by-Design) 與硬體安全生命週期
為了在根源上消除漏洞，IC 設計產業將資訊安全工程導入了傳統的特定應用積體電路 (ASIC) / 系統單晶片 (SoC) 開發流程中，形成硬體安全開發生命週期 (Secure Hardware Development Lifecycle, Secure HDLC)。

傳統的 PPA（效能、功耗、面積）設計指標，如今擴展為 PPAS（效能、功耗、面積、安全）。

規格定義階段 (Specification)： 必須進行威脅建模 (Threat Modeling)。針對 IC 預期的應用場景，列出潛在的攻擊向量，並定義相應的安全需求（例如：是否需要抵禦雷射錯誤注入？）。

暫存器傳輸級設計 (RTL Design)： 開發人員需遵循硬體安全編碼規範，避免常見的硬體漏洞（如：未清除重置狀態的敏感暫存器、導致時序洩漏的條件分支）。

矽前驗證 (Pre-Silicon Verification)： 在流片前，利用正規驗證 (Formal Verification) 確保安全隔離邊界不被打破，並透過模擬評估側信道洩漏的風險。

3. 法規與標準：生態系成長的強力推手
硬體安全生態系的快速發展，很大程度上歸功於國際法規與安全標準的強制力。隨著物聯網 (IoT)、車聯網 (V2X) 與關鍵基礎設施的普及，各國政府與產業聯盟不再容忍缺乏硬體信任基礎的設備連網。

MITRE 硬體漏洞字典 (Hardware CWE)： MITRE 擴展了傳統的 CWE 列表，詳細歸納了硬體設計中的常見弱點（如 CWE-1189：不當的安全隔離），為生態系提供了共通的溝通語言。

車用網路安全標準 (ISO/SAE 21434)： 強制要求車用晶片設計必須進行嚴格的網路安全風險評估 (TARA)，推動了車用微控制器 (MCU) 全面內建硬體安全模組 (HSM)。

消費性與工業物聯網基線 (NIST IR 8259 / ETSI EN 303 645)： 規範了連網設備必須具備硬體級別的安全啟動 (Secure Boot) 與加密儲存能力，從法規面確立了硬體信任根的不可或缺性。

4. 前瞻防禦計畫：從被動修補到主動防禦
除了商業標準，各國國防與學術界也積極投資於新一代的硬體架構安全。例如美國國防高等研究計劃署 (DARPA) 啟動的 SSITH 計畫 (System Security Integration Through Hardware and Firmware)。
該計畫的目標是從晶片的微架構層面（如 RISC-V 指令集架構），徹底防禦所有七大類常見軟體漏洞（包含緩衝區溢位、權限提升等）。這標誌著硬體安全的終極目標：硬體不應只是保護自身的金鑰，更應該主動為上層軟體提供堅不可摧的執行環境。

參考資料 (References & Sources)
MITRE Hardware CWE (Common Weakness Enumeration) - Hardware Design Weaknesses. (業界公認的硬體設計安全漏洞與弱點分類字典，為 IC 設計工程師提供防禦檢核表)。

ISO/SAE 21434:2021 - Road vehicles — Cybersecurity engineering. (國際標準化組織發布的車輛網路安全工程標準，強制要求車用半導體供應鏈導入硬體安全生命週期管理)。

DARPA SSITH Program - System Security Integration Through Hardware and Firmware. (美國國防部旨在透過底層硬體微架構的革新，直接免疫多數現代軟體漏洞的先驅研究計畫)。