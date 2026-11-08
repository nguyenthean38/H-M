import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => (error?.status ?? 500) >= 500 && count < 2,
    },
  },
})

/** Query keys tập trung — dùng chung khi invalidate. */
export const qk = {
  me: ['me'],
  departments: ['departments'],
  category: (slug) => ['category', slug],
  products: (filters) => ['products', filters],
  product: (slug) => ['product', slug],
  recommendations: (id, type) => ['recommendations', id, type],
  reviews: (id, sort) => ['reviews', id, sort],
  availability: (id, colorCode, size) => ['availability', id, colorCode, size],
  suggestions: (q) => ['suggestions', q],
  stores: (params) => ['stores', params],
  store: (slug) => ['store', slug],
  cart: ['cart'],
  wishlist: ['wishlist'],
  orders: (channel) => ['orders', channel ?? 'all'],
  order: (number) => ['order', number],
  addresses: ['addresses'],
  cards: ['cards'],
  rewards: ['rewards'],
  checkoutOptions: (province) => ['checkout-options', province],
  cancelReasons: ['cancel-reasons'],
}
