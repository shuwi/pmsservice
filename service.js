var net = require('net');
var iconv = require("iconv-lite");
var HOST = '192.168.20.216';
var PORT = 9920;
let interfaces = require('os').networkInterfaces();
for (var devName in interfaces) {
  var iface = interfaces[devName];
  for (var i = 0; i < iface.length; i++) {
    let alias = iface[i];
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      HOST = alias.address;
    }
  }
}
net.createServer((sock) => {
  let body = [];
  sock.on('data', function (chunk) {
    body.push(chunk);
  });
  sock.on('end', function () {
    body = Buffer.concat(body).toString();
    // 回发数据，客户端将收到来自服务端的数据
    if (body.indexOf('PostRecord') === 0) {
      sock.write('Return(result="success" postphoto="true")')
    }
    if (body.indexOf('Record') === 0) {
      console.log('DATA ' + sock.remoteAddress + ': ' + iconv.decode(body, 'GB2312'));
      sock.write('Return(result="success")')
    }
    if (body.indexOf('Quit') === 0) {
      sock.write('Return(result="success")')
    }
  });

}).listen(PORT, HOST);
console.log('Server listening on ' + HOST + ':' + PORT);