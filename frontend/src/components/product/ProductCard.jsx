import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Badge, BADGE_LABELS, Price, Swatch } from '@/components/ui'
import { useWishlistToggle } from '@/hooks/useWishlist'
import { cn } from '@/utils/cn'

/** Nút tim lưu yêu thích (dùng trên thẻ sản phẩm và trang chi tiết). */
export function WishlistButton({ product, className, size = 'sm' }) {
  const [saved, toggle] = useWishlistToggle(product)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      aria-pressed={saved}
      aria-label={saved ? `Bỏ ${product.name} khỏi yêu thích` : `Lưu ${product.name} vào yêu thích`}
      className={cn('flex items-center justify-center transition-transform active:scale-90', size === 'sm' ? 'size-9' : 'size-11', className)}
    >
      <Heart className={cn(size === 'sm' ? 'size-[18px]' : 'size-5', saved ? 'fill-son text-son' : 'text-ink')} strokeWidth={1.5} />
    </button>
  )
}

export function ProductCard({ product, className, priority = false, sizes }) {
  const [colorIdx, setColorIdx] = useState(0)
  const color = product.colors[colorIdx]
  const image = colorIdx === 0 ? product.image : color.image
  const hover = colorIdx === 0 ? product.hoverImage : null
  const href = `/p/${product.slug}${colorIdx ? `?mau=${color.code}` : ''}`
  const tag = product.badges.find((b) => b === 'moi' || b === 'ban-chay')
  return (
    <article className={cn('group relative', className)}>
      <Link to={href} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
          <img
            src={image.url}
            alt={image.alt}
            loading={priority ? 'eager' : 'lazy'}
            sizes={sizes}
            className={cn('size-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02]', hover && 'group-hover:opacity-0')}
          />
          {hover && <img src={hover.url} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
          <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
            {product.discountPercent ? <Badge tone="sale">-{product.discountPercent}%</Badge> : null}
            {tag && <Badge tone={tag === 'moi' ? 'moi' : 'ban-chay'}>{BADGE_LABELS[tag]}</Badge>}
          </div>
        </div>
      </Link>
      <WishlistButton product={product} className="absolute top-1 right-1 bg-paper/0 hover:bg-paper/70" />
      <div className="mt-3 space-y-1 pr-2">
        <Link to={href} className="line-clamp-2 text-[13px] leading-snug hover:underline hover:underline-offset-2">
          {product.name}
        </Link>
        <Price price={product.price} originalPrice={product.originalPrice} />
        {product.badges.includes('ben-vung') && <p className="text-[11px] text-la">Chất liệu bền vững hơn</p>}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 5).map((c, i) => (
              <button
                key={c.code}
                type="button"
                onMouseEnter={() => setColorIdx(i)}
                onFocus={() => setColorIdx(i)}
                onClick={() => setColorIdx(i)}
                aria-label={`Màu ${c.name}`}
                className={cn('flex size-[18px] items-center justify-center rounded-full ring-1 ring-transparent transition', i === colorIdx && 'ring-ink')}
              >
                <Swatch hex={c.hex} size={10} />
              </button>
            ))}
            {product.colors.length > 5 && <span className="text-[11px] text-muted">+{product.colors.length - 5}</span>}
          </div>
        )}
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="ds-skeleton aspect-[3/4]" />
      <div className="ds-skeleton mt-3 h-3 w-3/4" />
      <div className="ds-skeleton mt-2 h-3 w-1/3" />
    </div>
  )
}

/** Lưới sản phẩm chuẩn: 2 cột trên điện thoại, 4 cột trên desktop. */
export function ProductGrid({ products, loading, count = 8, className }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4', className)}>
      {loading
        ? Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))
        : products.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i < 4} sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
    </ul>
  )
}
