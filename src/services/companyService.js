import api from './api';

export const companyService = {
  getAll: (page = 1, limit = 10) => {
    return api.get(`/companies?page=${page}&limit=${limit}`);
  },

  getById: (id) => {
    return api.get(`/companies/${id}`);
  },

  create: (data) => {
    return api.post('/companies', data);
  },

  update: (id, data) => {
    return api.put(`/companies/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/companies/${id}`);
  }
};