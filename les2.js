// console.log('Record 1');

// setTimeout(() => {
//   console.log('Record 2');
//   Promise.resolve().then(() => {
//     setTimeout(() => {
//     console.log('Record 3');
//     Promise.resolve().then(() => {
//       console.log('Record 4');
//       });       
//     });
//   });       
// });

// console.log('Record 5');

// Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));
// //156234

// Напишите программу, которая будет принимать на вход несколько 
// аргументов: дату и время в формате «час-день-месяц-год». 
// Задача программы — создавать для каждого аргумента таймер 
// с обратным отсчётом: посекундный вывод в терминал состояния 
// таймеров (сколько осталось). По истечении какого-либо таймера, 
// вместо сообщения о том, сколько осталось, требуется показать 
// сообщение о завершении его работы. Важно, чтобы работа 
// программы основывалась на событиях.

const { intervalToDuration,  compareDesc, addSeconds } = require('date-fns')
const EventEmitter = require('events')
const emitter = new EventEmitter

const inputDate = process.argv[2].split('-')
const startDate = new Date()

const endDate = new Date(+inputDate[3], +inputDate[2]-1, +inputDate[1], +inputDate[0])

let seconds = 0

const timer = () => {
    const start = addSeconds(startDate, seconds)
    if (compareDesc(start, endDate) === 0 || compareDesc(start, endDate) === -1) {
        console.log("время вышло")
        return
    } else {
        console.log(intervalToDuration({start: start , end: endDate}))
        setTimeout(() => {
            seconds++
            emitter.emit('tic')
        }, 1000)
    }
}
emitter.on('tic', timer)
timer()