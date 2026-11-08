import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Baby, Clock, Footprints, MapPin, Package, Phone, Recycle, Ruler, Scissors, Shirt, Sparkles, Store, Users } from 'lucide-react'
import { Breadcrumbs, Button, EmptyState, PageLoader } from '@/components/ui'
import { StoreMap, directionsUrl } from '@/components/store-locator/StoreMap'
import { DEPARTMENT_LABELS, HoursTable, OpenPill, formatKm } from '@/components/store-locator/storeUtils'
import { useStore } from '@/hooks/useStores'

const SERVICE_ICON = [
  [/thu gom/i, Recycle],
  [/sửa đồ/i, Scissors],
  [/phòng thử/i, Ruler],
  [/nhận hàng/i, Package],
  [/sinh viên/i, Users],
  [/workshop|nhuộm/i, Sparkles],
  [/phối đồ/i, Shirt],
  [/trẻ em|vui chơi/i, Baby],
]
const iconFor = (s) => SERVICE_ICON.find(([re]) => re.test(s))?.[1] ?? Footprints

export default function StoreDetailPage() {
  const { slug } = useParams()
  const { data: store, isLoading, isError } = useStore(slug)

  useEffect(() => {
    if (store) document.title = `${store.name} — Nếp`
  }, [store])

  if (isLoading) return <PageLoader />
  if (isError || !store)
    return (
      <EmptyState icon={Store} title="Không tìm thấy cửa hàng" action={<Button to="/cua-hang">Xem tất cả cửa hàng</Button>}>
        Cửa hàng này không tồn tại hoặc đã đóng cửa. Hãy xem danh sách cửa hàng Nếp trên toàn quốc.
      </EmptyState>
    )

  return (
    <div className="ds-container py-8 lg:py-10">
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tìm cửa hàng', href: '/cua-hang' },
          { label: store.name, href: null },
        ]}
      />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {store.flagship && <p className="ds-eyebrow mb-2 text-cham">Cửa hàng chính · {store.city}</p>}
          <h1 className="ds-h1">{store.name}</h1>
        </div>
        <OpenPill store={store} className="text-[13px]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="relative isolate h-[45vh] min-h-[320px] overflow-hidden border border-line bg-paper-2 lg:h-[560px]">
          <StoreMap stores={[store]} activeId={store.id} zoom={15} />
        </div>

        <aside className="space-y-7">
          <section>
            <h2 className="ds-label mb-2 flex items-center gap-2">
              <MapPin className="size-4" strokeWidth={1.5} /> Địa chỉ
            </h2>
            <p className="text-[14px]">{store.address}</p>
            <p className="text-[14px]">
              {store.ward}, {store.city}
            </p>
            <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="mt-2 inline-flex items-center gap-2 text-[13px] hover:text-cham">
              <Phone className="size-4" strokeWidth={1.5} /> {store.phone}
            </a>
          </section>

          <section>
            <h2 className="ds-label mb-2">Có tại cửa hàng</h2>
            <p className="text-[14px]">{store.departments.map((d) => DEPARTMENT_LABELS[d]).join(' · ')}</p>
          </section>

          <section>
            <h2 className="ds-label mb-2 flex items-center gap-2">
              <Clock className="size-4" strokeWidth={1.5} /> Giờ mở cửa
            </h2>
            <HoursTable store={store} />
            <p className="mt-2 text-xs text-muted">Giờ mở cửa ngày lễ, Tết có thể thay đổi.</p>
          </section>

          {store.services?.length > 0 && (
            <section>
              <h2 className="ds-label mb-3">Dịch vụ</h2>
              <ul className="space-y-2.5">
                {store.services.map((s) => {
                  const Icon = iconFor(s)
                  return (
                    <li key={s} className="flex items-center gap-3 text-[14px]">
                      <span className="flex size-8 items-center justify-center bg-cham-50 text-cham">
                        <Icon className="size-4" strokeWidth={1.5} />
                      </span>
                      {s}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <div className="flex flex-col gap-2">
            <Button href={directionsUrl(store)} target="_blank" rel="noreferrer" block>
              Chỉ đường
            </Button>
            <Button to="/cua-hang" variant="outline" block>
              Xem cửa hàng khác
            </Button>
          </div>
        </aside>
      </div>

      <section className="mt-14 grid items-center gap-8 md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden bg-paper-2">
          <img src="/images/campaign/store.jpg" alt={`Không gian cửa hàng ${store.name}`} className="size-full object-cover" loading="lazy" />
        </div>
        <div>
          <p className="ds-eyebrow mb-2">Ghé thăm chúng tôi</p>
          <h2 className="ds-h2">Thử đồ thoải mái, đổi trả tận nơi</h2>
          <p className="mt-4 max-w-md text-[14px] text-ink-2">
            Đặt hàng online và nhận miễn phí tại {store.name}, đổi size ngay tại quầy, hoặc mang theo quần áo cũ để tham gia chương trình Đổi cũ lấy mới.
          </p>
          <Link to="/doi-cu-lay-moi" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase underline underline-offset-4 hover:text-cham">
            Tìm hiểu Đổi cũ lấy mới <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {store.nearby?.length > 0 && (
        <section className="mt-14">
          <h2 className="ds-h2 mb-5">Cửa hàng gần đây</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {store.nearby.map((s) => (
              <li key={s.id}>
                <Link to={`/cua-hang/${s.slug}`} className="block h-full border border-line bg-surface p-5 transition-colors hover:border-ink">
                  <p className="ds-label">{s.name}</p>
                  <p className="mt-2 text-[13px] text-ink-2">{s.fullAddress}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <OpenPill store={s} />
                    <span className="text-xs text-muted">{formatKm(s.distanceKm)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
