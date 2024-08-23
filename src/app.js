import {socketServer} from "./connection.js";
import GameController from './Controllers/gameController.js'
import SocketServerController from "./Controllers/socketServerController.js";

let gameController = new GameController
let socketServerController =  new SocketServerController

let N_jugador = 1;
let N_espera = 1;

//si la tabla fuera un array de 3 array (filas y columnas) seria mucho mas facil hacer la validacion de los casos de victoria, lo se (ahora), perdon xd
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

socketServer.on('connection', (socket) => {

    //Creo nuevo cliente y lo push al array datos: id del socket, rol (jugador o esperando), numero relaciondado a su rol

    console.log("Nuevo cliente");

    let nuevo_cliente = gameController.crearCliente(socket.id, N_jugador, N_espera);
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
    socket.on('inicio', (data) => socketServerController.inicio(data))
    
    socket.on('position', (index) => socketServerController.position(index, socket, clientes, tabla, casosVictoria, socketServer))

    socket.on('reseteo', (datas) => socketServerController.reseteo(datas))
    
})