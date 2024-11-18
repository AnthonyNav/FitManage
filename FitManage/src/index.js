import express from 'express'

const app = express();

app.get('/', (req, res) => res.send("Hello cat"));

app.listen(3000);

console.log("Server ", 3000);