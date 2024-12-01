import db from '../database/conexion.js';

class Paquetes {
    getPaquetes(callback) {
        const query = "SELECT * FROM paquetes";
        db.query(query, (err, rows) => {
            if (err) {
                console.error("Error al obtener los paquetes:", err);
                return callback(err, null);
            }
            return callback(null, rows);
        });
    }
    
    getPaquetesById(id_paquete, callback) {
        const query = `SELECT * FROM paquetes WHERE id_paquete = ?`;
        db.query(query, [id_paquete], (err, rows) => {
            if (err) {
                console.error("Error al obtener los paquetes:", err);
                return callback(err, null);
            }
            return callback(null, rows);
        });
    }
    
}

export default new Paquetes();