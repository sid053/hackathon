// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Order    = require('./MODELS/order');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://54.183.242.172/test')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

 res.setHeader('Cache-Control', 'no-cache');
 next();
});

var STATUS = "";




var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//var order_id;

router.route('/order')

    .post(function(req, res) {
        
         var order = new Order();
         order.location = req.body.location ;
         order.qty  = req.body.qty;
         order.milk = req.body.milk;
         order.size = req.body.size;
         order.name = req.body.name;


          order.save(function(err) {
            //order_id =order.id ;
            if (err){
                STATUS = "Unsuccessful";
                res.send(err);
            }
            
            STATUS = "Successful" ;
            res.status(200).send(order.id);
        
             
    });
       //   console.log(order_id);

       });

    router.route('/orders')


       .get(function(req, res) {
        Order.find(function(err, order) {
            if (err)
                res.status(404).send({message : 'There are no orders'});

            res.status(200).json(order);
        });
    });
       
router.route('/order/:order_id')
    .get(function(req, res) {
        Order.findById(req.params.order_id, function(err, order) {
            if (err)
                res.status(404).send({message : 'Order not found'});
            res.status(200).json(order);
        });
    })


    .put(function(req, res) {

        Order.findById(req.params.order_id, function(err, order) {

            if (err)
                res.send({message : 'Cannot update the order'});
         
           order.location = req.body.location ;
           order.qty  = req.body.qty;
           order.milk = req.body.milk;
           order.size = req.body.size;
           order.name = req.body.name;

        
            order.save(function(err) {
                if (err)
                    res.send(err);

                res.status(200).json({ message: 'Order updated!' });
            });

        });
    })


    .delete(function(req, res) {
        Order.remove({
            _id: req.params.order_id
        }, function(err, order) {
            if (err)
                res.send({message : 'cannot delete the order'});

            res.json({ message: 'Successfully deleted' });
        });
    });





// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api/sanJose', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);