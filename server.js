// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Order    = require('./MODELS/order');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/test')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});





var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router



router.route('/order')

    .post(function(req, res) {
        
         var order = new Order();
         order.location = req.body.location ;
         order.qty  = req.body.qty;
         order.milk = req.body.milk;
         order.size = req.body.size;
         order.name = req.body.name;

              console.log(req.body);
 
              console.log(order.qty);
              console.log(order.milk);

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