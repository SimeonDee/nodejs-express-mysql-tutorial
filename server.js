require('dotenv').config()

const express = require('express')
const ejs = require('ejs')
const cors = require('cors')
const path = require('path')

const { json, urlencoded } = require('express')
const PORT = process.env.PORT || 4000
let db_conn 

const app = express()

//Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    try {
        db_conn.query(`SELECT * FROM products`, (err, result) => {
            if(err) throw err
            if(result.length > 0){
                data = {
                    status: 'success', 
                    message: 'Records fetched', 
                    data: result
                }

            } else {
                data = {
                    status: 'failure', 
                    message: 'No records saved yet'
                }
            }
            
            res.render('index', { data: data })
        })

    } catch (error) {
        data = {
            status: 'error', 
            message: `Server Error. Please try again later or mail us at "mailer@mailserver.com" ${error.message}`
        }

        res.render('index', { data: data })
    }
})

app.get('/create', (req, res) => {
    res.render('create-product')
})

// Return Product creation form
app.post('/processform', (req, res) => {
    try {
        const sql = 'INSERT INTO products(name, description, price) VALUES ?'
        const data = [`'${req.body.prod_name}'`, `'${req.body.prod_descr}'`, `'${req.body.prod_price}'`]
         
        db_conn.query(sql, [data], (err, result) => {
            if(err) throw err
            if(result){
                res.redirect('/')

            } else {
                data = {
                    status: 'failure', 
                    message: 'No records saved yet'
                }

                res.render('create-product', { data: data })
            }
        })

    } catch (error) {
        data = {
            status: 'error', 
            message: `Server Error. Please try again later or mail us at "mailer@mailserver.com" ${error.message}`
        }

        res.render('create-product', { data: data })
    }
})


app.get('/edit/:id', (req, res) => {
    const id = Number.parseInt(req.params.id)
    try {
        db_conn.query(`SELECT * FROM products WHERE id='${id}'`, (err, result) => {
            if(err) throw err
            if(result){
                data = {
                    status: 'success', 
                    message: 'Records fetched', 
                    data: result
                }

            } else {
                data = {
                    status: 'failure', 
                    message: 'Record not found'
                }
            }
            
            res.render('edit-product', { data: data })
        })

    } catch (error) {
        data = {
            status: 'error', 
            message: `Server Error. Please try again later or mail us at "mailer@mailserver.com" ${error.message}`
        }

        res.render('edit-product', { data: data })
    }

})


app.listen(PORT, async ()=> {
    console.log(`Server live on port ${PORT}...`)
    if(!db_conn) db_conn = await require('./db_conn').connectDB()
})