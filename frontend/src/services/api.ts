import axios from 'axios';

const api = axios.create({
    baseURL: 'http://'
});
//copiar endereco do expo para celular físico
// adb reverse tcp:3333 tcp:3333 para emulador
export default api;