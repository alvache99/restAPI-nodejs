let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3001;

let pool = new pg.Pool({
    port:5432,
    password:'root',
    database: 'postgres',
    user:'alvache',
    host:'localhost'
});



let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev'));
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/api/new-product', function(request,response){
    var product_name = request.body.product_name;
    var product_type = request.body.product_type;
    var id = Math.floor(Math.random() * 999);
    var quantity =  parseInt(request.body.product_quantity);
    var price = parseInt(request.body.product_price);
    pool.connect((err,db,done) =>{
        if(err){
            console.log('connectionfailed');
            console.log(err);
        }else{
            console.log('connection completed');
        
            db.query('INSERT into product (product_id, product_type, quantity, product_name, price) VALUES ($1, $2, $3, $4, $5)',[id,product_type,quantity,product_name,price],(err,table) => {
                if(err){
                    return console.log(err);
                }else{
                    console.log('success');
                    db.end();
                    response.status(201).send('Data Inserted!');
                }
            })
        }
        
        
        })

})

  app.listen(PORT,()=>console.log('listening on PORT' + PORT));

