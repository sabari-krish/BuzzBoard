const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    item_name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    order_date: {
        type: Date,
        require: true
    },
    delivery_date: {
        type: Date,
        require: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('order', orderSchema);
