import * as jwt from "jsonwebtoken";
export default interface Token_Decoded_Interface{
    status: boolean;
    error: jwt.JwtPayload,
    decoded: jwt.JwtPayload,

}