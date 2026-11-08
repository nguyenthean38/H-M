import { http } from '../http'

export const storeService = {
  list: (params) => http.get('/stores', params),
  get: (slug) => http.get(`/stores/${slug}`),
}
