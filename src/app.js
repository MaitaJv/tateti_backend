import express from 'express'
import {Server} from 'socket.io'

const app = express()

app.get('/', (req, res)=>[
    res.send("Hola")
])

const httpServer = app.listen(8080, ()=>console.log("Servidor en el puerto 8080"))

const socketServer = new Server(httpServer, { cors: { origin: '*' } })

let jugadores = 0
socketServer.on('connection', (socket) => {

    jugadores++

    console.log("Nuevo cliente");

    socket.on('inicio', (data)=>{
        console.log(data); //llegue
    });

    if(jugadores > 2)       socket.emit('N_jugador', -1)
    if(!(jugadores > 2))    socket.emit('N_jugador', jugadores)
    
    
    socket.on('position', (index) =>{
        console.log(index)
    })
    
})