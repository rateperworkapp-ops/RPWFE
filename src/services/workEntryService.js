import api from "./api";

const workEntryService = {
  async getAll() {
    const response = await api.get("/work-entries");
    return response.data.data;
  },

  async getByWorker(workerId) {
    const response = await api.get(`/work-entries/worker/${workerId}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await api.post("/work-entries", payload);
    return response.data.data;
  }
};

export default workEntryService;
