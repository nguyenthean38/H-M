import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { Price, QuantityStepper } from '@/components/ui'
import { WishlistButton } from '@/components/product/ProductCard'
import { useUpdateCartItem } from '@/hooks/useCart'
import { useUI } from '@/store/ui'
import { formatPrice } from '@/utils/format'

/** Dựng object dạng "tóm tắt sản phẩm" từ dòng giỏ hàng để dùng chung nút yêu thích. */
const toSummary = (it) => ({
  id: it.productId,
  slug: it.slug,
  name: it.name,
  price: it.price,
  originalPrice: it.originalPrice,
  discountPercent: it.originalPrice ? Math.round((1 - it.price / it.originalPrice) * 100) : null,
  image: it.image,
  hoverImage: null,
  badges: [],
  colors: [{ code: it.colorCode, name: it.colorName, hex: '#ccc', image: it.image }],
})

export function CartItemRow({ item, onRemove }) {
  const update = useUpdateCartItem()
  const toast = useUI((s) => s.toast)
  const change = (quantity) => update.mutate({ id: item.id, quantity }, { onError: (e) => toast(e.message, 'error') })
  const href = `/p/${item.slug}?mau=${item.colorCode}`
  return (
    <li className="flex gap-4 border-b border-line py-5 first:pt-0 sm:gap-6">
      <Link to={href} className="block w-24 shrink-0 sm:w-32">
        <div className="aspect-[3/4] overflow-hidden bg-paper-2">
          <img src={item.image.url} alt={item.image.alt} className="size-full object-cover" loading="lazy" />
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={href} className="line-clamp-2 text-[14px] leading-snug hover:underline hover:underline-offset-2">
              {item.name}
            </Link>
            <Price price={item.price} originalPrice={item.originalPrice} className="mt-1" />
          </div>
          <WishlistButton product={toSummary(item)} className="-mt-2 -mr-2 shrink-0" />
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs text-muted">
          <dt>Mã hàng</dt>
          <dd className="text-ink-2">{item.articleNo}</dd>
          <dt>Màu</dt>
          <dd className="text-ink-2">{item.colorName}</dd>
          <dt>Size</dt>
          <dd className="text-ink-2">{item.size}</dd>
          <dt>Thành tiền</dt>
          <dd className="font-medium text-ink tabular-nums">{formatPrice(item.lineTotal)}</dd>
        </dl>
        {!item.inStock ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-son">
            <CircleAlert className="size-3.5" /> Lựa chọn này vừa hết hàng — vui lòng xoá hoặc chọn size khác.
          </p>
        ) : item.quantity > item.maxQuantity ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-son">
            <CircleAlert className="size-3.5" /> Chỉ còn {item.maxQuantity} sản phẩm, vui lòng giảm số lượng.
          </p>
        ) : item.maxQuantity <= 3 ? (
          <p className="mt-2 text-xs text-nghe">Chỉ còn {item.maxQuantity} sản phẩm</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            value={item.quantity}
            min={1}
            max={Math.max(item.quantity, item.maxQuantity)}
            onChange={change}
            onRemove={() => onRemove(item)}
            disabled={update.isPending}
          />
          <button type="button" onClick={() => onRemove(item)} className="text-xs text-muted underline underline-offset-4 hover:text-son">
            Xoá
          </button>
        </div>
      </div>
    </li>
  )
}
