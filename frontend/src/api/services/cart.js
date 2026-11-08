import { http } from '../http'

export const cartService = {
  get: () => http.get('/cart'),
  addItem: (body) => http.post('/cart/items', body),
  updateItem: (id, body) => http.patch(`/cart/items/${id}`, body),
  removeItem: (id) => http.delete(`/cart/items/${id}`),
  applyPromo: (code) => http.post('/cart/promo', { code }),
  removePromo: () => http.delete('/cart/promo'),
}
