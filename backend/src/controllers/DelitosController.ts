import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import schema from 'yup/lib/schema';

import Delito from '../models/Delito';
import delitoView from '../views/delitos_view';

export default {

    async index(request: Request, response: Response) {
        const delitosRepository = getRepository(Delito);

        const delitos = await delitosRepository.find();

        return response.json(delitoView.renderMany(delitos));
    },

    async create(request: Request, response: Response) {
        const {
            tipo_delito,
            data,
            hora,
            latitude,
            longitude,
            descricao,
        } = request.body;

        const delitosRepository = getRepository(Delito);

        const dados = {
            tipo_delito,
            data,
            hora,
            latitude,
            longitude,
            descricao,
        };

        const schema = Yup.object().shape({
            tipo_delito: Yup.string().required('Tipo de delito é obrigatório'),
            data: Yup.string().required('Data é obrigatório'),
            hora: Yup.string().required('Hora é obrigatório'),
            latitude: Yup.number().required('Latitude é obrigatório'),
            longitude: Yup.number().required('Longitude é obrigatório'),
            descricao: Yup.string().optional().nullable(),
        });

        await schema.validate(dados, {
            abortEarly: false,
        });


        const delito = delitosRepository.create(dados);

        await delitosRepository.save(delito);

        return response.status(201).json(delito);
    },

    async remove(request: Request, response: Response) {

        const delitosRepository = getRepository(Delito);

        const delitos = await delitosRepository.find();

        delitos.forEach(async delito => {
            let partesData = delito.data.split("-");
            let date = new Date(parseInt(partesData[2]),
                (parseInt(partesData[1]) - 1),
                parseInt(partesData[0]));

            let expirado = new Date();
            expirado.setDate(expirado.getDate() - 15);
            if (date < expirado) {
                await delitosRepository.remove(delito);
            }
        });
        return response.status(200).json({message: 'Registros expirados excluídos'});
    }
}