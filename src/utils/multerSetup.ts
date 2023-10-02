import { Request } from 'express';
import multer, { StorageEngine } from 'multer';

// Set up multer storage
const storage: StorageEngine = multer.diskStorage({
    destination: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) {
        cb(null, 'uploads/'); // Define the destination folder for uploaded files
    },
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
    ) {
        cb(null, Date.now() + '-' + file.originalname); // Define the filename for uploaded files
    },
});

export const upload = multer({ storage: storage });
