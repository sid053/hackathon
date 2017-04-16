
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OrderSchema   = new Schema({

    location: String,
    qty: Number,
    name: String,
    milk: String,
    size: String 

});

module.exports = mongoose.model('Order', OrderSchema);
