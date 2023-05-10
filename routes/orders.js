const express = require('express');
const moment = require('moment')
const router = express.Router();
const orderSchema = require('../models/order');
const order = require('../models/order');

router.post('/create', async (req, res, next) => {
  try {
    const { order_id, item_name, cost, order_date, delivery_date } = req.body;
    if(!order_id || !item_name || !cost || !order_date || !delivery_date) throw new Error('please provide valid data')
    const check = await orderSchema.findOne({ order_id })
    if(!check) {
        const orderDate = moment(order_date, 'YYYY-MM-DD')
        const deliveryDate = moment(delivery_date, 'YYYY-MM-DD')
        const order = new orderSchema({ order_id, item_name, cost, order_date: orderDate, delivery_date: deliveryDate });
        await order.save();
    } else {
        throw new Error('order already exists')
    }
    res.json({ message: 'order created successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/update', async (req, res, next) => {
  try {
    const { order_id, delivery_date } = req.body;
    if(!order_id || !delivery_date) throw new Error('please provide valid data')
    const check = await orderSchema.findOne({ order_id })
    if(check) {
        const deliveryDate = moment(delivery_date, 'YYYY-MM-DD')
        await orderSchema.updateOne({ order_id }, { $set: { delivery_date: deliveryDate } })
    } else {
        throw new Error('order not available')
    }
    res.json({ message: 'order delivery date updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/list/:delivery_date', async (req, res, next) => {
  try {
    const { delivery_date } = req.params;
    if(!delivery_date || !(/\d{4}-\d{1,2}-\d{1,2}/).test(delivery_date)) throw new Error('please provide valid data')
    const deliveryDate = moment(delivery_date, 'YYYY-MM-DD')
    const orders = await order.find({ delivery_date: deliveryDate });
    if(orders && orders.length === 0) {
        res.json({ message: `order not available in ${delivery_date}` })
    } else {
        res.json(orders);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/search/:order_id', async (req, res, next) => {
    try {
      const { order_id } = req.params;
      if(!order_id) throw new Error('please provide valid data')
      const orders = await order.findOne({ order_id });
      if(!orders) {
          res.json({ message: `order not available` })
      } else {
          res.json(orders);
      }
    } catch (error) {
      next(error);
    }
  });

router.delete('/delete/:order_id', async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const orders = await order.findOne({ order_id });
    if (!orders) throw new Error('order not found');
    await orders.remove();
    res.json({ message: 'order deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;