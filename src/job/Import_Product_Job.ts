import spreadsheet from "../config/spreadsheet";
import _ from "lodash";
import { convertIntoSnake } from "../utils/convertString";
import Product_Interface from "../interface/product";
import ProductModel from "../models/ProductModel";
import Export_Product_Job from "./Export_Product_Job";
const Import_Product_Job = async (tab: string) => {
  const { header, data } = await spreadsheet.importSpreadsheet(tab);
  const revert_header: Array<string> = [];
  const result = [];
  if (!_.isEmpty(header) && !_.isEmpty(data) && revert_header[0] != "id") {
    const inserted_product: string[] = [];
    header?.map((h) => revert_header.push(convertIntoSnake(h)));
    const updated_data = genObject(revert_header, data as unknown as any[][]);
    updated_data.map((d) => {
      if (!d.id) {
        inserted_product.push(
          `(${convertIntoString(_.values(_.omit(d, "id")))},'${genSlug(
            d.name
          )}')`
        );
      }
    });

    if (!_.isEmpty(inserted_product)) {
      await ProductModel.import_product(inserted_product.join()).then(async() => {
        await Export_Product_Job(tab);
      });
    }
  } else {
    throw new Error("<_error> The sheet is wrong format.");
  }
};
const splitString = (text: string) => {
  const stext = `{"${text.replaceAll(",", `","`)}"}`;
  return stext;
};
const genSlug = (name: string) => name.replaceAll(" ", "-").toLowerCase();
const genObject = (header: string[], data: any[][]) => {
  const new_data: Array<Product_Interface> = [];
  data?.map((d) => {
    var temp: Product_Interface = {
      id: "",
      name: "",
      quantity: "",
      price: "",
      description: "",
      brand: "",
      on_sales_id: "",
      status: "",
      sku: "",
      currency: "",
      thumbnail: "",
      images: "",
      color: "",
    };
    d.forEach((item: string, index: number) => {
      const formated_item=String(item).replaceAll("'", "&#39;");
      if (index > header.indexOf("currency")) {
        temp = _.merge(temp, { [header[index]]: splitString(formated_item) });
      } else {
        temp = _.merge(temp, { [header[index]]: formated_item });
      }
    });
    new_data.push(temp);
  });
  return new_data;
};
const convertIntoString = (data: any[]) => {
  const result = data.map((item) => `'${item}'`).join(",");
  return result;
};
export default Import_Product_Job;
