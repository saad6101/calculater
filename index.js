document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        container: document.querySelector('.keys'),
        display: document.querySelector('.display'),
        rgbStrips: document.querySelectorAll('.rgb-strip'),
        toggleButton: document.querySelector('.toggle-mode'),
        basicKeys: ['7', '8', '9', 'C', '4', '5', '6', '/', '1', '2', '3', '*', '0', '.', '=', '-', 'DEL', 'COP', '^', '+'],
        advancedKeys: ['sin', 'cos', 'tan', 'log', 'ln', '(', ')', 'pi', 'e', 'sqrt'],
        currentInput: '0',
        advancedMode: false,
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FF8C33', '#8C33FF', '#33FF8C'],
        sounds: {
            keyPress: new Audio('sounds/key-press.mp3'),
            toggleMode: new Audio('sounds/correct.mp3'),
            copy: new Audio('sounds/correct.mp3'),
            error: new Audio('sounds/error.mp3'),
            backgroundMusic: new Audio('sounds/background.mp3')
        }
    };

    // Initialize calculator
    calculator.advancedKeys.push(...calculator.basicKeys);
    updateKeys();

    // Play background music after user interaction
    document.addEventListener('click', () => {
        calculator.sounds.backgroundMusic.loop = true;
        calculator.sounds.backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
        });
    }, { once: true });

    // Event delegation for keys
    calculator.container.addEventListener('click', handleKeyPress);
    calculator.toggleButton.addEventListener('click', toggleMode);
    document.addEventListener('keydown', handleKeyboardInput);

    function handleKeyPress(e) {
        const key = e.target.closest('.key');
        if (!key) return;
        
        const value = key.textContent;
        processInput(value);
        animateKey(key);
        changeRGBColors();
        if (key.textContent  == "=")
            {
                playSound(calculator.sounds.copy);
            }
            else if (key.textContent == "C"|| key.textContent == "DEL")
                {
                    playSound(calculator.sounds.copy);
                }
            else 
            {
                playSound(calculator.sounds.keyPress);
            }

    }

    function processInput(value) {
        try {
            if (value === '=') {
                calculator.currentInput = math.evaluate(calculator.currentInput).toString();
            } else if (value === 'DEL') {
                calculator.currentInput = calculator.currentInput.slice(0, -1) || '0';
            } else if (value === 'COP') {
                copyToClipboard();
            } else if (value === 'C') {
                calculator.currentInput = '0';
            } else {
                if (calculator.currentInput === '0') calculator.currentInput = '';
                if (calculator.currentInput.length > (calculator.advancedMode ? 30 : 20)) {
                    showPopup('Error: Input too long!');
                    playSound(calculator.sounds.error);
                    return;
                }
                calculator.currentInput += value;
            }
            updateDisplay();
        } catch {
            calculator.currentInput = 'Error';
            updateDisplay();
            playSound(calculator.sounds.error);
        }
    }

    function updateDisplay() {
        calculator.display.textContent = calculator.currentInput;
    }

    function animateKey(key) {
        key.classList.add('active');
        setTimeout(() => key.classList.remove('active'), 200);
    }

    function changeRGBColors() {
        calculator.rgbStrips.forEach(strip => {
            strip.style.backgroundColor = 
                calculator.colors[Math.floor(Math.random() * calculator.colors.length)];
        });
    }

    function toggleMode() {
        calculator.advancedMode = !calculator.advancedMode;
        calculator.container.classList.toggle('grid-templateADV', calculator.advancedMode);
        calculator.container.classList.toggle('grid-template', !calculator.advancedMode);
        updateKeys();
        playSound(calculator.sounds.toggleMode);
        animateToggleButton();
    }

    function updateKeys() {
        calculator.container.innerHTML = (calculator.advancedMode ? 
            calculator.advancedKeys : calculator.basicKeys)
            .map(key => `<div class="key">${key}</div>`).join('');
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(calculator.currentInput)
            .then(() => {
                showPopup('Copied to clipboard!');
                playSound(calculator.sounds.copy);
            })
            .catch(() => {
                showPopup('Copy failed!');
                playSound(calculator.sounds.error);
            });
    }

    function showPopup(text, duration = 2000) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.textContent = text;
        document.body.appendChild(popup);

        const calculatorRect = calculator.container.getBoundingClientRect();
        popup.style.position = 'absolute';
        popup.style.top = `${calculatorRect.top - popup.offsetHeight - 10}px`;
        popup.style.left = `${calculatorRect.left}px`;
        popup.style.width = `${calculatorRect.width}px`;
        popup.style.textAlign = 'center';
        popup.style.zIndex = '1000';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        setTimeout(() => popup.remove(), duration);
    }

    function handleKeyboardInput(e) {
        const keyMap = {
            'Enter': '=',
            'Backspace': 'DEL',
            'Escape': 'C',
            '9' : '9',
            '8' : '8',
            '7' : '7',
            '6' : '6',
            '5' : '5',
            '4' : '4',
            '3' : '3',
            '2' : '2',
            '1' : '1',
        };
        const key = keyMap[e.key] || e.key;
        if (calculator.basicKeys.includes(key) || calculator.advancedKeys.includes(key)) {
            processInput(key);
            e.preventDefault();
        }
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    function animateToggleButton() {
        calculator.toggleButton.classList.add('dance');
        setTimeout(() => calculator.toggleButton.classList.remove('dance'), 500);
    }
});