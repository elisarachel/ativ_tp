import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getClientes = () => api.get('/clientes');
export const createCliente = (cliente: any) => api.post('/clientes', cliente);
export const getProdutos = () => api.get('/produtos');
export const createProduto = (produto: any) => api.post('/produtos', produto);
export const getServicos = () => api.get('/servicos');
export const createServico = (servico: any) => api.post('/servicos', servico);
