import { Router } from 'express';
import multer from 'multer';

import DelitosController from './controllers/DelitosController'

const routes = Router();
let upload = multer();

routes.get('/delitos', DelitosController.index);
routes.post('/delitos', upload.fields([]) ,DelitosController.create);

 export default routes;