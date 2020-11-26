const numbers = document.querySelectorAll('.number');
const output = document.getElementById('outputBottom');
let input = 0;
numbers.forEach(element => element.addEventListener('click', e => {
    if(input === 0){
        input = +e.target.id;
    }
    else if(input >= 1e10){
        return;
    }
    else{
    input = +(input + e.target.id);
    }
    output.innerText = input;
}));
