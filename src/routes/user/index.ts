import express from "express";
import UserController from "../../controller/UserController";
import register from "./register";
import forgot from "./forgotPassword";
import authMidleware from "../../middlewares/authMidleware";
import edit from "./edit";
const user_route = express.Router();
user_route.post("/login", UserController.login);
user_route.use("/register", register);
user_route.use("/forgot-password", forgot);
user_route.use("/edit",edit)
user_route.get("/info", authMidleware, UserController.getUserInformations);
user_route.post("/info", authMidleware, UserController.addOrUpdateInformations);
export default user_route;
