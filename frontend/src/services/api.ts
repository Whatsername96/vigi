import axios from 'axios';
import { API_URL } from '@env';

const api = axios.create({
    baseURL: API_URL
});
//copiar endereco do expo para celular físico
// adb reverse tcp:3333 tcp:3333 para emulador android com local host
export default api;