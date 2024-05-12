import { Request } from "express";
import multer from "multer"
require("dotenv").config();


//upload thumbnail course

const storageCourse = multer.diskStorage({
    destination: function (req : Request, file, cb) {
        return cb(null, "./src/public/courseImage");
    },
    filename: function (req : Request , file , cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export const uploadThumbnailCourse = multer({
    storage: storageCourse,
    limits: { fileSize : 1000*1000},
});




