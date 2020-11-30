const numbers = document.querySelectorAll('.number');
const outputBot = document.getElementById('outputBottom');
const outputTop = document.getElementById('outputTop');
const deleteNumber = document.getElementById('backspace');
const operators = document.querySelectorAll('.operator');
const clearAll = document.getElementById('ac');
const equal = document.getElementById('equal');
const percentage = document.getElementById('percentage');
const addDecimal = document.getElementById('addDecimal');
const changeSign = document.getElementById('changeSign');
const buttons = document.querySelectorAll('button');
let input1 = '0';
let input2 = null;
let operator = null;
let result = null;
let object;

percentage.addEventListener('click', () => modifyInput(percentFun));
addDecimal.addEventListener('click', () => modifyInput(decimalFun));
changeSign.addEventListener('click', () => modifyInput(signFun));
clearAll.addEventListener('click', clear);
deleteNumber.addEventListener('click', () => modifyInput(deleteNum));
equal.addEventListener('click', equalFun);
window.addEventListener('keydown', e => keysupport(e.key));
window.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

numbers.forEach(element => element.addEventListener('click', e => chooseInput(e.target.id)));
operators.forEach(element => element.addEventListener('click', e => getOperator(e.target.attributes['data-symbol'].value)));
buttons.forEach(element => element.addEventListener('click', e => addTransition(e.target)))

function chooseInput(number) {
    if (operator === null) {
        input1 = takeNumber(number, input1);
    }
    else {
        if (input2 === null) {
            if (/\.$/.test(input1)) {
                input1 = input1.substr(0, input1.length - 1);
            }
            outputTop.innerText = input1 + ' ' + operator;
        }
        input2 = takeNumber(number, input2);
    }
}

function getOperator(operatorInput) {
    if (input1 === null) {
        return;
    }
    if (input2 !== null) {
        operate(operator);
        if (input1 !== null) {
            operator = operatorInput;
            outputTop.innerText = operator;
            result = null;
        }
        else {
            outputTop.innerText += ' ' + input2 + ' =';
            operator = null;
        }
        input2 = null;
    }
    else {
        operator = operatorInput;
        outputTop.innerText = operator;
        result = null;
    }
}

function clear() {
    input1 = '0';
    input2 = null;
    operator = null;
    result = null;
    outputTop.innerText = '';
    outputBot.innerText = input1;
}

function equalFun() {
    if (operator === null || input2 === null) {
        return;
    }
    if (/\.$/.test(input2)) {
        input2 = input2.substr(0, input2.length - 1);
    }
    outputTop.innerText += ' ' + input2 + ' =';
    operate(operator);
    operator = null;
    input2 = null;
}

function takeNumber(number, input) {
    if (input === '0' || result || input === null) {
        input = number;
        if (result !== null) {
            outputTop.innerText = '';
            result = null;
        }
    }
    else if (input.length > 10) {
        return input;
    }
    else {
        input += number;
    }
    outputBot.innerText = input;
    return input;
}

function modifyInput(fun) {
    let input;
    if (input2 === null && operator === null && input1 !== null) {
        input = fun(input1);
        if (input !== null && input !== 'deleteResult') {
            input1 = input;
        }
        if (result !== null && input !== null) {
            result = null;
            outputTop.innerText = '';
        }
    }
    else if (input2 !== null) {
        input = fun(input2);
        if (input !== null && input !== 'deleteResult') {
            input2 = input;
        }
    }
}

function deleteNum(input) {
    if (result !== null) {
        return 'deleteResult';
    }
    if (input.length >= 2 && input.charAt(0) !== '-' || input.length >= 3) {
        input = input.substr(0, input.length - 1);
        outputBot.innerText = input;
        return input;
    }
    outputBot.innerText = '0';
    return '0';
}

function percentFun(input) {
    if ((input < 1 && input >= 1e-7) || (input > -1 && input <= -1e-6)) {
        input = input.replace('.', '.00');
    }
    else if ((input >= 1 || input <= -1)) {
        input = `${input / 100}`;
    }
    else {
        return null;
    }
    if (input.length > 11) {
        input = fitNumber(input);
    }
    outputBot.innerText = input;
    return input;
}

function decimalFun(input) {
    if (!input.includes('.') && input.length < 10) {
        outputBot.innerText = input + '.';
        return input + '.';
    }
    return null;
}

function signFun(input) {
    if (input === '0' || (input.length === 11 && input > 0)) {
        return null;
    }
    if (input.charAt(0) !== '-') {
        outputBot.innerText = '-' + input;
        return '-' + input;
    }
    input = input.substr(1, input.length - 1);
    outputBot.innerText = input
    return input;
}

function operate(operator) {
    if (operator === '÷') {
        operator = '/';
    }
    else if (operator === '×') {
        operator = '*';
    }
    switch (operator) {
        case '/':
            result = input1 / input2;
            break;
        case '*':
            result = input1 * input2;
            break;
        case '+':
            result = +input1 + +input2;
            break;
        case '-':
            result = input1 - input2;
    }
    formatOutput(result);
}

function formatOutput(result) {
    let string = '';
    if (result === Infinity) {
        input1 = null;
        outputBot.innerText = '呪術廻戦';
    }
    else if (result >= 1e11 || (result < 1e-9 && result > 0) || result <= -1e10 || (result > -1e-8 && result < 0)) {
        input1 = null;
        string = `${result.toExponential(5)}`;
        outputBot.innerText = string.replace(/\.?0+e/, 'e');
    }
    else {
        string = result.toString();
        if ((result < 1e-6 && result > 0) || (result > -1e-6 && result < 0)) {
            string = result.toFixed(10);
        }
        if (string.length > 11) {
            string = fitNumber(string);
        }
        if (/\.[0-9]*0$/.test(string)) {
            string = string.slice(0, string.search(/0+$/));
            if (/0\.$/.test(string)) {
                string = '0';
            }
        }
        input1 = string;
        outputBot.innerText = input1;
    }
}

function fitNumber(string) {
    if (string >= 1 || string <= -1) {
        let multiplier = 10 - string.indexOf('.');
        if (multiplier === 0 || multiplier === -1) {
            return `${Math.round(string)}`;
        }
        return `${Math.round(string * 10 ** multiplier) / 10 ** multiplier}`;
    }
    if (/[0-4]/.test(string.charAt(11))) {
        return string.substr(0, 11);
    }
    if (string.charAt(10) === '9') {
        let i = 10;
        do {
            i--;
        } while (string.charAt(i) === '9')
        if (i >= 2) {
            return string.substr(0, i) + `${+string.charAt(i) + 1}`;
        }
        return '1';
    }
    return string.substr(0, 10) + `${+string.charAt(10) + 1}`;
}

function addTransition(object) {
    object.classList.add('transition');
    setTimeout(() => object.classList.remove('transition'), 150);
}

function keysupport(key) {
    buttons.forEach(object => {
        if (object.attributes['data-key'].value === key) {
            object.click();
            return;
        }
    })
    if (key === 'Enter') {
        buttons[19].click();
    }
}