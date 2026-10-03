let currentNumber = "";
let previousNumber = "";
let operator = null;

const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

function updateDisplay() {
    currentDisplay.textContent = currentNumber || "0";

    if (operator && previousNumber) {
        previousDisplay.textContent =
            `${previousNumber} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}

function appendNumber(number) {

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    // Prevent leading zero
    if (currentNumber === "0" && number !== ".") {
        currentNumber = "";
    }

    currentNumber += number;
    updateDisplay();
}

function chooseOperator(selectedOperator) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    // Calculate previous operation first
    if (currentNumber !== "" && previousNumber !== "" && operator) {
        calculate();
    }

    if (currentNumber !== "") {
        previousNumber = currentNumber;
        currentNumber = "";
    }

    operator = selectedOperator;

    updateDisplay();
}

function calculate() {

    if (!previousNumber || !currentNumber || !operator) {
        return;
    }

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentDisplay.textContent = "Cannot divide";
                previousDisplay.textContent = "by zero";
                resetCalculator();
                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    currentNumber = formatResult(result);
    previousNumber = "";
    operator = null;

    updateDisplay();
}

function percentage() {

    if (currentNumber === "") {
        return;
    }

    currentNumber = String(parseFloat(currentNumber) / 100);

    updateDisplay();
}

function deleteLast() {

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}

function clearDisplay() {

    currentNumber = "";
    previousNumber = "";
    operator = null;

    updateDisplay();
}

function resetCalculator() {

    setTimeout(() => {
        currentNumber = "";
        previousNumber = "";
        operator = null;
        updateDisplay();
    }, 1200);
}

function formatResult(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return Number(number.toFixed(10)).toString();
}

function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator];
}

// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (!isNaN(key) || key === ".") {
        appendNumber(key);
    }

    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Backspace") {
        deleteLast();
    }

    if (key === "Escape") {
        clearDisplay();
    }

    if (key === "%") {
        percentage();
    }
});