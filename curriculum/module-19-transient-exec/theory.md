# Transient Execution Attacks (Spectre, Meltdown, Rowhammer)

## Spectre Attacks (CVE-2017-5753)

### Principle
Spectre exploits speculative execution to leak data from processes that should be isolated. The processor speculatively executes instructions past conditional branches, using registers that the victim should not expose.

### Variant 1: Bounds Check Bypass
```c
// Victim code
if (array1_size > array1_index) {
    temp = array1[array1_index];  // Speculatively executed even if index out of bounds
    secret = array2[temp * 256];  // Data-dependent cache access
}
// Attacker observes cache timing to recover `secret`
```

### Variant 2: Branch Target Injection (BTI)
- Attacker trains branch predictor to redirect execution to victim's gadget
- Gadget loads secret into register, touches attacker's cache
- Attacker measures cache timing to recover secret

### Variant 4: Spectre-RSB (Return Stack Buffer)
- Attacks return instruction predictor instead of conditional branch predictor
- Same mechanism: train predictor, speculative gadget loads secret, measure timing

## Meltdown Attack (CVE-2017-5754)

### Principle
Meltdown exploits out-of-order execution to read kernel memory from user space. Normally, accessing a non-canonical or unprivileged page triggers a page fault. But with out-of-order execution, the load is executed speculatively before the fault is raised.

### Attack Steps
1. Access a kernel memory address (page fault triggered)
2. Processor out-of-order executes the load (speculative)
3. Speculative load brings kernel data into cache
4. Page fault raises, rollback occurs...
5. ...but cache state remains changed
6. Flush+Reload attacker measures timing → recovers kernel secret

### Why It Works on Intel
- Intel's out-of-order execution engine does not checkpoint page table entries
- Speculative load bypasses permission checks
- Transient access leaves cache side effects

### ARM/macOS Status
ARM processors have additional protection (TTBR0/TTBR1 isolation) that prevents this attack class. Apple's macOS (Intel-based at the time) was patched via KPTI (Kernel Page Table Isolation).

## Rowhammer (Memory Hardware Vulnerability)

### Principle
Rowhammer: By rapidly activating (reading/writing) specific DRAM rows, electromagnetic interference flips bits in adjacent rows. The physical effect occurs because the charge on nearby capacitors is disturbed by the strong electric fields from active rows.

### DRAM Architecture
- Memory is organized as rows and columns
- Row activation (ACTIVATE command) refreshes the row and leaks charge to adjacent rows
- Row refresh (REFRESH command) restores charge; hammering refreshes too slowly

### Exploitation
1. **Page table bit-flipping**: Flip PTE (Page Table Entry) bit in attacker's page
2. **Privilege escalation**: Attacker maps kernel page as RWX
3. **Code execution**: Jump to attacker-controlled kernel page
4. **Full root compromise**

### Mitigations
1. **TRR (Target Row Refresh)**: Intel/ARM DRAM controller monitors adjacent rows
2. **Larger page sizes**: 2MB/1GB pages reduce row density (fewer victim rows per aggressor row)
3. **PATROL scrub**: Background DDR memory refresh for hot rows
4. **Intel MKTME**: Memory encryption with per-process keys (data at rest protection, not Rowhammer defense)
5. **AMD SME/SEV**: Encrypted memory, but Rowhammer affects physical bits before encryption

## Combined Attacks (Spectre + Rowhammer)
1. Rowhammer flips page table bits → attacker gains kernel access
2. Attacker in kernel can now access caches and timing
3. Flush+Reload recovers victim process secrets through kernel cache
4. Combined: physical memory attack + side-channel for privileged access leak

## References
- Kocher, P., et al. (2019). "Spectre Attacks: Exploiting Speculative Execution." IEEE S&P 2019.
- Kocher, P., et al. (2014). "Meltdown: Reading Kernel Memory from User Space." USENIX Security 2018.
- Yarom, Y., & Bhattacharjee, A. (2018). "Rowhammer for Dummies." USENIX Security 2018.
- VUSec: https://www.vusec.net/
