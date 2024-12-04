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


