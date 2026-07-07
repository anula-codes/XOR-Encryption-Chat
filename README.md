# XOR Cipher 

## Live demo

[anula-codes.github.io/XOR-Encryption-Chat](https://anula-codes.github.io/XOR-Encryption-Chat/)

An interactive, browser-based sandbox for understanding how symmetric XOR ciphers work — and, just as importantly, why they aren't secure enough to use on their own.

Built as an educational tool rather than a security product: every claim it makes about the cipher is accurate, including the ones that say "this isn't safe for real use."

## Why this project exists

Most XOR-cipher demos either oversell themselves ("AES-equivalent encryption!") or treat XOR as a black box you paste text into. This one does neither. It shows the actual bitwise math happening on the first character of your message, computes real key-repetition statistics instead of a fake strength meter, and explicitly explains the cryptographic weakness (keystream reuse → frequency analysis) rather than glossing over it.

The goal is to demonstrate the mechanism clearly enough that "why XOR alone is insecure" becomes obvious from using the tool, not just from reading a warning label.

## Features

- **Live XOR encryption/decryption** — type a message and a repeating key, get real hex ciphertext and a round-trip decryption check, computed client-side.
- **Key Coverage indicator** — a real (not decorative) measurement of how many times your key repeats across the message, with a plain-language explanation of what that means for security.
- **Bitwise Breakdown** — visualizes the actual XOR operation (`message byte ⊕ key byte = cipher byte`) in binary for the first character, so the math is visible, not hidden.
- **Cipher Log** — a running session history of everything you've encrypted, so you can compare inputs and outputs side by side.
- **Honest framing throughout** — no claims of production-grade security; a footnote explains what real systems (AES-GCM, ChaCha20-Poly1305) do differently and why that matters.

## How it works

1. **Input processing** — each character of the message is converted to its 8-bit ASCII binary representation.
2. **XOR ciphering** — each message bit is XORed with the corresponding key bit, repeating the key cyclically to match the message length.
3. **Round-trip check** — XOR is its own inverse, so applying the same key to the ciphertext restores the original plaintext exactly, which the tool verifies live.

## Why XOR alone isn't secure

Once a key is shorter than the message (which it almost always is), it repeats. A repeating keystream leaks structure that frequency analysis can exploit — the same weakness that broke the centuries-old Vigenère cipher. XOR also provides no integrity check, so a tampered ciphertext byte is never detected. Modern authenticated ciphers like **AES-GCM** and **ChaCha20-Poly1305** solve both problems: an unpredictable, non-repeating keystream and a built-in check that detects tampering.

## Tech stack

- Plain HTML, CSS, and JavaScript — no frameworks, no build step, no external runtime dependencies
- Google Fonts (Inter for UI text, JetBrains Mono for hex/binary data)
- Material Symbols for icons
- All computation runs client-side in the browser; nothing is sent to a server

## Running it

No build step required. Download `xor-cipher-lab.html` and open it directly in any modern browser, or serve it statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/xor-cipher-lab.html
```

## Project structure

```
xor-cipher-lab.html   # Everything — markup, styles, and logic in one file
```

## Disclaimer

This is a learning tool, not a security product. Do not use XOR ciphers (or this tool) to protect anything sensitive. For real encryption needs, use vetted, audited libraries implementing standards like AES-GCM or ChaCha20-Poly1305.

## License

MIT
