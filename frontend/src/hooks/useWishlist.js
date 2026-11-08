import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '@/api'
import { useUI } from '@/store/ui'
import { qk } from './queryClient'

export const useWishlist = () => useQuery({ queryKey: qk.wishlist, queryFn: wishlistService.list })

/** Trả về [isSaved, toggle] cho một sản phẩm. Khách chưa đăng nhập vẫn lưu được (gộp khi đăng nhập). */
export function useWishlistToggle(product) {
  const qc = useQueryClient()
  const toast = useUI((s) => s.toast)
  const { data = [] } = useWishlist()
  const saved = data.some((p) => p.id === product?.id)
  const m = useMutation({
    mutationFn: () => (saved ? wishlistService.remove(product.id) : wishlistService.add(product.id)),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.wishlist })
      const prev = qc.getQueryData(qk.wishlist)
      qc.setQueryData(qk.wishlist, (old = []) => (saved ? old.filter((p) => p.id !== product.id) : [product, ...old]))
      return { prev }
    },
    onError: (_e, _v, ctx) => qc.setQueryData(qk.wishlist, ctx?.prev),
    onSuccess: () => toast(saved ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã lưu vào danh sách yêu thích', 'success'),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.wishlist }),
  })
  return [saved, () => product && m.mutate()]
}
