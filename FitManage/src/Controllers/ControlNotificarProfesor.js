import ReservaClase from "../Models/ReservaClase.js";
import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

class ControlNotificarProfesor {
    constructor() {
        // Crear el cliente con persistencia de sesión
        this.client = new Client({
            authStrategy: new LocalAuth({ clientId: 'notificar-profesor' }) // Identificador único para la sesión
        });

        // Mostrar QR si es necesario
        this.client.on('qr', (qr) => {
            console.log('Escanea este código QR con tu WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        // Confirmar que el cliente está listo
        this.client.on('ready', () => {
            console.log('Cliente de WhatsApp está listo!');
        });

        // Manejo de errores
        this.client.on('auth_failure', (msg) => {
            console.error('Error de autenticación:', msg);
        });

        this.client.initialize(); // Inicializar el cliente
    }

    handleGetBirthdayStudents = (req, res) => {
        ReservaClase.getAlumnosCumple((err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length > 0) {
                return res.render("PantallaSeleccionarReserva", { students:rows, error: "" });
            } else {
                return res.render("administrador", { error: "No se encontraron cumpleañeros" });
            }
        });
    }

    handleEditarMensaje = (req, res) => {
        const { nombre_alumno, nombre_profesor, telefono, disciplina, horario } = req.body;

        // Validación de datos requeridos
        if (!nombre_alumno || !nombre_profesor || !telefono || !disciplina || !horario) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Generar el texto del mensaje
        const text = `Estimado Profesor ${nombre_profesor}, reciba un cordial saludo. Por este medio, me permito informarle que su alumno ${nombre_alumno} está celebrando su cumpleaños el día de hoy. Sería un gesto muy amable de su parte felicitarlo durante su clase de ${disciplina}, programada en el horario ${horario}. Agradezco de antemano su atención y consideración.`;

        return res.render("PantallaNotificarProfesor", {text: text, telefono: telefono});
    }

    handleNotificarProfesor = (req, res) => {
        const {telefono_profesor, message} = req.body;
        // Generar el texto del mensaje
        if(message != ""){
              // Enviar el mensaje por WhatsApp
            this.sendWhatsAppMessage(telefono_profesor, message)
            .then(() => {
                // Confirmar el registro (Redirigir en el futuro)
                return res.status(200).render("administrador", {message: "Mensaje enviado correctamente"});
            })
            .catch((err) => {
                console.error("Error al enviar el mensaje:", err);
                return res.status(500).render("administrador", {message: "No se logro enviar el mensaje"});
            });
        } else {
            return res.status(200).render("administrador", {message: "No puedes enviar un mensaje vacio"});
        }
    };
 //Formatear número de México al formato internacional para WhatsApp
    formatMexicanNumber = (phoneNumber) => {
        // Eliminar cualquier carácter no numérico
        let cleanedNumber = phoneNumber.replace(/\D/g, '');

        // Eliminar prefijos nacionales innecesarios (044, 045, 01)
        if (cleanedNumber.startsWith('044') || cleanedNumber.startsWith('045') || cleanedNumber.startsWith('01')) {
            cleanedNumber = cleanedNumber.slice(3);
        }

        // Asegurar que el número tenga el código de país (+52)
        if (!cleanedNumber.startsWith('521')) {
            cleanedNumber = `521${cleanedNumber}`;
        }

        return `${cleanedNumber}@c.us`;
    };

    // Método para enviar mensajes por WhatsApp
    sendWhatsAppMessage = async (phoneNumber, message) => {
        try {
            // Asegúrate de que el cliente esté listo
            if (!this.client || !this.client.info) {
                throw new Error("El cliente de WhatsApp no está listo.");
            }

            // Formatear el número
            const formattedNumber = this.formatMexicanNumber(phoneNumber);
            // console.log(`Número formateado: ${formattedNumber}`);
            // console.log(`Mensaje: ${message}`);

            // Enviar el mensaje
            await this.client.sendMessage(formattedNumber, message);
            // console.log(`Mensaje enviado a ${formattedNumber}`);
        } catch (err) {
            console.error('Error al enviar el mensaje:', err);
            throw err;
        }
    };
    }

export default new ControlNotificarProfesor();