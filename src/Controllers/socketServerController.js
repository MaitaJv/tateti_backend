import GameController from './gameController.js'

let gameController = new GameController

class SocketServerController {
    inicio(data){
        console.log("Inicio: ", data); //llegue
    }

    position(index, socket, clientes, tabla, casosVictoria, socketServer){

        //console.log("SocketServerController - index: ", index);
        //console.log("SocketServerController - socket: ", socket);
        //console.log("SocketServerController - clientes: ", clientes);
        
        //consigo cliente asociado al socket.id
        let cliente = clientes.find((cli)=> cli.id == socket.id);
        console.log("cliente:", cliente);
        //me guardo en el array de posiciones el cliente que lo ocupo
        console.log(index);

        //envio a todos los clientes, exceptuando al remitente original, el nuevo dato cargado en la tabla del juego
        let posGanadoras
        if(cliente.n === 1) {
            tabla[index] = "X";
            posGanadoras = gameController.validarEstado("X", tabla, casosVictoria) //valido estado de victoria
        }

        if(cliente.n === 2) {
            tabla[index] = "O";
            posGanadoras = gameController.validarEstado("O", tabla, casosVictoria) //valido estado de victoria
        }

        
        console.log("tabla: ", tabla);
        
        if(posGanadoras != null || gameController.tablaEstaLlena(tabla)){
            console.log("posGanadoras: ", posGanadoras);
            
            let paquete = {
                tabla: tabla,
                posGanadora: posGanadoras,
                ganador: cliente.n
            }
            console.log("paquete: ", paquete);

            socketServer.emit("fin", paquete);

            return
        }

        socketServer.emit("actualizacion", tabla);
        
    }

    reseteo(datas){
        console.log("El jugador " + datas + " reseteo el juego")

        //setear posiciones en 0

        tabla = ["","","","","","","","",""]

        console.log("tabla: ", tabla);

        socketServer.emit("actualizacion", tabla);

        //actualizar a todos los conectados
        
        //Seleccionar 2 nuevos jugadores
    }
}

export default SocketServerController