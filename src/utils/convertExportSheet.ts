import { maxHeaderSize } from "http";
import { reverseFromSnake } from "./convertString";
import _ from 'lodash';
const convertExportSheet = (data: Array<object>) => {
  const default_header = [
    "id",
    "name",
    "quantity",
    "price",
    "description",
    "brand",
    "on_sales_id",
    "status",
    "sku",
    "currency",
    "thumbnail",
    "images",
    "color",
  ];
  const body: any[][] = [];
  const header: string[] = [];
  if (!_.isEmpty(data)) { 
    Object.keys(data[0]).map((head) => header.push(reverseFromSnake(head)));
    data?.map((item) => body.push(Object.values(item)));
  } else {
    default_header.map((head) => header.push(reverseFromSnake(head)));
  }
    return {
    header: header,
    body: body,
  };
};
export default convertExportSheet;
