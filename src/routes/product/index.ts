import express from "express";
import ProductController from "../../controller/ProductController";
import authMidleware from "../../middlewares/authMidleware";
import { isAdmin } from "../../middlewares/checkRole";

const product_route = express.Router();
product_route.get(
  "/import",
  authMidleware,
  isAdmin,
  ProductController.import_product
);
product_route.get(
  "/update",
  authMidleware,
  isAdmin,
  ProductController.update_product
);
product_route.get(
  "/export",
  authMidleware,
  isAdmin,
  ProductController.export_product
);
product_route.get("/list", ProductController.list_product);
product_route.get("/list/detail", ProductController.detail_product);
product_route.post(
  "/delete",
  authMidleware,
  isAdmin,
  ProductController.delete_products
);

export default product_route;
