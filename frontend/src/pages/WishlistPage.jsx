import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { ProductGrid } from '@/components/product/ProductCard'
import { ProductRail } from '@/components/product/ProductRail'
import { Button, EmptyState, Notice } from '@/components/ui'
import { useIsLoggedIn } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useCatalog'
import { useWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'

export default function WishlistPage() {
  const { data = [], isLoading } = useWishlist()
  const loggedIn = useIsLoggedIn()
  const openAuth = useUI((s) => s.openAuth)
  const picks = useProducts({ category: 'moi-ve', pageSize: 12 })

  useEffect(() => {
    document.title = 'Yêu thích — Nếp'
  }, [])

  return (
    <div className="pb-8">
      <div className="ds-container pt-10 pb-6">
        <h1 className="ds-h1">Yêu thích</h1>
        <p className="mt-2 text-[13px] text-muted">{data.length ? `${data.length} sản phẩm đã lưu` : ' '}</p>
        {!loggedIn && data.length > 0 && (
          <Notice className="mt-5 max-w-2xl">
            Danh sách đang được lưu tạm trên trình duyệt này.{' '}
            <button type="button" onClick={() => openAuth()} className="font-semibold underline underline-offset-4">
              Đăng nhập
            </button>{' '}
            để giữ danh sách trên mọi thiết bị.
          </Notice>
        )}
      </div>
      <div className="ds-container">
        {isLoading ? (
          <ProductGrid loading products={[]} />
        ) : data.length ? (
          <ProductGrid products={data} />
        ) : (
          <EmptyState icon={Heart} title="Chưa có sản phẩm yêu thích" action={<Button to="/c/moi-ve">Khám phá hàng mới về</Button>}>
            Bấm biểu tượng trái tim trên sản phẩm để lưu lại, so sánh và mua sau.
          </EmptyState>
        )}
      </div>
      <ProductRail className="mt-20" title="Có thể bạn sẽ thích" products={picks.data?.items} loading={picks.isLoading} />
    </div>
  )
}
