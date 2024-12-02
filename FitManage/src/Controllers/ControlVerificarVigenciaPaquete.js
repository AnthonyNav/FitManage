import Alumno from '../Models/Alumno.js'

class ControlVerificarVigenciaPaquete {
    
    handleObtenerVigencia = (req, res) => {
        Alumno.getPaqueteVigenteByEmail(req.session.user.email, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            //console.log(rows);
            if (rows != null) {
                const formatFecha = (date) => date.toISOString().split('T')[0];
                rows.fecha_inicio = formatFecha(rows.fecha_inicio);
                rows.fecha_fin = formatFecha(rows.fecha_fin);
                return res.render("PantallaVerificarPaquete",  { student: rows, error : ""})
            } else {
                return res.status(200).render("alumno", {message: "No tienes paquete vigente"});
            }
        });
    }
}

export default new ControlVerificarVigenciaPaquete();