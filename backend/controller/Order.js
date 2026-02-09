const { Order } = require("../model/Order");

exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
        const doc = await order.save();
        res.status(201).json(doc);
    }
    catch (err) {
        res.status(400).json(err);

    }
};
exports.fetchOrderByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const orderItem = await Order.find({ user: userId });
        
    //   const result = await orderItem.populate('product');    
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(400).json(error);
    }
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await Order.findByIdAndDelete(id);
       
        res.status(201).json({ message: "successfully deleted" });
 
    }
    catch (err) {
        res.status(400).json(err);

    }
};
 
exports.editOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  exports.fetchOrderById = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

exports.fetchAllOrder = async (req, res) => { 
    // sort={_sort:"price",_order="desc"}
    // const pagination = { _page: page, _limit: ITEMS_PER_PAGE }
    let query = Order.find({});
    let totalCountOrder = Order.find({});
    
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order })
    }
    const totalCount = await totalCountOrder.count().exec();

    if (req.query._page && req.query._limit) {
        const page = req.query._page
        const limit = req.query._limit
        query = query.skip(limit * (page - 1)).limit(limit)
    }
    try {
        const doc = await query.exec();
        res.set('X-Total-Count', totalCount)
        res.status(201).json(doc);
    }
    catch (err) {
        res.status(400).json(err);
    }
};