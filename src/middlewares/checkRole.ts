import { Request,Response, NextFunction } from "express";
import decodeToken from "../utils/decodeToken";
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
export { isAdmin, isMasterAdmin, isAgent };
