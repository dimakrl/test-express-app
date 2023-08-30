import {Router, Request, Response} from "express"
import imageService from "./image.service";
import * as multer from 'multer';

const upload = multer();

const imageController = Router()

imageController.post('/', upload.single('file'), async (req: Request, res: Response) => {
    await imageService.create(req.file, req.body, res);
})

imageController.get('/:key', async (req: Request, res: Response) => {
    console.log('Add some changes');
    await imageService.findOne(req.params.key, res);
})

export default imageController;