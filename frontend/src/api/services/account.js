import { http } from '../http'

export const accountService = {
  me: () => http.get('/me'),
  update: (body) => http.patch('/me', body),
  updateSubscriptions: (body) => http.patch('/me/subscriptions', body),
  changePassword: (body) => http.post('/me/password', body),
  deleteAccount: () => http.delete('/me'),
  rewards: () => http.get('/me/rewards'),
  addresses: () => http.get('/me/addresses'),
  addAddress: (body) => http.post('/me/addresses', body),
  updateAddress: (id, body) => http.patch(`/me/addresses/${id}`, body),
  deleteAddress: (id) => http.delete(`/me/addresses/${id}`),
  cards: () => http.get('/me/cards'),
  deleteCard: (id) => http.delete(`/me/cards/${id}`),
}
