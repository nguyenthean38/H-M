import { http } from '../http'

export const catalogService = {
  departments: () => http.get('/departments'),
  category: (slug) => http.get(`/categories/${slug}`),
  products: (filters) => http.get('/products', filters),
  product: (slug) => http.get(`/products/${slug}`),
  recommendations: (id, type = 'similar', limit = 12) => http.get(`/products/${id}/recommendations`, { type, limit }),
  reviews: (id, params) => http.get(`/products/${id}/reviews`, params),
  notifyMe: (id, body) => http.post(`/products/${id}/notify`, body),
  availability: (id, params) => http.get(`/products/${id}/availability`, params),
  suggestions: (q) => http.get('/search/suggestions', { q }),
}
