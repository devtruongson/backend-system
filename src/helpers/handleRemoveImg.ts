import fs from 'fs'

export const handleRemoveThumbnailCourse = (path : string) : boolean => {
    try{
        if (path) {
            fs.unlink(`./src/public/courseImage/${path}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            return true;
        } else {
            return false;
        }
    }catch(err){
        console.log(err);
        return false;
    }
    
};
