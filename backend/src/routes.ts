import { Router } from 'express';

import DelitosController from './controllers/DelitosController'

const routes = Router();

routes.get('/delitos', DelitosController.index);
routes.post('/delitos', DelitosController.create);

 export default routes;