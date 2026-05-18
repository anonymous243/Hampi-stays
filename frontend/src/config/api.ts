const baseUrl = import.meta.env.VITE_API_URL || 'https://hampistays.anonymous24tr.workers.dev';
export const API_BASE_URL = baseUrl.replace(/\/$/, '') + '/api';


