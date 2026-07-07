function toggleKeyVisibility() {
            const input = document.getElementById('key-input');
            const icon = document.getElementById('key-toggle-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility_off';
            }
        }

        function xorEncryptDecrypt(text, key) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        }

        function toHex(str) {
            let hex = '';
            for (let i = 0; i < str.length; i++) {
                const byte = str.charCodeAt(i).toString(16).padStart(2, '0').toUpperCase();
                hex += byte + ' ';
            }
            return hex.trim();
        }

        function toBinary(num) {
            return num.toString(2).padStart(8, '0');
        }

        function updateKeyCoverage() {
            const key = document.getElementById('key-input').value;
            const message = document.getElementById('message-input').value;
            const bars = document.querySelectorAll('#coverage-bars .bar');
            const textEl = document.getElementById('coverage-text');

            if (!key) {
                bars.forEach(b => { b.className = 'bar'; });
                textEl.textContent = 'Add a key to measure coverage.';
                return;
            }

            let lit = 1;
            if (key.length >= 16) lit = 4;
            else if (key.length >= 12) lit = 3;
            else if (key.length >= 8) lit = 2;
            else lit = 1;

            const colorClass = ['lit-error', 'lit-warning', 'lit-warning', 'lit-secondary'][lit - 1];
            bars.forEach((b, i) => {
                b.className = 'bar' + (i < lit ? ' ' + colorClass : '');
            });

            if (message.length > key.length) {
                const repeats = Math.ceil(message.length / key.length);
                textEl.innerHTML = `Your ${key.length}-char key repeats <span class="accent">${repeats}×</span> across this message — enough for frequency analysis to find patterns.`;
            } else if (message.length > 0) {
                textEl.textContent = `Key covers the whole message without repeating (rare in practice).`;
            } else {
                textEl.textContent = `Longer, non-repeating keys resist pattern analysis better.`;
            }
        }

        function renderBitBreakdown(message, key, encrypted) {
            const container = document.getElementById('bit-breakdown');
            if (!message) {
                container.innerHTML = '<span class="placeholder">Encrypt a message to see the XOR operation on its first character.</span>';
                return;
            }
            const mChar = message[0];
            const kChar = key[0 % key.length];
            const mCode = mChar.charCodeAt(0);
            const kCode = kChar.charCodeAt(0);
            const rCode = encrypted.charCodeAt(0);

            container.innerHTML = `
                <div class="bit-chip">
                    <span class="chip-label">'${escapeHtml(mChar)}'</span>${toBinary(mCode)}
                </div>
                <span class="xor-symbol">⊕</span>
                <div class="bit-chip">
                    <span class="chip-label">'${escapeHtml(kChar)}'</span>${toBinary(kCode)}
                </div>
                <span class="xor-symbol">=</span>
                <div class="bit-chip result">
                    <span class="chip-label">cipher byte</span>${toBinary(rCode)}
                </div>
            `;
        }

        function encryptAndSend() {
            const message = document.getElementById('message-input').value;
            const key = document.getElementById('key-input').value;
            const encryptedDiv = document.getElementById('encrypted-output');
            const decryptedDiv = document.getElementById('decrypted-output');

            if (!message) {
                encryptedDiv.classList.add('italic');
                encryptedDiv.textContent = "Error: no message entered.";
                decryptedDiv.textContent = "";
                return;
            }

            if (!key) {
                encryptedDiv.classList.add('italic');
                encryptedDiv.textContent = "Error: no key set.";
                decryptedDiv.textContent = "";
                return;
            }

            const encrypted = xorEncryptDecrypt(message, key);
            const encryptedHex = toHex(encrypted);

            encryptedDiv.classList.remove('italic');
            encryptedDiv.textContent = "0x " + encryptedHex;

            const decrypted = xorEncryptDecrypt(encrypted, key);
            decryptedDiv.classList.remove('italic');
            decryptedDiv.textContent = decrypted;

            encryptedDiv.animate([
                { opacity: 0.5, transform: 'scale(0.99)' },
                { opacity: 1, transform: 'scale(1)' }
            ], { duration: 300, easing: 'ease-out' });

            renderBitBreakdown(message, key, encrypted);
            addToLog(message, encryptedHex, decrypted);

            document.getElementById('message-input').value = '';
            document.getElementById('char-count').textContent = '0 Chars';
            updateKeyCoverage();
        }

        function addToLog(original, encryptedHex, decrypted) {
            const log = document.getElementById('message-log');
            const placeholder = log.querySelector('p');
            if (placeholder) log.innerHTML = '';

            const item = document.createElement('div');
            item.className = 'message-item';
            const timestamp = new Date().toLocaleTimeString();

            item.innerHTML = `
                <div class="timestamp">${timestamp}</div>
                <div class="text"><strong>Original:</strong> ${escapeHtml(original)}</div>
                <div class="encrypted-text"><strong>Encrypted (hex):</strong> ${escapeHtml(encryptedHex)}</div>
                <div class="decrypted-text"><strong>Decrypted:</strong> ${escapeHtml(decrypted)}</div>
            `;
            log.insertBefore(item, log.firstChild);
        }

        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).catch(() => {});
        }

        document.getElementById('message-input').addEventListener('input', function(e) {
            document.getElementById('char-count').textContent = e.target.value.length + " Chars";
            updateKeyCoverage();
        });

        document.getElementById('key-input').addEventListener('input', updateKeyCoverage);

        document.getElementById('message-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                encryptAndSend();
            }
        });

        updateKeyCoverage();