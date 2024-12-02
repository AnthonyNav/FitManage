import db from "../database/conexion.js"; // Importa tu conexión a la base de datos

class Disciplinas {
    static obtenerDisciplinas() {
        return new Promise((resolve, reject) => {
            const query = "SELECT id_disciplina, nombre FROM disciplinas";
            db.query(query, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    static obtenerNombresDisciplinas() {
        return new Promise((resolve, reject) => {
            const query = "SELECT nombre FROM disciplinas";
            db.query(query, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const nombres = rows.map(row => row.nombre); // Extraemos solo los nombres
                resolve(nombres);
            });
        });
    }
}

export default Disciplinas;
