const Product=require("../models/productModal");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')
//Create Product --Admin
const createProduct=catchAsyncErrors(async(req,res,next)=>{
  
 console.log("reqbody", req.body);
 const product = await Product.create(req.body);
 res.status(201).json({
   success: true,
   product,
 })
 console.log("product", product);
    // }catch(err){
    //     console.log(err)
    //     res.status(500).json({
    //         success:false,
    //         meaage:err.message  
    //     })
    // }
   
})

//Get All prod
const getAllProducts = catchAsyncErrors(async (req, res) => {
  const searchKey = req.query.search;
  let products;
  const queryCopy={...req.query}
  console.log("queryCopybefore",queryCopy)
  const removeFields=["search","page","limit"];
  removeFields.forEach((key=>delete queryCopy[key]))
  let queryStr=JSON.stringify(queryCopy);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`);
  const resultsPerPage=5;
  const productCount=await Product.countDocuments()
  const currentPage=req.query.page || 1;
  const skip = resultsPerPage * (currentPage - 1);
  
  console.log("queryCopyafter", JSON.parse(queryStr));


  if(searchKey && !queryCopy.category){
    products = await Product.find ({
  name: {
    $regex: searchKey,// for search
    $options:"i"
  },
});
  }else if (queryStr) {
    products = await Product.find(JSON.parse(queryStr));//for category, gt,lt,lte,gte
  } else {
    products = await Product.find();// for search
  }
  if(req.query.page){
    products=await Product.find(JSON.parse(queryStr)).limit(resultsPerPage).skip(skip)//pagination
  }



  console.log("searchKey", searchKey);
  

  res.status(200).json({
    success: true,
    totalProducts: products.length,
    products,
    productCount,
  });
});

//Update Product --Admin
const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not Found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not Found",
    });
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Found",
  });
});

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(500).json({
    //     success:false,
    //     message:"Product not found"
    // })
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
};