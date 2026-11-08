import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Lock } from 'lucide-react'
import { OrderTotals } from '@/components/cart/OrderTotals'
import { PromoCodeBox } from '@/components/cart/PromoCodeBox'
import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

function ItemList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((it) => (
        <li key={it.id} className="flex gap-3">
          <div className="relative w-16 shrink-0">
            <img src={it.image.url} alt={it.image.alt} className="aspect-[3/4] w-full object-cover" loading="lazy" />
            {it.quantity > 1 && <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-paper">{it.quantity}</span>}
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <p className="line-clamp-2 text-[13px] leading-snug">{it.name}</p>
            <p className="mt-1 text-muted">
              {it.colorName} · Size {it.size} · SL {it.quantity}
            </p>
          </div>
          <p className="text-[13px] font-medium tabular-nums">{formatPrice(it.lineTotal)}</p>
        </li>
      ))}
    </ul>
  )
}

/** Cột tóm tắt bên phải trang thanh toán. Nút "Đặt hàng" là submit của form ngoài. */
export function CheckoutSummary({ cart, shipping, submitting, formError }) {
  const [showItems, setShowItems] = useState(true)
  return (
    <div className="space-y-5 bg-surface p-6">
      <div>
        <button type="button" onClick={() => setShowItems((s) => !s)} className="flex w-full items-center justify-between" aria-expanded={showItems}>
          <span className="ds-label">Đơn hàng ({cart.count} sản phẩm)</span>
          <ChevronDown className={cn('size-4 transition-transform', showItems && 'rotate-180')} />
        </button>
        {showItems && (
          <div className="mt-4 max-h-80 overflow-y-auto pr-1">
            <ItemList items={cart.items} />
          </div>
        )}
        <Link to="/gio-hang" className="mt-3 inline-block text-xs underline underline-offset-4 hover:text-cham">
          Chỉnh sửa giỏ hàng
        </Link>
      </div>
      <PromoCodeBox cart={cart} />
      <OrderTotals totals={cart.totals} shipping={shipping ?? cart.totals.shipping} shippingLabel="Phí giao hàng" promo={cart.promo} />
      {formError && <p className="bg-son-50 px-3 py-2 text-xs text-son">{formError}</p>}
      <Button type="submit" block size="lg" loading={submitting} className="hidden lg:inline-flex">
        Đặt hàng
      </Button>
      <p className="text-xs leading-relaxed text-muted">
        Bằng việc đặt hàng, bạn đồng ý với{' '}
        <Link to="/thong-tin/dieu-khoan" className="underline">
          Điều khoản sử dụng
        </Link>{' '}
        và{' '}
        <Link to="/thong-tin/bao-mat" className="underline">
          Chính sách bảo mật
        </Link>{' '}
        của Nếp. Thông tin của bạn chỉ dùng để xử lý đơn hàng.
      </p>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Lock className="size-3.5" /> Thanh toán được mã hoá và bảo mật.
      </p>
      <p className="text-xs text-muted">
        Cần hỗ trợ? Xem{' '}
        <Link to="/thong-tin/giao-hang" className="underline">
          Giao hàng
        </Link>{' '}
        và{' '}
        <Link to="/thong-tin/doi-tra" className="underline">
          Đổi trả
        </Link>
        .
      </p>
    </div>
  )
}
