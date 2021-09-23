const colors = require('colors')
const a = +process.argv[2]
const b = +process.argv[3]

if (!Number.isInteger(a) || !Number.isInteger(b)) {
    console.log(colors.red('Аргумент не считается числом!'))
    return
}

let numberColor = 0
let count = 0
for(let i = a; i <= b; i++) {
    if ((i === 1 || i === 2 || i === 3 || i === 5 || i === 7)
    || (i % 2 != 0 && i % 3 != 0 && i % 5 != 0 && i % 7 != 0)) 
    {
        count++
        switch(numberColor){
            case 0: console.log(colors.green(i))
            break
            case 1: console.log(colors.yellow(i))
            break
            case 2: console.log(colors.red(i))
            break
            
        }
        numberColor++
    }
    numberColor = numberColor === 3 ? 0 : numberColor
}

if (count === 0 ) {
    console.log(colors.red('В указанном диапазоне нет простых чисел'))
}