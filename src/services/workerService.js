import api from "./api";

const workerService = {
  async getAll() {
    const response = await api.get("/workers");
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/workers/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await api.post("/workers", payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await api.put(`/workers/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    const response = await api.delete(`/workers/${id}`);
    return response.data.data;
  }
};

export default workerService;
