// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Bear     = require('./MODELS/bear');
var Dog      = require('./MODELS/dog');
var Order    = require('./MODELS/order');
var Cat      = require('./MODELS/cat');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/test')
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router



router.route('/order')

    .post(function(req, res) {
        
        var order = new Order();      
        order.qty = req.body.qty;

        order.name = req.body.name; 

        order.milk = req.body.milk ;
        order.size = req.body.size ; // set the bears name (comes from the request)
              //res.json({message : 'i know nothing'});  
        // save the bear and check for errors
        order.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Order Placed' });
        });

       });

    router.route('/orders')


       .get(function(req, res) {
        Order.find(function(err, order) {
            if (err)
                res.send(err);

            res.json(order);
        });
    });
       
router.route('/order/:order_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Order.findById(req.params.order_id, function(err, order) {
            if (err)
                res.send(err);
            res.json(order);
        });
    })


    .put(function(req, res) {

        // use our bear model to find the bear we want
        Order.findById(req.params.order_id, function(err, order) {

            if (err)
                res.send(err);

            order.name = req.body.name;  // update the bears info

            // save the bear
            order.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Order updated!' });
            });

        });
    })


    .delete(function(req, res) {
        Order.remove({
            _id: req.params.order_id
        }, function(err, order) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);