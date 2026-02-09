const { Product } = require("../model/Product");


exports.createProduct = async (req, res) => {
    const product = new Product(req.body)

    try {
        const doc = await product.save();
        res.status(201).json(doc);
    }
    catch (err) {
        res.status(400).json(err);

    }
};

exports.fetchAllProduct = async (req, res) => {
    // filter ={"category":["smartphones","laptops"]}
    // sort={_sort:"price",_order="desc"}
    // const pagination = { _page: page, _limit: ITEMS_PER_PAGE }
    let query = Product.find({});
    let totalCountProduct = Product.find({});

    if (req.query.category) {
        query = query.find({ category: req.query.category })
        totalCountProduct = totalCountProduct.find({ category: req.query.category })
    }
    if (req.query.brand) {
        query = query.find({ brand: req.query.brand })
        totalCountProduct = totalCountProduct.find({ brand: req.query.brand })
    }

    if (req.query.q) {
    const searchRegex = new RegExp(req.query.q, "i"); // case-insensitive
    const searchCondition = {
      $or: [
        { title: searchRegex },       // <-- include title
        { category: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ]
    };
    query = query.find(searchCondition);
    totalCountProduct = totalCountProduct.find(searchCondition);
  }


    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order })
    }

    const totalCount = await totalCountProduct.count().exec();

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


exports.fetchProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await Product.findById(id);
        res.status(201).json(doc);
    }
    catch (err) {
        res.status(400).json(err);

    }
};

exports.editProduct = async (req, res) => {
    const { id } = req.params

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
        res.status(201).json(updatedProduct)
    } catch (error) {
        res.status(400).json(error)
    }
}
exports.deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.status(201).json(deleteProduct)
    } catch (error) {
        res.status(400).json(error)
    }
}
exports.getallTotalProducts = async (req, res) => {
    // const { id } = req.params

    try {
        const products = await Product.findByIdAndDelete()
        res.status(201).json(products)
    } catch (error) {
        res.status(400).json(error)
    }
}

