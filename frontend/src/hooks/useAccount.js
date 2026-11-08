import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/api'
import { qk } from './queryClient'
import { useIsLoggedIn } from './useAuth'

export function useRewards() {
  const loggedIn = useIsLoggedIn()
  return useQuery({ queryKey: qk.rewards, queryFn: accountService.rewards, enabled: loggedIn })
}

export function useAddresses() {
  const loggedIn = useIsLoggedIn()
  return useQuery({ queryKey: qk.addresses, queryFn: accountService.addresses, enabled: loggedIn })
}

export function useCards() {
  const loggedIn = useIsLoggedIn()
  return useQuery({ queryKey: qk.cards, queryFn: accountService.cards, enabled: loggedIn })
}

function useMeMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: (me) => qc.setQueryData(qk.me, me) })
}

export const useUpdateMe = () => useMeMutation(accountService.update)
export const useUpdateSubscriptions = () => useMeMutation(accountService.updateSubscriptions)
export const useChangePassword = () => useMutation({ mutationFn: accountService.changePassword })

export function useDeleteAccount() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: accountService.deleteAccount, onSuccess: () => qc.clear() })
}

function useAddressMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: qk.addresses }) })
}
export const useAddAddress = () => useAddressMutation(accountService.addAddress)
export const useUpdateAddress = () => useAddressMutation(({ id, ...body }) => accountService.updateAddress(id, body))
export const useDeleteAddress = () => useAddressMutation(accountService.deleteAddress)

export function useDeleteCard() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: accountService.deleteCard, onSuccess: () => qc.invalidateQueries({ queryKey: qk.cards }) })
}
