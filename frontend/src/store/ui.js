import { create } from 'zustand'
import { storage } from '@/utils/storage'

let toastSeq = 0

/**
 * State giao diện toàn cục (không phải dữ liệu server):
 * modal đăng nhập, ô tìm kiếm, popup "đã thêm vào giỏ", khu vực giao hàng, toast.
 */
export const useUI = create((set, get) => ({
  /* Modal đăng nhập: step = 'email' | 'login' | 'register' */
  auth: { open: false, step: 'email', email: '', onSuccess: null },
  openAuth: (opts = {}) => set({ auth: { open: true, step: 'email', email: '', onSuccess: null, ...opts } }),
  setAuth: (patch) => set((s) => ({ auth: { ...s.auth, ...patch } })),
  closeAuth: () => set((s) => ({ auth: { ...s.auth, open: false, onSuccess: null } })),

  /* Ô tìm kiếm trượt từ phải */
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  /* Popup xác nhận đã thêm vào giỏ: { item, cart } */
  addedToBag: null,
  showAddedToBag: (payload) => set({ addedToBag: payload }),
  hideAddedToBag: () => set({ addedToBag: null }),

  /* Khu vực giao hàng (ảnh hưởng ước tính ngày giao) */
  province: storage.get('nep.province', 'ho-chi-minh'),
  setProvince: (code) => {
    storage.set('nep.province', code)
    set({ province: code })
  },
  locationOpen: false,
  openLocation: () => set({ locationOpen: true }),
  closeLocation: () => set({ locationOpen: false }),

  /* Cửa hàng ưu tiên cho "Nhận hôm nay tại cửa hàng" */
  pickupStore: storage.get('nep.pickupStore', null),
  setPickupStore: (store) => {
    storage.set('nep.pickupStore', store)
    set({ pickupStore: store })
  },

  /* Toast */
  toasts: [],
  toast: (message, tone = 'info') => {
    const id = ++toastSeq
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => get().dismissToast(id), 3800)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
