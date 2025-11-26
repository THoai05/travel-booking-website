// Import cái instance api bro vừa config ở trên
// Lưu ý: Chỉnh lại đường dẫn ../ cho đúng folder của bro nhé
import api from '../../../../axios/axios'; 

const ENDPOINT = '/admin/hotels';

class HotelService {
  // GET ALL
  async findAll(page: number = 1, limit: number = 10) {
    // api.get sẽ tự trả về data (nhờ interceptor ở trên)
    // params sẽ tự được qs stringify (nhờ config ở trên)
    return api.get(ENDPOINT, { 
      params: { page, limit } 
    });
  }

  // GET ONE
  async findOne(id: number | string) {
    return api.get(`${ENDPOINT}/${id}`);
  }

  // CREATE
  async create(dto: any) {
    return api.post(ENDPOINT, dto);
  }

  // UPDATE
  async update(id: number | string, dto: any) {
    return api.put(`${ENDPOINT}/${id}`, dto);
  }

  // DELETE
  async remove(id: number | string) {
    return api.delete(`${ENDPOINT}/${id}`);
  }
}

export const hotelService = new HotelService();