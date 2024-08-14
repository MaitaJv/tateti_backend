import express from 'express'
import {Server} from 'socket.io'

const app = express()

app.get('/', (req, res)=>[
    res.send("Hola")
])

const httpServer = app.listen(8080, ()=>console.log("Servidor en el puerto 8080"))

const socketServer = new Server(httpServer, { cors: { origin: '*' } })

let N_jugador = 1;
let N_espera = 1;

//si la tabla fuera un array de 3 array (filas y columnas) seria mucho mas facil hacer la validacion de los casos de victoria
let tabla =    ["","","",
                "","","",
                "","",""]
let casosVictoria =   [[0,1,2],
                       [3,4,5],
                       [6,7,8],
                       [0,3,6],
                       [1,4,7],
                       [2,5,8],
                       [0,4,8],
                       [2,4,6]]

let clientes = []

function crearCliente(id, N_jugador, N_espera) {
    let cliente_a_devolver = {}
    cliente_a_devolver.id = id
    cliente_a_devolver.rol = N_jugador <= 2 ? "Jugador" : "Esperando";
    cliente_a_devolver.n = N_jugador > 2 ? N_espera : N_jugador;

    return cliente_a_devolver
}

function validarEstado(valor) {
    //debido a que es de noche y mis neuronas estan apagadas voy a hacerlo de una pa probar
    let contadorEstado = 0;

    for (let i = 0; i < casosVictoria.length; i++) {

        for (let j = 0; j < 3; j++) {

            if(tabla[casosVictoria[i][j]] == valor){
                console.log("i: " + i + " j: " + j)
                console.log("casosVictoria[i][j]: ", casosVictoria[i][j]);
                console.log("tabla[casosVictoria[i][j]]: ", tabla[casosVictoria[i][j]]);
                
                contadorEstado++
            }else{
                contadorEstado = 0
                break
            }

            if(contadorEstado == 3) return casosVictoria[i]
        }

    }
    return null
}

socketServer.on('connection', (socket) => {

    //Creo nuevo cliente y lo push al array datos: id del socket, rol (jugador o esperando), numero relaciondado a su rol

    console.log("Nuevo cliente");

    let nuevo_cliente = new crearCliente(socket.id, N_jugador, N_espera);
    clientes.push(nuevo_cliente);

    console.log("arrCliente:", clientes);

    if(N_jugador  > 2){
        socket.emit('N_jugador', -1);
        console.log("N_espera++;")
        N_espera++;
    }
    if(N_jugador <= 2){
        socket.emit('N_jugador', N_jugador);
        console.log("N_jugador++;")
        N_jugador++;
    }

    //recibo mensaje de prueba inicial (handshake)
    socket.on('inicio', (data)=>{
        console.log(data); //llegue
    });    
    
    socket.on('position', (index) =>{
        //consigo cliente asociado al socket.id
        let cliente = clientes.find((cli)=> cli.id == socket.id);
        console.log("cliente:", cliente);
        //me guardo en el array de posiciones el cliente que lo ocupo
        console.log(index);

        //envio a todos los clientes, exceptuando al remitente original, el nuevo dato cargado en la tabla del juego
        let posGanadoras
        if(cliente.n === 1) {
            tabla[index] = "X";
            posGanadoras = validarEstado("X") //valido estado de victoria
        }

        if(cliente.n === 2) {
            tabla[index] = "O";
            posGanadoras = validarEstado("O") //valido estado de victoria
        }

        console.log("posGanadoras: ", posGanadoras);

        console.log("tabla: ", tabla);

        let paquete = {
            tabla: tabla,
            posGanadora: posGanadoras
        }
        console.log("paquete: ", paquete);
        

        socketServer.emit("actualizacion", tabla);
        
    })

    socket.on('reseteo', (datas) =>{
        console.log("El jugador " + datas + " reseteo el juego")

        //setear posiciones en 0

        tabla = ["","","","","","","","",""]

        console.log("tabla: ", tabla);

        socketServer.emit("actualizacion", tabla);

        //actualizar a todos los conectados
        
        //Seleccionar 2 nuevos jugadores
    })
    
})