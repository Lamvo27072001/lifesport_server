
import express from "express";
import  user_route from "./user";
import authAccess from "../middlewares/authAccess";
import sendOTP from "../utils/sendOTP";
import product_route from "./product";
const router = express.Router();
router.get("/",authAccess, function (request, response) {
  response.send("Welcome to LifeTravel api.");
});
router.use("/users",authAccess, user_route);
router.use("/products", authAccess,product_route);
router.get("/sent/:id", (request: express.Request) => {
  const id = (request.params.id) as unknown as number;
  sendOTP("lampham27072001@gmail.com",id);
  // sendOTP("nuunkhang@gmail.com",id);
})
export default router;
