import { Request, Response, NextFunction } from "express";
import decodeToken from "../utils/decodeToken";
import _ from "lodash";
const isAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  
  const { decoded } = await decodeToken(
    request.headers.authorization?.split(" ")[1] || ""
  );
  if (decoded.role == "admin" || decoded.role == "master_admin") {
    next();
  } else {
    return response
      .status(401)
      .json({ status: "error", message: "Invalid role" });
  }
};
const isMasterAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { decoded } = await decodeToken(
    request.headers.authorization?.split(" ")[1] || ""
  );
  if (decoded.role == "master_admin") {
    next();
  } else {
    return response
      .status(401)
      .json({ status: "error", message: "Invalid role" });
  }
};
const isAgent = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { decoded } = await decodeToken(
    request.headers.authorization?.split(" ")[1] || ""
  );
  if (decoded.role == "agent") {
    next();
  } else {
    return response
      .status(401)
      .json({ status: "error", message: "Invalid role" });
  }
};
const getRole = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!_.isEmpty(request.headers.authorization)) {
    const { decoded } = await decodeToken(
      request.headers.authorization?.split(" ")[1] || ""
    );
    
    if (decoded.role == "master_admin") {
      request.body.role = "admin";
      next();
    }
  } else {
    request.body.role = "customer";
    next();
  }
};
export { isAdmin, isMasterAdmin, isAgent,getRole };
