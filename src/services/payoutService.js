import api from "./api";

const payoutService = {
  async generate(payload) {
    const response = await api.post("/payouts/generate", payload);
    return response.data.data;
  },

  async getAll() {
    const response = await api.get("/payouts");
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/payouts/${id}`);
    return response.data.data;
  },

  async markAsPaid(id) {
    const response = await api.patch(`/payouts/${id}/pay`);
    return response.data.data;
  }
};

export default payoutService;
