/** Wrapper localStorage an toàn (JSON + try/catch, chạy được cả ở chế độ ẩn danh). */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw == null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* hết dung lượng / chế độ riêng tư */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* bỏ qua */
    }
  },
}

export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}
