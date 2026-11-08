import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/api'
import { qk } from './queryClient'
import { useIsLoggedIn } from './useAuth'

export const useCheckoutOptions = (province) =>
  useQuery({ queryKey: qk.checkoutOptions(province), queryFn: () => orderService.checkoutOptions(province) })

export const useCancelReasons = () => useQuery({ queryKey: qk.cancelReasons, queryFn: orderService.cancelReasons, staleTime: Infinity })

export function useOrders(channel) {
  const loggedIn = useIsLoggedIn()
  return useQuery({ queryKey: qk.orders(channel), queryFn: () => orderService.list(channel), enabled: loggedIn })
}

export const useOrder = (number, email) =>
  useQuery({ queryKey: [...qk.order(number), email ?? null], queryFn: () => orderService.get(number, email), enabled: Boolean(number), retry: false })

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderService.place,
    onSuccess: (order) => {
      qc.setQueryData([...qk.order(order.number), null], order)
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: qk.me })
      qc.invalidateQueries({ queryKey: qk.addresses })
      qc.invalidateQueries({ queryKey: qk.cards })
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ number, ...body }) => orderService.cancel(number, body),
    onSuccess: (order) => {
      qc.setQueryData([...qk.order(order.number), null], order)
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: qk.order(order.number) })
      qc.invalidateQueries({ queryKey: qk.me })
    },
  })
}
