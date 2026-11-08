import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Info, LocateFixed, MapPin, Minus, Phone, Plus, Search, X } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { StoreMap, directionsUrl } from '@/components/store-locator/StoreMap'
import { DEPARTMENT_LABELS, HoursTable, OpenPill, formatKm } from '@/components/store-locator/storeUtils'
import { useStores } from '@/hooks/useStores'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const AREAS = [
  { value: '', label: 'Tất cả' },
  { value: 'ha-noi', label: 'Hà Nội' },
  { value: 'ho-chi-minh', label: 'TP. Hồ Chí Minh' },
  { value: 'da-nang', label: 'Đà Nẵng' },
  { value: 'khac', label: 'Tỉnh khác' },
]
const MAIN = ['ha-noi', 'ho-chi-minh', 'da-nang']

function useDebounced(value, ms = 250) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

function Chip({ active, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn('h-8 shrink-0 border px-3 text-xs transition-colors', active ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-surface hover:border-ink')}
      {...rest}
    >
      {children}
    </button>
  )
}

function StoreItem({ store, index, open, active, onToggle, itemRef }) {
  return (
    <li ref={itemRef} className={cn('scroll-mt-40 border-b border-line transition-colors', active && 'bg-paper-2/70')}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 px-1 py-4 text-left">
        <span className={cn('ds-fold mt-0.5 flex size-6 shrink-0 items-center justify-center text-[11px] font-semibold text-paper', active ? 'bg-ink' : 'bg-cham')}>{index + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="ds-label block">{store.name}</span>
          <span className="mt-1 block text-[13px] text-ink-2">{store.address}</span>
          <span className="block text-[13px] text-ink-2">
            {store.ward}, {store.city}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <OpenPill store={store} />
            {store.distanceKm != null && <span className="text-xs text-muted">{formatKm(store.distanceKm)}</span>}
          </span>
        </span>
        {open ? <Minus className="mt-1 size-4 shrink-0" strokeWidth={1.5} /> : <Plus className="mt-1 size-4 shrink-0" strokeWidth={1.5} />}
      </button>
      {open && (
        <div className="animate-drop space-y-4 pr-1 pb-5 pl-10">
          <div>
            <p className="ds-eyebrow mb-1.5">Giờ mở cửa</p>
            <HoursTable store={store} />
          </div>
          <div>
            <p className="ds-eyebrow mb-1.5">Có tại cửa hàng</p>
            <p className="text-[13px]">{store.departments.map((d) => DEPARTMENT_LABELS[d]).join(' · ')}</p>
          </div>
          {store.services?.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {store.services.map((s) => (
                <li key={s} className="bg-cham-50 px-2 py-1 text-[11px] text-cham-600">
                  {s}
                </li>
              ))}
            </ul>
          )}
          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-[13px] hover:text-cham">
            <Phone className="size-4" strokeWidth={1.5} /> {store.phone}
          </a>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button to={`/cua-hang/${store.slug}`} variant="outline" size="sm" className="flex-1">
              Thông tin cửa hàng
            </Button>
            <Button href={directionsUrl(store)} target="_blank" rel="noreferrer" variant="link" className="justify-center px-3 text-2xs">
              Chỉ đường
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

export default function StoresPage() {
  const toast = useUI((s) => s.toast)
  const [q, setQ] = useState('')
  const [area, setArea] = useState('')
  const [department, setDepartment] = useState('')
  const [geo, setGeo] = useState(null)
  const [locating, setLocating] = useState(false)
  const [notice, setNotice] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [openId, setOpenId] = useState(null)
  const itemRefs = useRef({})
  const dq = useDebounced(q.trim())

  useEffect(() => {
    document.title = 'Tìm cửa hàng — Nếp'
  }, [])

  const params = useMemo(() => {
    const p = {}
    if (dq) p.q = dq
    if (MAIN.includes(area)) p.province = area
    if (department) p.department = department
    if (geo) Object.assign(p, geo)
    return p
  }, [dq, area, department, geo])
  const { data = [], isLoading, isFetching } = useStores(params)
  const stores = useMemo(() => (area === 'khac' ? data.filter((s) => !MAIN.includes(s.province)) : data), [data, area])

  const select = (id, { scroll } = {}) => {
    setActiveId(id)
    setOpenId(id)
    if (scroll) requestAnimationFrame(() => itemRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  const reset = () => {
    setQ('')
    setArea('')
    setDepartment('')
    setGeo(null)
  }

  const locate = () => {
    if (!navigator.geolocation) {
      toast('Trình duyệt của bạn không hỗ trợ định vị.', 'error')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        setArea('')
        setGeo({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) })
        toast('Đã sắp xếp cửa hàng theo khoảng cách gần bạn nhất.', 'success')
      },
      () => {
        setLocating(false)
        toast('Không lấy được vị trí. Hãy cho phép truy cập vị trí hoặc nhập tên thành phố.', 'error')
      },
      { timeout: 10000 },
    )
  }

  return (
    <div className="ds-container py-8 lg:py-10">
      <h1 className="ds-h1 mb-6">Tìm cửa hàng</h1>
      {notice && (
        <div className="mb-5 flex items-start gap-3 bg-paper-2 px-4 py-3 text-[13px] text-ink-2">
          <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
          <p className="flex-1">Hàng tại cửa hàng bán rất nhanh — tồn kho chỉ mang tính tham khảo, giá tại cửa hàng và online có thể khác nhau.</p>
          <button type="button" onClick={() => setNotice(false)} aria-label="Đóng thông báo" className="hover:opacity-60">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative isolate h-[45vh] min-h-[300px] overflow-hidden border border-line bg-paper-2 lg:sticky lg:top-[120px] lg:h-[calc(100dvh-160px)] lg:min-h-[520px]">
          <StoreMap stores={stores} activeId={activeId} onSelect={(id) => select(id, { scroll: true })} />
        </div>

        <section aria-label="Danh sách cửa hàng" className="min-w-0">
          <form onSubmit={(e) => e.preventDefault()} className="relative" role="search">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tên đường, phường hoặc thành phố"
              aria-label="Tìm cửa hàng"
              className="h-12 w-full border border-line-strong bg-surface pr-10 pl-10 text-[14px] outline-none placeholder:text-subtle focus:border-ink"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Xoá từ khoá" className="absolute top-1/2 right-3 -translate-y-1/2 hover:opacity-60">
                <X className="size-4" />
              </button>
            )}
          </form>

          <div className="ds-scrollbar-none mt-3 flex gap-2 overflow-x-auto">
            {AREAS.map((a) => (
              <Chip
                key={a.value}
                active={area === a.value && !geo}
                onClick={() => {
                  setGeo(null)
                  setArea(a.value)
                }}
              >
                {a.label}
              </Chip>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[13px]">
              <span className="text-muted">Bộ phận</span>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="h-9 border border-line-strong bg-surface px-2 text-[13px] outline-none focus:border-ink">
                <option value="">Tất cả</option>
                {Object.entries(DEPARTMENT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={locate} disabled={locating} className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4 hover:text-cham disabled:opacity-60">
              {locating ? <Spinner className="[&_svg]:size-4" /> : <LocateFixed className="size-4" strokeWidth={1.5} />}
              Dùng vị trí của tôi
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between border-b border-ink pb-2">
            <p className="text-[13px]" aria-live="polite">
              <strong>{stores.length}</strong> cửa hàng{geo && ' · gần bạn nhất'}
            </p>
            {isFetching && <Spinner className="[&_svg]:size-4" />}
          </div>

          {isLoading ? (
            <div className="py-16 text-center">
              <Spinner />
            </div>
          ) : stores.length === 0 ? (
            <div className="py-14 text-center">
              <MapPin className="mx-auto mb-3 size-8 text-cham" strokeWidth={1.25} />
              <p className="ds-label">Rất tiếc</p>
              <p className="mx-auto mt-2 max-w-xs text-[13px] text-muted">Không tìm thấy cửa hàng nào ở khu vực này. Hãy thử tìm một thành phố khác hoặc xem tất cả cửa hàng.</p>
              <Button variant="outline" size="sm" className="mt-5" onClick={reset}>
                Xem tất cả cửa hàng
              </Button>
            </div>
          ) : (
            <ul>
              {stores.map((s, i) => (
                <StoreItem
                  key={s.id}
                  store={s}
                  index={i}
                  active={s.id === activeId}
                  open={s.id === openId}
                  itemRef={(el) => (itemRefs.current[s.id] = el)}
                  onToggle={() => (openId === s.id ? setOpenId(null) : select(s.id))}
                />
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-muted">
            Muốn nhận hàng đặt online tại cửa hàng? Chọn <strong>Nhận tại cửa hàng</strong> khi thanh toán — miễn phí, giữ hàng 7 ngày.{' '}
            <Link to="/thong-tin/giao-hang" className="underline underline-offset-2">
              Tìm hiểu thêm
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
