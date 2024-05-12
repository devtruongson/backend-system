import jwt from "jsonwebtoken"
import { IPayloadJWT } from "~/utils/interface";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

export const handleCreateToken = (payload : IPayloadJWT) : string | null => {
    try{
        let key : string  = process.env.JWT_SECRET as string
        let token = jwt.sign(payload, key);
        return token;
    }catch(err){
        console.log(err);
        return null
    }
};

export const handleVerifyToken = (token : string) : IPayloadJWT | null  => {
    try {
        let key : string = process.env.JWT_SECRET as string;
        return jwt.verify(token, key) as IPayloadJWT;
    } catch (err) {
        console.log(err);
        return null
    }
};


export const handleCheckTokenUser =(req : Request , res : Response , next : NextFunction)=>{
    try{
        if (!req.headers.authorization) return res.status(401).json({});

        const token =  req.headers.authorization?.replace("Bearer","").trim();

        let decode = handleVerifyToken(token);

        if(!decode) return res.status(403).json({});

        req.body.token_author = decode.email;

        console.log(decode);

        next();

    }catch(err){
        console.log(err);
        return res.status(500).json({});
    }
}

export const handleCheckTokenTeacher =(req : Request , res : Response , next : NextFunction)=>{
    try{
        if (!req.headers.authorization) return res.status(401).json({});

        const token =  req.headers.authorization?.replace("Bearer","").trim();

        let decode = handleVerifyToken(token);

        if(!decode) return res.status(403).json({});

        req.body.token_author = decode.email;

        console.log(decode);

        next();

    }catch(err){
        console.log(err);
        return res.status(500).json({});
    }
}

export const handleCheckTokenSale =(req : Request , res : Response , next : NextFunction)=>{
    try{
        if (!req.headers.authorization) return res.status(401).json({});

        const token =  req.headers.authorization?.replace("Bearer","").trim();

        let decode = handleVerifyToken(token);

        if(!decode) return res.status(403).json({});

        req.body.token_author = decode.email;

        console.log(decode);

        next();

    }catch(err){
        console.log(err);
        return res.status(500).json({});
    }
}


export const handleCheckTokenAmin =(req : Request , res : Response , next : NextFunction)=>{
    try{
        if (!req.headers.authorization) return res.status(401).json({});

        const token =  req.headers.authorization?.replace("Bearer","").trim();

        let decode = handleVerifyToken(token);

        if(!decode) return res.status(403).json({});

        req.body.token_author = decode.email;

        console.log(decode);

        next();

    }catch(err){
        console.log(err);
        return res.status(500).json({});
    }
}
