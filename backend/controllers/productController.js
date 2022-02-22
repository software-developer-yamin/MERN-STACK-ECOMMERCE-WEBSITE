import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import productModel from "../models/productModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import ErrorHander from "../utils/errorHander.js";


// create a product
export const createProduct = catchAsyncErrors(
     async (req, res) => {
          req.body.user = req.user.id;
          const product = await productModel.create(req.body);
          res.status(201).json({
               success: true,
               product,
          });
     }
);

// Get All Products
export const getAllProducts = catchAsyncErrors(
     async (req, res) => {
          const resultPerPage = 5;
          const productCount = await productModel.countDocuments();
          const apiFeature = new ApiFeatures(productModel.find(), req.query).search().filter().pagination(resultPerPage);
          const products = await apiFeature.query;
          res.status(200).json({
               success: true,
               products,
               productCount,
          });
     }
);

// Get Product Details
export const getProductDetails = catchAsyncErrors(
     async (req, res, next) => {
          const product = await productModel.findById(req.params.id);
          if (!product) return next(new ErrorHander("Product not found"), 404);
          res.status(200).json({
               success: true,
               product,
          });
     }
);

// Update product
export const updateProduct = catchAsyncErrors(
     async (req, res) => {
          let product = await productModel.findById(req.params.id);
          if (!product) return next(new ErrorHander("Product not found"), 404);
          product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
               new: true,
               runValidators: true,
          });
          res.status(200).json({
               success: true,
               product,
          });

     }
);

// Delete product
export const deleteProduct = catchAsyncErrors(
     async (req, res) => {
          const product = await productModel.findById(req.params.id);
          if (!product) return next(new ErrorHander("Product not found"), 404);
          await product.remove();
          res.status(200).json({
               success: true,
               message: "Product deleted successfully"
          });
     }
);

