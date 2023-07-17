import { diskStorage } from 'multer';

import * as fs from 'fs';
//import * as FileType from 'file-type';
import filetype from 'magic-bytes.js';

// Must be imported in this format
import path = require('path');

type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions = ['png', 'jpg', 'jpeg'];
const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];


export const saveImageToStorage = {
    storage: diskStorage({
        destination: './images',
        filename: (_, file, cb) => {
            const fileExtenstion: string = path.extname(file.originalname);
            const fileName: string = uniqueName() + fileExtenstion;
            cb(null, fileName);
        }
    }),
    fileFilter: (_: any, file: any, cb: any) => {
        const allowedMimeTypes: validMimeType[] = validMimeTypes as validMimeType[];
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    }
}

export const isFileExtensionSafe =
    (filePath: string): boolean => {
        try {
            const magicFileType = filetype(fs.readFileSync(filePath))

            if (magicFileType.length <= 0)
                return false;
            const cheack: boolean[] = magicFileType.map(file => {
                if (!validFileExtensions.includes(file.extension))
                    return false;
                if (!validMimeTypes.includes(file.mime))
                    return false;
                if (!validFileExtensions.includes(file.typename))
                    return false;
                return true;
            })
            if (cheack.includes(false))
                return false;
            return true;
        } catch (error) {
            console.log(error);

        }
    }

export const removeFile = (fullFilePath: string): void => {
    try {
        fs.unlink(fullFilePath, () => { });
    } catch (error) {
        console.error(error)
    }
}

function uniqueName() {
    return (Math.random() * Math.pow(36, 6) | 0).toString(36);
}

