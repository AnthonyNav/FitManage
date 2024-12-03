import Alumno from '../Models/Alumno.js';
import Paquetes_Adquiridos from '../Models/Paquetes_Adquiridos.js';

class ControlGraficasDeAlumnos {
    constructor() {}

    renderGraficoDefault(req, res) {
        const filter = 'age'; // Filtro predeterminado
        this.obtenerDatosPorFiltro(filter, (err, data) => {
            if (err) {
                return res.status(500).render('PantallaGraficasDeAlumnos', { error: 'Error al cargar datos', chartData: {}, selectedFilter: filter });
            }
            res.render('PantallaGraficasDeAlumnos', { error: null, chartData: data, selectedFilter: filter });
        });
    }

    obtenerDatos(req, res) {
        const { filter } = req.body;
        this.obtenerDatosPorFiltro(filter, (err, data) => {
            if (err) {
                return res.status(400).json({ error: 'Error al cargar datos' });
            }
            res.render('PantallaGraficasDeAlumnos', { error: null, chartData: data, selectedFilter: filter });
        });
    }

    obtenerDatosPorFiltro(filter, callback) {
        let queryMethod = '';
        let type = 'bar';
        let label = '';
        

        switch (filter) {
            case 'age':
                queryMethod = 'getAlumnosAgrupadosPorEdad';
                label = 'Número de Alumnos por Edad';
                break;
            case 'type':
                queryMethod = 'getAlumnosAgrupadosPorTipo';
                label = 'Distribución por Tipo de Alumnos';
                type = 'pie';
                break;
            case 'package':
                queryMethod = 'getTotalPaquetesAdquiridosDeAlumnos';
                label = 'Distribución de paquetes mas adquiridos por Alumnos';
                type = 'pie';
                break;
            default:
                return callback(new Error('Filtro inválido'), null);
        }

        Alumno[queryMethod]((err, rows) => {
            if (err) {
                return callback(err, null);
            }
            const labels = rows.map(row => row.label);
            const values = rows.map(row => row.total);
            const data = {
                type,
                labels,
                values,
                label,
                colors: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
            };
            callback(null, data);
        });
    }
}

export default new ControlGraficasDeAlumnos();



// import Alumno from '../Models/Alumno.js'

// class ControlGraficasDeAlumnos {

//     constructor(){

//     }

//     renderGraficoDefault(req, res) {
//         const label = 'Número de Alumnos por Edad';
        
//         Alumno.getAlumnosAgrupadosPorEdad((err, rows) => {
//             if (err) {
//                 return res.status(400).resend({error: err});
//             }
//             const labels = rows.map(row => row.edad || row.tipo || row.padecimiento || row.paquete);
//             const values = rows.map(row => row.total);
//             const data ={
//                 type,
//                 labels,
//                 values,
//                 label,
//                 colors: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`) // Colores aleatorios
//             }
//             return res.status(200).render("PantallaGraficasDeAlumnos", data);
//         });
//     }

//     obtenerDatos(req, res) {
//         try {
//             const { filter } = req.query;

//             let query = '';
//             let type = 'bar';
//             let label = '';
//             switch (filter) {
//                 case 'age':
//                     label = 'Número de Alumnos por Edad';
//                     // query = 'SELECT edad, COUNT(*) as total FROM alumnos GROUP BY edad';
//                     Alumno.getAlumnosAgrupadosPorEdad((err, rows) => {
//                         const labels = rows.map(row => row.edad || row.tipo || row.padecimiento || row.paquete);
//                         const values = rows.map(row => row.total);
//                         res.json({
//                             type,
//                             labels,
//                             values,
//                             label,
//                             colors: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`) // Colores aleatorios
//                         });
//                     });
                    
//                     break;
//                 case 'type':
//                     query = 'SELECT tipo, COUNT(*) as total FROM alumnos GROUP BY tipo';
//                     label = 'Distribución por Tipo de Alumnos';
//                     type = 'pie';
//                     break;
//                 case 'medical':
//                     query = 'SELECT padecimiento, COUNT(*) as total FROM alumnos WHERE padecimiento IS NOT NULL GROUP BY padecimiento';
//                     label = 'Distribución por Padecimientos Médicos';
//                     type = 'pie';
//                     break;
//                 case 'package':
//                     query = 'SELECT paquete, COUNT(*) as total FROM alumnos GROUP BY paquete';
//                     label = 'Paquetes Más Populares';
//                     break;
//                 default:
//                     return res.status(400).json({ error: 'Filtro inválido' });
//             }

//             const labels = rows.map(row => row.edad || row.tipo || row.padecimiento || row.paquete);
//             const values = rows.map(row => row.total);

//             res.json({
//                 type,
//                 labels,
//                 values,
//                 label,
//                 colors: labels.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`) // Colores aleatorios
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: 'Error al generar la gráfica' });
//         }
//     }

// }

// export default new ControlGraficasDeAlumnos();