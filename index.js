const express = require('express')
const app = express()
const port = 3600
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.set('view engine','ejs')
app.set('views','./views')


app.get('/',function(req,res){
    res.render('board',{title:'계산기'})
})

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());


var cal = require('./calculator');

app.post('/',function(req,res){

    // console.log('function(req):',req)
    if (req.body.operator == '+') {
        console.log('sum :', cal.sum(req))
    } else if (req.body.operator == '-') {
        console.log('sub :', cal.sub(req))
    } else if (req.body.operator == '/') {
        console.log('div :', cal.div(req))
    } else if (req.body.operator == '*') {
        console.log('mul :', cal.mul(req))
    } else {
        console.error();
    }

    // console.log('sum: ' ,cal.sum(req))
    // console.log('type:', typeof req.body.number1)
    res.redirect("/")
});

