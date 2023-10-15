import _ from "lodash";
import SpreadSheet from "../config/spreadsheet";
import ProductModel from "../models/ProductModel";

const Export_Product_Job = async (tab:string) => {
  const data: any[][] = [];
  const product_id: any[] = [];
  const extra_row: any[][] = [];
  const sheet_data = await SpreadSheet.importSpreadsheet("Product Listing");
  const exported_data = await ProductModel.export_product();
  sheet_data.data.map((row) => {
    if (!_.isEmpty(row[0])) {
      product_id.push(row[0]);
    }
  });
  exported_data.body.map((row) => {
    const temp: any[] = [];
    row.map((item) => {
      if (_.isArray(item)) {
        temp.push(item.join());
      } else {
        temp.push(item);
      }
    });
    data.push(temp);
    if (!product_id.includes(row[0])) {
      extra_row.push(temp);
    }
  });
  await SpreadSheet.clearSpreadsheet(tab).then(async() => {
    await SpreadSheet.exportSpreadsheet(tab, [exported_data.header, ...data]);
  })
  // if (_.isEmpty(product_id) && !_.isEmpty(exported_data.body)) {
  // } else if (extra_row.length > 0) {
  //   await SpreadSheet.appendSpreadsheet(tab, extra_row);
  // }
};
export default Export_Product_Job