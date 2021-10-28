const socket = require('socket.io')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
          
      const filePath = path.join(__dirname, 'index.html');
  
      readStream = fs.createReadStream(filePath);
  
      readStream.pipe(response);
    } else if (request.method === 'POST') {
      let data = '';
  
      request.on('data', chunk => {
      data += chunk;
      });
  
      request.on('end', () => {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
  
        response.writeHead(200, { 'Content-Type': 'json'});
        response.end(data);
      });
    } else {
        response.statusCode = 405;
        response.end();
    }
  });

const io = socket(app);

let countUsers = 0

io.on('connection', client => {
  countUsers++
  const id = 'user' + Math.floor(Math.random()*100)
  
  client.broadcast.emit('SERVER_MSG', { msg: `The ${id} connected`, userCount: countUsers  });
  client.emit('SERVER_MSG', { msg: `The ${id} connected`, userCount: countUsers  });

  client.on('CLIENT_MSG', (data) => {
    client.broadcast.emit('SERVER_MSG', { msg: id + ': ' + data.msg, userCount: countUsers  });
    client.emit('SERVER_MSG', { msg: id + ': ' + data.msg, userCount: countUsers });
  });

  
  client.on('disconnect', () => {
    countUsers--
    client.broadcast.emit('SERVER_MSG', { msg: id + 'disconnected', userCount: countUsers});
    client.emit('SERVER_MSG', { msg: id + 'disconnected', userCount: countUsers});
    client.emit('CHANGED_NUM_USERS', {msg: countUsers})
  })
});


app.listen(3001, 'localhost');