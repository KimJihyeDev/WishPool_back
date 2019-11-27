const SocketIO = require('socket.io');

//함수형 모듈
module.exports = (server) =>{
    const io = SocketIO(server, {path:'/socket.io'});

    io.on('connection', (socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect', ()=>{
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error)=>{
            console.error(error);
        });
        socket.on('reply', (data)=>{ //on: reply란 이름의 통신을 대기중이다
            console.log(data);
            // if(data){
            //     data = false;
            // }else{
            //     data = true;
            // }
            // socket.emit('news', data);
            socket.interval = setInterval(()=>{
                if(data){
                    data = false;
                }else{
                    data = true;
                }
                socket.emit('news', data);
                // socket.emit('news', 'Hello Socket.IO'); //emit: news란 이름의 통신으로 보낸다. 클라이언트로 내보낼 메시지:Hello Socket.IO
            },3000);
        });
        
    })
}