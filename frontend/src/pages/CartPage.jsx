import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, RotateCcw, ShoppingBag, Truck } from 'lucide-react'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { OrderTotals } from '@/components/cart/OrderTotals'
import { PaymentBadges } from '@/components/cart/PaymentBadges'
import { PromoCodeBox } from '@/components/cart/PromoCodeBox'
import { ProductRail } from '@/components/product/ProductRail'
import { Button, Modal, ProgressBar } from '@/components/ui'
import { brand } from '@/config/brand'
import { useMe } from '@/hooks/useAuth'
import { useCart, useRemoveCartItem } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { formatPrice } from '@/utils/format'

const FREE_REASON = {
  member: 'Thành viên hạng Vải trở lên được miễn phí giao hàng mọi đơn.',
  promo: 'Mã giảm giá của bạn bao gồm miễn phí giao hàng.',
  threshold: `Đơn từ ${formatPrice(brand.freeShippingThreshold)} được miễn phí giao hàng tiêu chuẩn.`,
}

function FreeShippingBar({ cart }) {
  const reached = cart.freeShippingRemaining === 0
  const progress = reached ? 1 : cart.totals.subtotal / cart.freeShippingThreshold
  return (
    <div className="border border-line bg-surface px-4 py-3">
      <p className="mb-2 flex items-center gap-2 text-[13px]">
        <Truck className="size-4 shrink-0 text-cham" strokeWidth={1.5} />
        {reached ? (
          <span>
            <strong className="text-la">Bạn được miễn phí giao hàng.</strong> <span className="text-muted">{FREE_REASON[cart.freeShippingReason] ?? ''}</span>
          </span>
        ) : (
          <span>
            Mua thêm <strong>{formatPrice(cart.freeShippingRemaining)}</strong> để được miễn phí giao hàng.
          </span>
        )}
      </p>
      <ProgressBar value={progress} />
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-6">
            <div className="ds-skeleton aspect-[3/4] w-32" />
            <div className="flex-1 space-y-2">
              <div className="ds-skeleton h-4 w-2/3" />
              <div className="ds-skeleton h-3 w-1/4" />
              <div className="ds-skeleton h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="ds-skeleton h-72" />
    </div>
  )
}

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  const toast = useUI((s) => s.toast)
  const remove = useRemoveCartItem()
  const [removing, setRemoving] = useState(null)
  const { data: recs, isLoading: recsLoading } = useProducts({ category: 'ban-chay', pageSize: 12 })

  const confirmRemove = () =>
    remove.mutate(removing.id, {
      onSuccess: () => {
        toast('Đã xoá sản phẩm khỏi giỏ hàng')
        setRemoving(null)
      },
      onError: (e) => toast(e.message, 'error'),
    })

  const empty = cart && cart.items.length === 0

  return (
    <div className="pb-8">
      <div className="ds-container pt-8 pb-10 sm:pt-12">
        <h1 className="ds-h1">
          Giỏ hàng
          {cart?.count ? <span className="ml-3 align-middle font-sans text-base font-normal tracking-normal text-muted">({cart.count} sản phẩm)</span> : null}
        </h1>
        <p className="mt-5 flex items-center gap-2 border border-line bg-surface px-4 py-3 text-[13px]">
          <Clock className="size-4 shrink-0 text-cham" strokeWidth={1.5} />
          Cần gấp? Đặt trước 14:00 để nhận trong ngày tại Hà Nội, TP.HCM, Đà Nẵng.
        </p>

        <div className="mt-8">
          {isLoading || !cart ? (
            <CartSkeleton />
          ) : empty ? (
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div className="flex flex-col items-start gap-5 border-t border-line pt-8">
                <ShoppingBag className="size-10 text-cham" strokeWidth={1.25} />
                <h2 className="ds-h2">Giỏ hàng của bạn đang trống</h2>
                <p className="max-w-md text-muted">Lướt một vòng các món mới về, hoặc xem lại những món bạn đã lưu trong danh sách yêu thích.</p>
                <div className="flex flex-wrap gap-3">
                  <Button to="/">Tiếp tục mua sắm</Button>
                  <Button to="/yeu-thich" variant="outline">
                    Xem yêu thích
                  </Button>
                </div>
                {!me && (
                  <button type="button" onClick={() => openAuth()} className="text-[13px] underline underline-offset-4 hover:text-cham">
                    Đăng nhập để xem giỏ hàng đã lưu
                  </button>
                )}
              </div>
              <aside className="space-y-4 bg-surface p-6">
                <p className="ds-label">Tổng cộng</p>
                <p className="text-sm text-muted">Chưa có sản phẩm nào.</p>
                <Button block disabled>
                  Tiếp tục thanh toán
                </Button>
                <p className="text-xs text-muted">Trả góp 0% qua thẻ tín dụng cho đơn từ 1.500.000₫.</p>
                <PaymentBadges />
              </aside>
            </div>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
              <section aria-label="Sản phẩm trong giỏ">
                <FreeShippingBar cart={cart} />
                <ul className="mt-6">
                  {cart.items.map((it) => (
                    <CartItemRow key={it.id} item={it} onRemove={setRemoving} />
                  ))}
                </ul>
                <div className="mt-6 grid gap-3 text-[13px] text-ink-2 sm:grid-cols-2">
                  <p className="flex items-start gap-2">
                    <RotateCcw className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                    <span>
                      Đổi trả miễn phí trong {brand.returnDays} ngày tại mọi cửa hàng.{' '}
                      <Link to="/thong-tin/doi-tra" className="ds-link">
                        Chính sách đổi trả
                      </Link>
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Truck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                    <span>
                      Giao toàn quốc 1–5 ngày.{' '}
                      <Link to="/thong-tin/giao-hang" className="ds-link">
                        Thông tin giao hàng
                      </Link>
                    </span>
                  </p>
                </div>
              </section>

              <aside className="space-y-5 bg-surface p-6 lg:sticky lg:top-32" aria-label="Tóm tắt đơn hàng">
                <PromoCodeBox cart={cart} />
                <OrderTotals totals={cart.totals} promo={cart.promo} />
                <Button to="/thanh-toan" block size="lg">
                  Tiếp tục thanh toán
                </Button>
                <p className="text-xs text-muted">Trả góp 0% qua thẻ tín dụng cho đơn từ 1.500.000₫.</p>
                <PaymentBadges />
                <div className="border border-dashed border-cham-300 bg-cham-50 px-4 py-3 text-xs text-cham-600">
                  <p className="font-semibold">Mã giảm giá để thử</p>
                  <ul className="mt-1.5 space-y-1">
                    <li>
                      <span className="font-mono font-semibold">NEPMOI</span> — giảm 10% (tối đa 100.000₫)
                    </li>
                    <li>
                      <span className="font-mono font-semibold">FREESHIP</span> — miễn phí giao hàng
                    </li>
                    <li>
                      <span className="font-mono font-semibold">DOICU50</span> — giảm 50.000₫ cho đơn từ 300.000₫
                    </li>
                    <li>
                      <span className="font-mono font-semibold">CLUB15</span> — giảm 15%, chỉ dành cho thành viên
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-muted">
                  Cần hỗ trợ? Gọi {brand.hotline} ({brand.hotlineHours}) hoặc xem{' '}
                  <Link to="/thong-tin/tro-giup" className="ds-link">
                    Trung tâm trợ giúp
                  </Link>
                  .
                </p>
              </aside>
            </div>
          )}
        </div>
      </div>

      <ProductRail title="Có thể bạn sẽ thích" eyebrow="Gợi ý cho bạn" products={recs?.items ?? []} loading={recsLoading} viewAllTo="/c/ban-chay" className="mt-6" />

      <Modal
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title="Xoá sản phẩm"
        size="sm"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setRemoving(null)}>
              Huỷ
            </Button>
            <Button onClick={confirmRemove} loading={remove.isPending}>
              Xoá khỏi giỏ
            </Button>
          </div>
        }
      >
        {removing && (
          <div className="flex gap-4">
            <img src={removing.image.url} alt="" className="h-24 w-[72px] shrink-0 object-cover" />
            <p className="text-[14px]">
              Bạn có chắc muốn xoá <strong className="font-semibold">{removing.name}</strong> ({removing.colorName}, size {removing.size}) khỏi giỏ hàng?
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
