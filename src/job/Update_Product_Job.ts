import SpreadSheet from "../config/spreadsheet";
import _, { indexOf } from "lodash";
import ProductModel from "../models/ProductModel";
import { reverseFromSnake } from "../utils/convertString";
import Export_Product_Job from "./Export_Product_Job";
const Update_Product_Job = async (tab: string) => {
  const default_header = [
    "new_id",
    "new_name",
    "new_quantity",
    "new_price",
    "new_description",
    "new_brand",
    "new_on_sales_id",
    "new_status",
    "new_sku",
    "new_currency",
    "new_thumbnail",
    "new_images",
    "new_color",
  ];
  const { header, data } = await SpreadSheet.importSpreadsheet(tab);
  const update_data: any[] = [];
  if (!_.isEmpty(header) && !_.isEmpty(data) && header[0] != "New Id") {
    const invalid_rows = checkValidData(header, data);
    if (_.isEmpty(invalid_rows)) {
      data.map((item) => {
        const temp: any[] = [];
        item.map((i, index) => {
          const formated_item = String(i).replaceAll("'", "&#39;");
          if (index > header.indexOf("NEW CURRENCY")) {
            temp.push(`'${splitString(formated_item)}'`);
          } else {
            temp.push(`'${formated_item}'`);
          }
        });
        temp.push(`'${genSlug(item[indexOf(header, "NEW NAME")])}'`);
        update_data.push(`(${temp})`);
      });
      const updated_string = update_data.join();
      await ProductModel.update_product(updated_string).then(async (res) => {
        await SpreadSheet.clearSpreadsheet(tab).then(
          async () => await SpreadSheet.exportSpreadsheet(tab, [header])
        );
        await Export_Product_Job('Product Listing');
      });
    } else {
      throw new Error(JSON.stringify(invalid_rows));
    }
  } else if (_.isEmpty(header) && _.isEmpty(data)) {
    const new_header: string[] = [];
    default_header.map((h) => new_header.push(reverseFromSnake(h)));
    await SpreadSheet.exportSpreadsheet(tab, [new_header]);
  } else {
    throw new Error("The sheet is empty.");
  }
};
const checkValidData = (header: string[], data: any[][]) => {
  const indx = indexOf(header, "NEW ID");
  const invalid_rows: string[] = [];
  data.map((d, index) => {
    if (!d[indx] || typeof d[indx] !== "number") {
      invalid_rows.push(`Row ${index + 2}:${index + 2} is invalid`);
    }
  });
  return { ...invalid_rows };
};
const genSlug = (name: string) => name.replaceAll(" ", "-").toLowerCase();
const splitString = (text: string) => {
  const stext = `{"${text.replaceAll(",", `","`)}"}`;
  return stext;
};
export default Update_Product_Job;
