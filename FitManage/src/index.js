import express from 'express'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import indexRouters from './routes/index.js'
import db from './database/conexion.js'
import UsersRoutes from './routes/UsersRoutes.js'

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));


app.set("views", join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(indexRouters);

app.use(express.static(join(__dirname, 'public')));

app.listen(3000);

console.log("Server ", 3000);