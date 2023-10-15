import cors from "cors-ts";
import express from "express";
import endpointsConfig from "./endpoints.config";
import executeDBScript from "./config/database";
import router from "./routes";
import helmet from "helmet";
import MasterCronJob from "./cronjob";
import convertExportSheet from "./utils/convertExportSheet";
import Sheet_Interface from "./interface/sheet";
const port = endpointsConfig.port;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});
executeDBScript("Select version()")
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
  app.use("/", router);
  // MasterCronJob();
  
// TEST
// executeDBScript("select * from product_categories")
//     .then((res) => {
     
//       var prod:Sheet_Interface = convertExportSheet(res);
//           const data: any[] = [prod.header, ...prod.body];
  
//       console.log(data);
//     })
//     .catch((err) => console.log(err));
