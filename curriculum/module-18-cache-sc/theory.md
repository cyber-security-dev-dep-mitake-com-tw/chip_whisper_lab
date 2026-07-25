# Cache Side-Channel Attacks (Flush+Reload, Prime+Probe)

## Background

Modern CPUs use hierarchical caches (L1, L2, L3) to speed up memory access. When multiple processes share the same physical cache, a process can observe cache timing to infer what other processes are doing.

## Flush+Reload Attack (Flush+Reload)

### Attack Model
- Same physical cache shared between attacker and victim
- Attacker knows victim's memory access pattern (code analysis)
- Attacker measures timing of own cache access

### Steps
1. **Flush**: Attacker flushes cache line at address `X` (using `clflush` on x86)
2. **Wait**: Victim executes and potentially accesses address `X`
3. **Reload**: Attacker measures time to reload address `X`
4. **Analyze**: Fast access = victim loaded `X` into cache (cache hit)

### Attack on AES T-table
AES lookup table access patterns are data-dependent:
```
index = plaintext_byte ^ round_key_byte
t_table_entry = AES_T[index]
```
If attacker flushes specific T-table entries and victim is executing AES, the reload timing reveals which entries the victim accessed, revealing the key XOR plaintext.

### Code Sketch (C, Flush+Reload for AES)
```c
// Attacker side: flush and reload timing
unsigned char t = _mm_clflush(&t_table[guess]); // flush
asm volatile("mfence"); // ensure flush completes
// wait for victim to run
time_before = rdtsc();
t = t_table[guess]; // reload
time_after = rdtsc();
if (time_after - time_before < THRESHOLD) {
    // Victim accessed this table entry!
    key_candidates[key_byte].increment(guess);
}
```

## Prime+Probe Attack (Prime+Probe)

### Attack Model
- Shared cache set between attacker and victim
- No knowledge of victim's exact addresses
- Attacker fills entire cache set, waits for victim, then checks eviction

### Steps
1. **Prime**: Attacker fills all cache lines in set `S`
2. **Wait**: Victim executes, evicting attacker's cache lines from set `S`
3. **Probe**: Attacker re-accesses each line in set `S`
4. **Analyze**: Slow access = line was evicted by victim (= victim also used set `S`)

### Comparison: Flush+Reload vs Prime+Probe
| Feature | Flush+Reload | Prime+Probe |
|---------|-------------|-------------|
| Knowledge | Requires target address | No target address needed |
| Precision | High (per-address) | Medium (per-cache-set) |
| Overhead | Lower (only flush/reload target) | Higher (fills entire set) |
| Robustness | Target must share exact address | Works with any address in set |
| Applicability | Known victim code | Unknown victim code |

### Defenses
1. **Cache partitioning**: Intel CAT (Cache Allocation Technology)
2. **Constant-time algorithms**: No data-dependent memory access
3. **Randomized access patterns**: Break correlation between data and access pattern
4. **Core isolation**: Separate victim and attacker to different cores (NUMA)
5. **Cache locking**: Lock cryptographic operations in specific cache ways

## Rowhammer Cache Side-Channels
Recent research has shown that Rowhammer DRAM bit flips can be combined with cache side channels:
1. Rowhammer flips page table bits (privilege escalation)
2. Attacker in kernel can now access victim caches
3. Combined attack: physical memory attack + side-channel

## References
- Yarom, Y., & Falkner, K. (2014). FLUSH+RELOAD: A High Resolution Hidden Cache Side-Channel Attack. USENIX Security 2014.
- Paz, R., et al. (2012). "On the Power of Prime+Probe." AFRICACRYPT 2012.
- Bhattacharjee, A., et al. (2016). "The Prime+Probe on Private Caches." CT-RWC 2016.
- VUSec: Flush+Reload and Prime+Probe tutorials: https://www.vusec.net/
