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
let input1 = '0';
let input2 = null;
let operator = null;
let result = null;

percentage.addEventListener('click', () => modifyInput(percentFun));
//addDecimal.addEventListener('click', decimalFun);
//changeSign.addEventListener('click', signFun);

numbers.forEach(element => element.addEventListener('click', e => {
    if (operator === null) {
        input1 = takenumber(e.target.id, input1);
    }
    else {
        if (input2 === null) {
            outputTop.innerText = input1 + ' ' + operator;
        }
        input2 = takenumber(e.target.id, input2);
    }
}))

operators.forEach(element => element.addEventListener('click', e => {
    if (input1 === null) {
        return;
    }
    operator = e.target.attributes['data-symbol'].value;
    if (input2 !== null) {
        operate(operator);
    }
    outputTop.innerText = operator;
    result = null;
}))

deleteNumber.addEventListener('click', () => {
    if (input2 !== null) {
        input2 = input2.substr(0, input2.length - 1);
        outputBot.innerText = input2;
    }
    else if (operator !== null) {
        operator = null;
        outputTop.innerText = '';
    }
    else {
        if (result === null) {
            input1 = input1.substr(0, input1.length - 1);
            outputBot.innerText = input1;
        }
    }
}
)

clearAll.addEventListener('click', () => {
    input1 = '0';
    input2 = null;
    operator = null;
    result = null;
    outputTop.innerText = '';
    outputBot.innerText = input1;
})

equal.addEventListener('click', () => {
    if (operator === null || input2 === null) {
        return;
    }
    outputTop.innerText += ' ' + input2 + ' =';
    operate(operator);
    operator = null;
});

function modifyInput(fun) {
    if (input2 === null && operator === null && input1 !== null) {
        input1 = fun(input1);
    }
    else if (input2 !== null) {
        input2 = fun(input2);
    }

}

function takenumber(number, input) {
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

function percentFun(input) {
    if ((input < 1 && input >= 1e-7) || (input > -1 && input <= -1e-6)) {
        input = input.replace('.', '.00');
    }
    else if ((input >= 1 || input <= -1)) {
        input = `${input / 100}`;
    }
    else {
        return input;
    }
    if (input.length > 11) {
        input = fitNumber(input);
    }
    outputBot.innerText = input;
    return input;
}

function operate(operator) {
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
    input2 = null;
}

function formatOutput(result) {
    let string = '';
    if (result >= 1e11 || (result < 1e-9 && result > 0) || result <= -1e10 || (result > -1e-8 && result < 0)) {
        input1 = null;
        string = `${result.toExponential(5)}`;
        outputBot.innerText = string.replace(/.?0+e/, 'e');
    }
    else if (result === Infinity) {
        input1 = null;
        outputBot.innerText = result;
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
            return string.substr(0, i - 1) + `${+string.charAt(i) + 1}`;
        }
        return '1';
    }
    return string.substr(0, 10) + `${+string.charAt(10) + 1}`;

}