import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

/**
 * Bảng tổng tiền dùng chung cho giỏ hàng, thanh toán và xác nhận đơn.
 * `shipping` cho phép ghi đè phí giao (ví dụ theo phương thức đang chọn ở trang thanh toán).
 */
export function OrderTotals({ totals, shipping = totals.shipping, shippingLabel = 'Phí giao hàng dự kiến', promo, className, totalLabel = 'Tổng cộng' }) {
  const total = Math.max(0, totals.subtotal - totals.promoDiscount) + shipping
  return (
    <dl className={cn('space-y-2 text-[13px]', className)}>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-2">Giá trị đơn hàng</dt>
        <dd className="tabular-nums">{formatPrice(totals.orderValue)}</dd>
      </div>
      {totals.saleDiscount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-ink-2">Giảm giá</dt>
          <dd className="text-son tabular-nums">−{formatPrice(totals.saleDiscount)}</dd>
        </div>
      )}
      {totals.promoDiscount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-ink-2">Mã giảm giá{promo?.code ? ` (${promo.code})` : ''}</dt>
          <dd className="text-son tabular-nums">−{formatPrice(totals.promoDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-ink-2">{shippingLabel}</dt>
        <dd className={cn('tabular-nums', shipping === 0 && 'font-medium text-la')}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <dt className="ds-label">{totalLabel}</dt>
        <dd className="text-lg font-semibold tabular-nums">{formatPrice(total)}</dd>
      </div>
      <p className="text-right text-[11px] text-muted">Đã bao gồm VAT</p>
    </dl>
  )
}

export const orderTotal = (totals, shipping = totals.shipping) => Math.max(0, totals.subtotal - totals.promoDiscount) + shipping
