// По ссылке вы найдете файл с логами запросов 
// к серверу весом более 2 Гб. Напишите программу, 
// которая находит в этом файле все записи с ip-адресами 
// 89.123.1.41 и 34.48.240.111, а также сохраняет их в 
// отдельные файлы с названием “%ip-адрес%_requests.log”.

const fs = require('fs')
const readline = require('readline')
const ACCESS_LOG = './access.log'

const ip1 = '89.123.1.41'
const ip2 = '34.48.240.111'

const rd = readline.createInterface({
    input: fs.createReadStream(ACCESS_LOG),
    console: false
})

rd.on('line', (str) => {
    if (str.indexOf(ip1) != -1) {
        fs.appendFile(`./${ip1}_requests.log`, `${str}\n`, {encoding: 'utf-8'}, (err) => {
            if (err) {
                console.log(err)
            }
        })

    } else if (str.indexOf(ip2) != -1){
        fs.appendFile(`./${ip2}_requests.log`, `${str}\n`, {encoding: 'utf-8'}, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

})
