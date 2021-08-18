const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const conn = mysql.createConnection({
     host : conf.host,
     user : conf.user,
     password : conf.password,
     port : conf.port,
     database : conf.database
});

conn.connect();

const multer = require('multer');
const upload = multer({ dest : './upload'})


app.get('/api/customers', (rep, res) => {
    conn.query(
        "SELECT * FROM CUSTOMER",
        (err, rows, field) => {
            res.send(rows);

        }
    )
})

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req,res) => {

    let sql = 'INSERT INTO CUSTOMER VALUES(NULL, ?,?,?,?,?)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    conn.query(sql, params, 
        (err, rows, fields) => {
            res.send(rows);
            console.log(err);
        })
});


app.get('/api/hello', (req, res) => {
    res.send({ message: 'Hello Express!' });
})

app.listen(port, () => console.log(`Listening on port  ${port}`));