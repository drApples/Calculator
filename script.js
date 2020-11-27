const numbers = document.querySelectorAll('.number');
const outputBot = document.getElementById('outputBottom');
const outputTop = document.getElementById('outputTop');
const deleteNumber = document.getElementById('backspace');
const operators = document.querySelectorAll('.operator');
const clearAll = document.getElementById('ac');
const equal = document.getElementById('equal');
let input1 = 0;
let input2 = null;
let operator = null;
let result = null;

numbers.forEach(element => element.addEventListener('click', takenumber))

operators.forEach(element => element.addEventListener('click', e => {
    operator = e.target.attributes['data-symbol'].value;
    outputTop.innerText = operator;
    result = null;
}))

deleteNumber.addEventListener('click', () => {
    if (input2 !== null) {
        input2 = +input2.toString().substr(0, input2.toString().length - 1);
        outputBot.innerText = input2;
    }
    else if (operator !== null) {
        operator = null;
        outputTop.innerText = '';
    }
    else {
        if (!result) {
            input1 = +input1.toString().substr(0, input1.toString().length - 1);
            outputBot.innerText = input1;
        }
    }
}
)

clearAll.addEventListener('click', () => {
    input1 = 0;
    input2 = null;
    operator = null;
    result = null;
    outputTop.innerText = '';
    outputBot.innerText = input1;
})

equal.addEventListener('click', operate);

function takenumber(e) {
    if (operator === null) {
        if (input1 === 0 || result) {
            input1 = +e.target.id;
            if (result) {
                outputTop.innerText = '';
                result = null;
            }
        }
        else if (input1.toString().length > 10) {
            return;
        }
        else {
            input1 = +(input1 + e.target.id);
        }
        outputBot.innerText = input1;
    }
    else {
        if (input2 === null) {
            input2 = +e.target.id;
            outputTop.innerText = input1 + ' ' + operator;
        }
        else if (input2 >= 1e10) {
            return;
        }
        else {
            input2 = +(input2 + e.target.id);
        }
        outputBot.innerText = input2;
    }

}

function operate() {
    if (operator === null || input2 === null) {
        return;
    }
    switch (operator) {
        case '/':
            result = input1 /= input2;
            break;
        case '*':
            result = input1 *= input2;
            break;
        case '+':
            result = input1 += input2;
            break;
        case '-':
            result = input1 -= input2;
    }
    outputTop.innerText += ' ' + input2 + ' =';
    if(result.toString().length <= 11 && result !== Infinity){
        if(result <= 1e-7){
            outputBot.innerText = result.toFixed(10);
        }
        else{
            outputBot.innerText = result;
        }
        input1 = result;
    }
    else{
        if (result >= 1e11 || result <= 1e-10){
            outputBot.innerText = result.toExponential(5).toString();
        }

        input1 = 0;
    }
    input2 = null;
    operator = null;
}