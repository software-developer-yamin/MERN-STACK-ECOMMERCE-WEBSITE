import { Router } from 'express';
import { getAllProducts, createProduct,updateProduct, deleteProduct, getProductDetails } from '../controllers/productController.js';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.js';

const router = Router();


router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticated, authorizeRoles("admin"), createProduct);
router.route("/product/:id").put(isAuthenticated, authorizeRoles("admin"), updateProduct).delete(isAuthenticated, authorizeRoles("admin"), deleteProduct).get(getProductDetails);


export default router;