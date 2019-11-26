const express = require('express')
const mysql = require('mysql')
const upload = require('express-fileupload')
const csvtojson = require('csvtojson')

const app = express()

app.use(upload())

const connect = mysql.createConnection({
    host: "112.137.129.214",
    user: "a16021090",
    password: "123456",
    database: "a16021090"
})

connect.connect(err => {
    if(err) throw err
    console.log("Conected to DB!")
})

const port = 8080

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/upload', (req, res) => {
    let csvData = req.files.file.data.toString('utf8')
    return csvtojson().fromString(csvData).then(data => {
        console.log(data)
        let value = ""
        for(let i = 0; i < data.length; i++) {
            value += `("${data[i].username}", ${parseInt(data[i].age)}, "${data[i].email}")`
            if(i !== data.length - 1) {
                value += ","
            }
        }
        let sql = `INSERT INTO user (username, age, email) VALUES ${value};`
        connect.query(sql, (err, result) => {
            if(err) {
                res.send("Has problem with query " + sql)
                return
            }
            res.send("Done~")
        })
    })
})

app.listen(port, () => {
    console.log(`server running at port ${port}`)
})
