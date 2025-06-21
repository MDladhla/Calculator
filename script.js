document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const calculator = document.getElementById('calculator');

    let currentInput = '';
    let operator = '';
    let previousInput = '';

    const actions = {
        append: (value) => {
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
            updateDisplay();
        },
        clear: () => {
            currentInput = '';
            operator = '';
            previousInput = '';
            updateDisplay();
        },
        delete: () => {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        },
        calculateResult: () => {
            if (previousInput === '' || currentInput === '') return;
            try {
                const expression = previousInput + operator + currentInput;
                const result = new Function('return ' + expression)();
                currentInput = result.toString();
                operator = '';
                previousInput = '';
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                updateDisplay();
            }
        },
        calculateSquareRoot: () => {
            if (currentInput === '') return;
            try {
                currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                updateDisplay();
            }
        },
        calculatePower: () => {
            if (currentInput === '') return;
            operator = '**';
            previousInput = currentInput;
            currentInput = '';
        },
        calculateSin: () => handleTrig(Math.sin),
        calculateCos: () => handleTrig(Math.cos),
        calculateTan: () => handleTrig(Math.tan),
        calculateLog: () => {
            if (currentInput === '') return;
            try {
                currentInput = Math.log10(parseFloat(currentInput)).toString();
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                updateDisplay();
            }
        }
    };

    calculator.addEventListener('click', (event) => {
        if (!event.target.matches('.button')) return;

        const button = event.target;
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === 'append' && isOperator(value)) {
            handleOperator(value);
        } else if (actions[action]) {
            actions[action](value);
        }
    });

    function handleOperator(op) {
        if (currentInput === '' && op === '-') {
            currentInput = '-';
            updateDisplay();
            return;
        }
        if (currentInput === '' && previousInput === '') return;
        if (currentInput !== '' && previousInput !== '') {
            actions.calculateResult();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '';
    }

    function handleTrig(func) {
        if (currentInput === '') return;
        try {
            const radians = parseFloat(currentInput) * Math.PI / 180;
            currentInput = func(radians).toString();
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
        }
    }

    function isOperator(value) {
        return ['/', '*', '-', '+'].includes(value);
    }

    function updateDisplay() {
        display.value = currentInput || previousInput + operator || '0';
    }
});