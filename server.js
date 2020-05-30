const express = require('express')
const app = express()
const hbs = require('hbs')
const session = require('express-session')
const apiRoute = require('./routes/apiRoute')
const methodOverride = require('method-override')
const port = process.env.PORT || 1234
const path = require('path')
require('./db')
app.use(express.urlencoded({extended:false}))
app.use(session({
    name:'Company',
    secret: 'anurag',
    resave: false,
    saveUninitialized: true,
    cookie: 
    { 
    maxAge: 1000*60*60*24
    }
  }
  ))
app.use(methodOverride('_method'))
app.use(apiRoute)
app.set('view engine','hbs')
app.set('view options','layout')
app.set("views", path.join(__dirname, "views", "pages"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));


app.listen(port,()=>{
    console.log('Server started')
})