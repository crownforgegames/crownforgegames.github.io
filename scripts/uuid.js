function fnv1aHex(seed) {
    let h1 = 0x811c9dc5 >>> 0; // low
    let h2 = 0x811c9dc5 >>> 0; // high
    for (let i = 0; i < seed.length; i++) {
        const code = seed.charCodeAt(i);
        h1 ^= code;
        h1 = Math.imul(h1, 0x01000193) >>> 0;
        h2 ^= (code >>> 8);
        h2 = Math.imul(h2, 0x01000193) >>> 0;
    }
    function toHex(n) { return (n >>> 0).toString(16).padStart(8, '0'); }
    return toHex(h1) + toHex(h2);
}