import { http } from '../http'

export const newsletterService = {
  subscribe: (body) => http.post('/newsletter', body),
}
