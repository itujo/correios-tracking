import axios from 'axios';
import { parseCookies } from 'nookies';

export default function getAPIClient(ctx?: any) {
  const { 'wms-token': token } = parseCookies(ctx);

  const API_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://api.gruposplog.com.br/wms';

  const api = axios.create({
    baseURL: API_URL,
  });

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return api;
}
