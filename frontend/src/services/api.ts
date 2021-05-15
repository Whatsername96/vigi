import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.28:3333'
});
//copiar endereco do expo para celular físico
// adb reverse tcp:3333 tcp:3333 para emulador android
export default api;