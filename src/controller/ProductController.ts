import { Request, Response } from "express";
import Import_Product_Job from "../job/Import_Product_Job";
import Update_Product_Job from "../job/Update_Product_Job";
import Export_Product_Job from "../job/Export_Product_Job";
import Query_Interface from "../interface/query";
import ProductModel from "../models/ProductModel";
class ProductController {
  async import_product(response: Response) {
    let status = 200;
    const result = await Import_Product_Job("Product Listing")
      .then(() => {
        return { status: "success", message: "Import sheet success." };
      })
      .catch((err: Error) => {
        status = 400;
        return { status: "error", message: err.message };
      });
    return response.status(status).json(result);
  }
  async update_product(request: Request, response: Response) {
    let status = 200;
    const result = await Update_Product_Job("Product Update")
      .then(() => {
        return { status: "success", message: "Update sheet success." };
      })
      .catch((err: Error) => {
        status = 400;
        return { status: "error", message: err.message };
      });

    return response.status(status).json(result);
  }
  async export_product(request: Request, response: Response) {
    let status = 200;
    const result = await Export_Product_Job("Product Listing")
      .then(() => {
        return { status: "success", message: "Export sheet success." };
      })
      .catch((err: Error) => {
        status = 400;
        return { status: "error", message: err.message };
      });
    return response.status(status).json(result);
  }
  async list_product(request: Request, response: Response) {
    const { page, limit } = <Query_Interface>request.query;
    let status = 200;
    const result=await ProductModel.list_products(limit, page).then(res => {
      return res; 
    }).catch(() => {
      status = 404; 
      return 'Not found data.'
    });
    return response.status(status).json({ items:result });
  }
  async detail_product(request:Request,response:Response) {
    const { id } = <Query_Interface>request.query;
    let status = 200;
    const result = await ProductModel.product_detail(id)
      .then((res) => {
        return res;
      })
      .catch(() => {
        status = 404;
        return "Not found data.";
      });
      return response.status(status).json({ item:result });
  }
  async delete_products(request:Request, response: Response) {
    const payload = request.body;
    let status = 200;
    const result = await ProductModel.delete_products(
      `(${payload.ids.join(",")})`
    )
      .then(() => {
        return { status: "success", message: "Delete products success." };
      })
      .catch(() => {
        status = 400;
        return { status: "error", message: "Delete products fail." };
      });
    return response.status(status).json(result);
  
  }

}
export default new ProductController();
