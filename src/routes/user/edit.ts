import express from "express";
import UserController from "../../controller/UserController";
import { isMasterAdmin } from "../../middlewares/checkRole";
import authMidleware from "../../middlewares/authMidleware";
const edit = express.Router();
edit.post('/update-role',authMidleware,isMasterAdmin, UserController.editUserRole)
edit.post('/delete',authMidleware,isMasterAdmin, UserController.editUserRole)
export default edit