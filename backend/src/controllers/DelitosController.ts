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
            index,
        } = request.body;

        const delitosRepository = getRepository(Delito);

        const dados = {
            tipo_delito,
            data,
            hora,
            latitude,
            longitude,
            descricao,
            index,
        };

        const schema = Yup.object().shape({
            tipo_delito: Yup.string().required('Tipo de delito é obrigatório'),
            data: Yup.string().required('Data é obrigatório'),
            hora: Yup.string().required('Hora é obrigatório'),
            latitude: Yup.number().required('Latitude é obrigatório'),
            longitude: Yup.number().required('Longitude é obrigatório'),
            descricao: Yup.string().optional().nullable(),
            index: Yup.number().required(),
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
            let dataDelito = new Date(parseInt(partesData[2]), (parseInt(partesData[1]) -1), parseInt(partesData[0]));

            let hoje = new Date();

            let strData = (hoje.getFullYear().toString() + '-' + (hoje.getMonth() + 1).toString() + '-' + hoje.getDate().toString());
            partesData = strData.split("-");

            hoje = new Date(parseInt(partesData[2]), (parseInt(partesData[1]) -1), parseInt(partesData[0]));
    
            let milissegundos_por_dia = 1000 * 60 * 60 * 24;
            let expirado = new Date((hoje.getTime() + 16 * milissegundos_por_dia));
            
            if (dataDelito === expirado) {
                await delitosRepository.remove(delito);
            }
        });

        return response.status(200).json({message: 'Registros expirados excluídos'});
    }
}