import api from "./api";

const reportService = {
  async getDaily(date) {
    const response = await api.get(`/reports/daily?date=${date}`);
    return response.data.data;
  },

  async getWeekly(startDate, endDate) {
    const response = await api.get(`/reports/weekly?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  },

  async getMonthly(month) {
    const response = await api.get(`/reports/monthly?month=${month}`);
    return response.data.data;
  }
};

export default reportService;
