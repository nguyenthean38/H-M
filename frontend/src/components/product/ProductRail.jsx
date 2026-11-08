import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { cn } from '@/utils/cn'

/** Dải sản phẩm cuộn ngang có nút trái/phải (Sản phẩm tương tự, Hàng mới về...). */
export function ProductRail({ title, eyebrow, products = [], loading, viewAllTo, className }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  if (!loading && !products.length) return null
  return (
    <section className={cn('ds-container', className)}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="ds-eyebrow mb-1">{eyebrow}</p>}
          <h2 className="ds-h2">{title}</h2>
        </div>
        <div className="flex items-center gap-1">
          {viewAllTo && (
            <Link to={viewAllTo} className="mr-3 hidden items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase hover:text-cham sm:flex">
              Xem tất cả <ArrowRight className="size-3.5" />
            </Link>
          )}
          <button type="button" onClick={() => scroll(-1)} aria-label="Cuộn sang trái" className="flex size-9 items-center justify-center border border-line-strong hover:border-ink">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Cuộn sang phải" className="flex size-9 items-center justify-center border border-line-strong hover:border-ink">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <ul ref={ref} className="ds-scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0">
        {(loading ? Array.from({ length: 6 }) : products).map((p, i) => (
          <li key={p?.id ?? i} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-5*1rem)/6)]">
            {loading ? <ProductCardSkeleton /> : <ProductCard product={p} />}
          </li>
        ))}
      </ul>
    </section>
  )
}
