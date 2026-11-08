import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { Button, Price } from '@/components/ui'
import { useUI } from '@/store/ui'
import { formatPrice } from '@/utils/format'

/** Thẻ nhỏ thả xuống dưới biểu tượng giỏ hàng sau khi thêm sản phẩm; tự ẩn sau vài giây. */
export function AddedToBag() {
  const payload = useUI((s) => s.addedToBag)
  const hide = useUI((s) => s.hideAddedToBag)
  const navigate = useNavigate()
  useEffect(() => {
    if (!payload) return
    const t = setTimeout(hide, 6000)
    return () => clearTimeout(t)
  }, [payload, hide])
  if (!payload) return null
  const { item, cart } = payload
  return (
    <div className="fixed top-[108px] right-3 z-[55] w-[min(360px,calc(100vw-24px))] animate-drop border border-line bg-surface p-4 shadow-[0_20px_40px_-20px_rgba(27,26,23,0.35)] sm:right-6" role="status" aria-live="polite">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[13px] font-semibold">
          <Check className="size-4 text-la" /> Đã thêm vào giỏ hàng
        </p>
        <button type="button" onClick={hide} aria-label="Đóng" className="hover:opacity-60">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex gap-3">
        <img src={item.image.url} alt={item.image.alt} className="h-24 w-[72px] shrink-0 object-cover" />
        <div className="min-w-0 text-[13px]">
          <p className="line-clamp-2 leading-snug">{item.name}</p>
          <Price price={item.price} originalPrice={item.originalPrice} className="mt-1" />
          <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 text-xs text-muted">
            <dt>Màu</dt>
            <dd className="text-ink-2">{item.colorName}</dd>
            <dt>Size</dt>
            <dd className="text-ink-2">{item.size}</dd>
            <dt>Số lượng</dt>
            <dd className="text-ink-2">{item.quantity}</dd>
          </dl>
        </div>
      </div>
      {cart.freeShippingRemaining > 0 ? (
        <p className="mt-3 bg-paper-2 px-3 py-2 text-xs">
          Mua thêm <strong>{formatPrice(cart.freeShippingRemaining)}</strong> để được miễn phí giao hàng.
        </p>
      ) : (
        <p className="mt-3 bg-la-50 px-3 py-2 text-xs text-la">Đơn hàng của bạn được miễn phí giao hàng.</p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            hide()
            navigate('/gio-hang')
          }}
        >
          Xem giỏ ({cart.count})
        </Button>
        <Button
          size="sm"
          onClick={() => {
            hide()
            navigate('/thanh-toan')
          }}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  )
}
