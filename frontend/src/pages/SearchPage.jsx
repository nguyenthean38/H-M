import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ProductListing } from '@/components/product/ProductListing'
import { ProductRail } from '@/components/product/ProductRail'
import { Breadcrumbs, Button } from '@/components/ui'
import { useProducts, useSuggestions } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const DEPTS = [
  { value: '', label: 'Tất cả' },
  { value: 'nu', label: 'Nữ' },
  { value: 'nam', label: 'Nam' },
  { value: 'tre-em', label: 'Trẻ em' },
  { value: 'nha', label: 'Nhà' },
  { value: 'lam-dep', label: 'Làm đẹp' },
]

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').trim()
  const dept = params.get('bo-phan') ?? ''
  const openSearch = useUI((s) => s.openSearch)
  const total = useProducts({ q, pageSize: 1 }, { enabled: Boolean(q) })
  const popular = useSuggestions('')
  const picks = useProducts({ category: 'ban-chay', pageSize: 12 }, { enabled: total.data?.total === 0 || !q })

  useEffect(() => {
    document.title = q ? `“${q}” — Tìm kiếm — Nếp` : 'Tìm kiếm — Nếp'
  }, [q])

  const noResults = total.data?.total === 0

  return (
    <div className="pb-8">
      <div className="ds-container pt-6 pb-6">
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Kết quả tìm kiếm' }]} />
        <p className="ds-eyebrow mt-6">Kết quả tìm kiếm</p>
        <h1 className="ds-h1 mt-1 break-words">{q ? `“${q}”` : 'Bạn đang tìm gì?'}</h1>
        {!q && (
          <Button variant="outline" icon={Search} className="mt-6" onClick={openSearch}>
            Mở ô tìm kiếm
          </Button>
        )}
        {q && !noResults && (
          <nav className="ds-scrollbar-none -mx-4 mt-6 flex gap-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" aria-label="Lọc theo bộ phận">
            {DEPTS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params)
                  if (d.value) next.set('bo-phan', d.value)
                  else next.delete('bo-phan')
                  next.delete('trang')
                  setParams(next, { preventScrollReset: true })
                }}
                className={cn('-mb-px shrink-0 border-b-2 pb-3 text-xs font-semibold tracking-[0.1em] uppercase', dept === d.value ? 'border-ink' : 'border-transparent text-subtle hover:text-ink')}
              >
                {d.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {q && noResults ? (
        <div className="ds-container">
          <p className="max-w-xl text-[15px] text-ink-2">Chúng tôi không tìm thấy sản phẩm nào cho “{q}”. Hãy thử một từ khoá khác, kiểm tra chính tả hoặc dùng từ chung hơn (ví dụ “áo”, “đầm”, “linen”).</p>
          <div className="mt-6">
            <p className="ds-label mb-3">Mọi người đang tìm</p>
            <ul className="flex flex-wrap gap-2">
              {(popular.data?.queries ?? []).map((s) => (
                <li key={s}>
                  <Link to={`/tim-kiem?q=${encodeURIComponent(s)}`} className="block border border-line-strong px-3 py-1.5 text-[13px] hover:border-ink hover:bg-ink hover:text-paper">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : q ? (
        <ProductListing key={`${q}|${dept}`} baseFilters={{ q, department: dept || undefined }} />
      ) : null}

      {(noResults || !q) && <ProductRail className="mt-16" title="Gợi ý cho bạn" products={picks.data?.items} loading={picks.isLoading} />}
    </div>
  )
}
