import usersModel from '../Models/usersModel.js'
class ControlLogin{
    constructor(){}
    handleLogin = (req, res) => {
        const { email, password } = req.body;
        // Validar la entrada de datos
        if (!email || !password) {
            return res.status(400).json({ error: "El correo y la contraseña son requeridos." });
        }

        usersModel.buscarEmail(email, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
    
            if (rows.length > 0) {
                const user = rows[0];
    
                // Guardar datos del usuario en la sesión
                req.session.user = {
                    email: user.email,
                    type_user: user.type_user,
                    name: user.name,
                };
                
            // Redireccionar al cliente a la interfaz correspondiente
            const redirectPath = this.getInterface(user.type_user);
            return res.redirect(redirectPath); 
            } else {
                return res.status(404).json({ error: "Usuario no encontrado." });
            }
        });
    };
    // Para obtener la ruta de interfaz segun el tipo de usuario
    getInterface = (typeUser) => {
        switch (typeUser) {
            case 'administrador':
                return '/administrador';
            case 'alumno':
                return '/alumno';
            case 'profesor':
                return '/profesor';
            default:
                return '/login'; // Ruta para roles desconocidos
        }
    };
}

export default new ControlLogin();