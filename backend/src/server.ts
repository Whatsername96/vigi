import express from 'express';
import './database/connection';
import { getRepository } from 'typeorm';

import Delito from './models/Delitos';

const app = express();

app.use(express.json())

app.post('/delitos', async (request, response) => {
   const {
      tipo_delito,
      data,
      hora,
      latitude,
      longitude,
      descricao,
   } = request.body;

   const delitosRepository = getRepository(Delito);

   const delito = delitosRepository.create({
      tipo_delito,
      data,
      hora,
      latitude,
      longitude,
      descricao,
   });

   await delitosRepository.save(delito);

   return response.json({ message: 'Hello World' });
});

app.listen(3333);
//localhost:3333