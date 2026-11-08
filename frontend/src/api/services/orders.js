import { http } from '../http'

export const orderService = {
  checkoutOptions: (province) => http.get('/checkout/options', { province }),
  cancelReasons: () => http.get('/checkout/cancel-reasons'),
  place: (body) => http.post('/orders', body),
  list: (channel) => http.get('/orders', { channel }),
  get: (number, email) => http.get(`/orders/${number}`, { email }),
  cancel: (number, body) => http.post(`/orders/${number}/cancel`, body),
}
