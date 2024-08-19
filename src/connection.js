import express from 'express'
import {Server} from 'socket.io'

const app = express()

app.get('/', (req, res)=>[
    res.send("Hola")
])

const httpServer = app.listen(8080, ()=>console.log("Servidor en el puerto 8080"))

export const socketServer = new Server(httpServer, { cors: { origin: '*' } })
