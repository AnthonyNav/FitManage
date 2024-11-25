var Username;
var Password;

const handleLogin = (req, res) => {
    const { username, password } = req.body;

    Username = username;
    Password = password;

    console.log(Username);
    console.log(Password);

    res.send('Datos guardados correctamente');
};

export default handleLogin;