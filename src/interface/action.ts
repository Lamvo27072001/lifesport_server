import express from "express";
export default interface Action{
    request: express.Request;
    response: express.Response;
    next?: express.NextFunction;
}