class GameController {
    crearCliente(id, N_jugador, N_espera) {
        let cliente_a_devolver = {}
        cliente_a_devolver.id = id
        cliente_a_devolver.rol = N_jugador <= 2 ? "Jugador" : "Esperando";
        cliente_a_devolver.n = N_jugador > 2 ? N_espera : N_jugador;

        return cliente_a_devolver
    }

    validarEstado(valor, tabla, casosVictoria) {
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

    tablaEstaLlena(tabla) {
        for (let i = 0; i < tabla.length; i++) {
            if(tabla[i] == "") return false
        }
        return true
    }
}

export default GameController