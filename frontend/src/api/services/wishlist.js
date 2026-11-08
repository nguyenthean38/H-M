import { http } from '../http'

export const wishlistService = {
  list: () => http.get('/wishlist'),
  add: (productId) => http.post('/wishlist', { productId }),
  remove: (productId) => http.delete(`/wishlist/${productId}`),
}
