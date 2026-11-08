import { http, tokenStore } from '../http'

const keep = (res) => {
  tokenStore.set(res.token)
  return res.user
}

export const authService = {
  checkEmail: (email) => http.post('/auth/check-email', { email }),
  login: (body) => http.post('/auth/login', body).then(keep),
  register: (body) => http.post('/auth/register', body).then(keep),
  logout: () => http.post('/auth/logout').finally(() => tokenStore.clear()),
  forgotPassword: (email) => http.post('/auth/forgot-password', { email }),
  resetPassword: (body) => http.post('/auth/reset-password', body),
}
