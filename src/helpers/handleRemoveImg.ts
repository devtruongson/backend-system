import fs from 'fs';

export const handleRemoveFile = (path: string, location: string): boolean => {
    try {
        if (path) {
            fs.unlink(`./src/public/${location}/${path}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};
