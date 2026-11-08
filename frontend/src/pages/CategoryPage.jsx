import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ProductListing } from '@/components/product/ProductListing'
import { Breadcrumbs, Button, EmptyState } from '@/components/ui'
import { useCategory } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'

const chip = 'shrink-0 border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors'

export default function CategoryPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const { data: cat, error } = useCategory(slug)
  const activeType = params.get('type')

  useEffect(() => {
    if (cat) document.title = `${cat.title} — Nếp`
  }, [cat])

  if (error) {
    return (
      <EmptyState title="Không tìm thấy danh mục" action={<Button to="/">Về trang chủ</Button>}>
        Danh mục này không tồn tại hoặc đã được đổi tên.
      </EmptyState>
    )
  }

  const setType = (t) => {
    const next = new URLSearchParams(params)
    if (t) next.set('type', t)
    else next.delete('type')
    next.delete('trang')
    setParams(next, { preventScrollReset: true })
  }

  return (
    <div className="pb-8">
      <div className="ds-container pt-6 pb-6">
        {cat ? <Breadcrumbs items={cat.breadcrumbs} /> : <div className="ds-skeleton h-4 w-40" />}
        {cat ? <h1 className="ds-h1 mt-5">{cat.title}</h1> : <div className="ds-skeleton mt-5 h-12 w-72" />}
        {cat?.types?.length > 1 && (
          <nav aria-label="Loại sản phẩm" className="ds-scrollbar-none -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <button type="button" onClick={() => setType(null)} className={cn(chip, !activeType ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}>
              Tất cả
            </button>
            {cat.types.map((t) => (
              <button key={t.value} type="button" onClick={() => setType(t.value)} className={cn(chip, activeType === t.value ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}>
                {t.label}
              </button>
            ))}
          </nav>
        )}
        {cat?.siblings?.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
            {cat.siblings.map((s) => (
              <li key={s.slug}>
                <Link to={`/c/${s.slug}`} className={cn('hover:text-ink hover:underline hover:underline-offset-4', s.slug === slug && 'font-semibold text-ink underline underline-offset-4')}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ProductListing key={slug} baseFilters={{ category: slug }} />
    </div>
  )
}
