import express from 'express'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import indexRouters from './routes/index.js'
import session  from 'express-session'

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'clave_secreta_segura', // Cambia por una clave más robusta
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, 
    })
);

app.set("views", join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(indexRouters);

app.use(express.static(join(__dirname, 'public')));

app.listen(3000);

console.log("Server ", 3000);