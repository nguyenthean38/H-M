import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, Search, TrendingUp, X } from 'lucide-react'
import { Price } from '@/components/ui'
import { useSuggestions } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { storage } from '@/utils/storage'

const RECENT_KEY = 'nep.recentSearches'

function useDebounced(value, ms = 200) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

/** Highlight phần khớp trong gợi ý. */
function Mark({ text, q }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (!q || i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold">{text.slice(i, i + q.length)}</strong>
      {text.slice(i + q.length)}
    </>
  )
}

export function SearchPanel() {
  const open = useUI((s) => s.searchOpen)
  const close = useUI((s) => s.closeSearch)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState(() => storage.get(RECENT_KEY, []))
  const dq = useDebounced(q.trim())
  const { data, isFetching } = useSuggestions(dq)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => inputRef.current?.focus())
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  if (!open) return null

  const go = (term) => {
    const t = term.trim()
    if (!t) return
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 6)
    setRecent(next)
    storage.set(RECENT_KEY, next)
    close()
    setQ('')
    navigate(`/tim-kiem?q=${encodeURIComponent(t)}`)
  }

  return createPortal(
    <div className="fixed inset-0 z-[65]" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={close} aria-hidden />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[520px] animate-slide-in-right flex-col bg-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            go(q)
          }}
          className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5"
          role="search"
        >
          <Search className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm áo thun, đầm linen, màu chàm…"
            className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-subtle"
            aria-label="Từ khoá tìm kiếm"
            enterKeyHint="search"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} className="text-xs font-medium underline underline-offset-4">
              Xoá
            </button>
          )}
          <button type="button" onClick={close} aria-label="Đóng tìm kiếm" className="hover:opacity-60">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {!dq ? (
            <div className="space-y-8">
              {recent.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="ds-label">Tìm gần đây</h3>
                    <button
                      type="button"
                      className="text-xs text-muted underline underline-offset-4"
                      onClick={() => {
                        setRecent([])
                        storage.remove(RECENT_KEY)
                      }}
                    >
                      Xoá lịch sử
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {recent.map((r) => (
                      <li key={r}>
                        <button type="button" onClick={() => go(r)} className="flex w-full items-center gap-3 py-1.5 text-left text-[14px] hover:text-cham">
                          <Clock className="size-4 text-subtle" strokeWidth={1.5} /> {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <h3 className="ds-label mb-3">Mọi người đang tìm</h3>
                <ul className="flex flex-wrap gap-2">
                  {(data?.queries ?? []).map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => go(s)} className="flex items-center gap-1.5 border border-line-strong px-3 py-1.5 text-[13px] transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                        <TrendingUp className="size-3.5" strokeWidth={1.5} /> {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
              {data?.queries?.length > 0 && (
                <ul className="mb-6 space-y-1">
                  {data.queries.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => go(s)} className="block w-full py-1.5 text-left text-[15px] hover:text-cham">
                        <Mark text={s} q={dq} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {data?.categories?.length > 0 && (
                <section className="mb-6">
                  <h3 className="ds-label mb-2">Danh mục</h3>
                  <ul className="space-y-1">
                    {data.categories.map((c) => (
                      <li key={c.slug}>
                        <Link to={`/c/${c.slug}`} onClick={close} className="block py-1 text-[14px] hover:text-cham">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {data?.products?.length > 0 && (
                <section>
                  <h3 className="ds-label mb-3">Sản phẩm</h3>
                  <ul className="grid grid-cols-2 gap-4">
                    {data.products.map((p) => (
                      <li key={p.id}>
                        <Link to={`/p/${p.slug}`} onClick={close} className="group block">
                          <div className="aspect-[3/4] overflow-hidden bg-paper-2">
                            <img src={p.image.url} alt={p.image.alt} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                          </div>
                          <p className="mt-2 line-clamp-1 text-[13px]">{p.name}</p>
                          <Price price={p.price} originalPrice={p.originalPrice} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => go(q)} className="mt-6 text-xs font-semibold tracking-[0.12em] uppercase underline underline-offset-4">
                    Xem tất cả kết quả cho “{q.trim()}”
                  </button>
                </section>
              )}
              {data && !data.queries?.length && !data.products?.length && !data.categories?.length && (
                <p className="text-[14px] text-muted">
                  Không có gợi ý cho “{dq}”. Nhấn Enter để tìm trong toàn bộ cửa hàng.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
