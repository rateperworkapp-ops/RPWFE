import api from "./api";

const departmentService = {
  async getAll() {
    const response = await api.get("/departments");
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/departments/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await api.post("/departments", payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await api.put(`/departments/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    const response = await api.delete(`/departments/${id}`);
    return response.data.data;
  }
};

export default departmentService;
