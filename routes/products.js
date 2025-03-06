var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj) {
  console.log("Query nhận được:", obj);
  let result = {};

  // Lọc theo tên sản phẩm (nếu có)
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }

  // Xử lý price hợp lệ
  if (obj.price && (obj.price.$gte || obj.price.$lte)) {
    result.price = {}; // Chỉ tạo object price nếu có điều kiện hợp lệ

    if (obj.price.$gte) result.price.$gte = Number(obj.price.$gte);
    if (obj.price.$lte) result.price.$lte = Number(obj.price.$lte);
  }

  return result;
}


/* GET users listing. */
router.get('/', async function(req, res, next) {
  

  let products = await productModel.find(buildQuery(req.query));

  res.status(200).send({
    success:true,
    data:products
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
      let id = req.params.id;
      let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedProduct) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }
      res.json({ success: true, data: updatedProduct });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
      let id = req.params.id;
      let deletedProduct = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      if (!deletedProduct) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }
      res.json({ success: true, message: 'Sản phẩm đã được xóa mềm' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }s
});



module.exports = router;