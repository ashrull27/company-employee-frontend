import api from './api';

export const employeeService = {
  getAll: (page = 1, limit = 10) => {
    return api.get(`/employees?page=${page}&limit=${limit}`);
  },

  getById: (id) => {
    return api.get(`/employees/${id}`);
  },

  create: (data) => {
    return api.post('/employees', data);
  },

  update: (id, data) => {
    return api.put(`/employees/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/employees/${id}`);
  }
};