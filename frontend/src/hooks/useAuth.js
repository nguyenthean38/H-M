import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService, authService, tokenStore } from '@/api'
import { qk } from './queryClient'

/** Người dùng hiện tại (null nếu chưa đăng nhập). */
export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => (tokenStore.get() ? accountService.me().catch(() => null) : null),
    staleTime: 60_000,
  })
}

export function useIsLoggedIn() {
  const { data } = useMe()
  return Boolean(data)
}

function useSessionMutation(fn) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: (user) => {
      qc.setQueryData(qk.me, user)
      // giỏ hàng & yêu thích của khách đã được gộp vào tài khoản
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: qk.wishlist })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useLogin = () => useSessionMutation(authService.login)
export const useRegister = () => useSessionMutation(authService.register)

export const useCheckEmail = () => useMutation({ mutationFn: authService.checkEmail })
export const useForgotPassword = () => useMutation({ mutationFn: authService.forgotPassword })
export const useResetPassword = () => useMutation({ mutationFn: authService.resetPassword })

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      qc.setQueryData(qk.me, null)
      for (const key of [['orders'], qk.addresses, qk.rewards, qk.cards]) qc.removeQueries({ queryKey: key })
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: qk.wishlist })
    },
  })
}
