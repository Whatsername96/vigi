import Delito from '../models/Delito';

export default {
    render(delito: Delito){
        return {
            id: delito.id,
            tipo_delito: delito.tipo_delito,
            data: delito.data,
            hora: delito.hora,
            latitude: delito.latitude,
            longitude: delito.longitude,
            descricao: delito.descricao,
        };
    },

    renderMany(delitos: Delito[]){
        return delitos.map(delito => this.render(delito))
    }
};