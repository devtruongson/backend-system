import { Request } from "express";
import multer from "multer"
require("dotenv").config();

const storage = multer.diskStorage({
    destination: function (req : Request, file, cb) {
        return cb(null, "./src/public/courseImage");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize : 1000*1000},
});