import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { CategoryTiles, ClubBand, DiptychHero, Marquee, RecycleBand, SplitFeature } from '@/components/home/Sections'
import { ProductRail } from '@/components/product/ProductRail'
import { Button } from '@/components/ui'
import { useIsLoggedIn } from '@/hooks/useAuth'
import { useProduct, useProducts } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'

const TILES = [
  { label: 'Đầm & váy liền', to: '/c/nu-dam', image: '/images/categories/nu-dam.jpg' },
  { label: 'Áo thun nam', to: '/c/nam-ao-thun', image: '/images/categories/nam-ao-thun.jpg' },
  { label: 'Quần & chân váy', to: '/c/nu-quan', image: '/images/categories/nu-quan.jpg' },
  { label: 'Sơ mi nam', to: '/c/nam-so-mi', image: '/images/categories/nam-so-mi.jpg' },
  { label: 'Áo khoác & blazer', to: '/c/nu-khoac', image: '/images/categories/nu-khoac.jpg' },
  { label: 'Trẻ em', to: '/tre-em', image: '/images/categories/tre-em.jpg' },
  { label: 'Phụ kiện', to: '/c/phu-kien', image: '/images/categories/phu-kien.jpg' },
  { label: 'Nhà & làm đẹp', to: '/nha', image: '/images/categories/nha.jpg' },
]

const LOOKS = [
  { title: 'Đi làm thứ Hai', q: 'blazer', image: '/images/campaign/editorial-1.jpg' },
  { title: 'Cà phê cuối tuần', q: 'linen', image: '/images/campaign/editorial-2.jpg' },
  { title: 'Về quê ngày nắng', q: 'đầm', image: '/images/campaign/editorial-3.jpg' },
]

export default function HomePage() {
  const loggedIn = useIsLoggedIn()
  const openAuth = useUI((s) => s.openAuth)
  const fresh = useProducts({ category: 'moi-ve', pageSize: 12 })
  const best = useProducts({ category: 'ban-chay', pageSize: 12 })
  const heroLook = useProduct('NP2401')

  useEffect(() => {
    document.title = 'Nếp — Mặc đẹp mỗi ngày'
  }, [])

  return (
    <div className="space-y-20 sm:space-y-28">
      <div>
        <DiptychHero
          images={['/images/campaign/hero-nu-1.jpg', '/images/campaign/hero-nu-2.jpg']}
          eyebrow="Bộ sưu tập Thu Đông 2026"
          title={
            <>
              Se lạnh, <em className="font-normal">mặc nhẹ</em>
            </>
          }
          subtitle="Da lộn, len gân và những lớp áo khoác mỏng — ấm vừa đủ cho đợt gió mùa đầu tiên."
          actions={
            <>
              <Button variant="light" to="/c/nu-moi-ve">
                Mua đồ nữ
              </Button>
              <Button variant="light" to="/c/nam-moi-ve">
                Mua đồ nam
              </Button>
            </>
          }
          hotspot={{ product: heroLook.data, x: 72, y: 50 }}
        />
        <Marquee items={['Len mùa gió', 'Cotton hữu cơ', 'Denim tái chế', 'Đổi cũ lấy mới', 'Miễn phí giao từ 499.000₫', 'Đổi trả 30 ngày']} />
      </div>

      <ProductRail eyebrow="Vừa lên kệ" title="Hàng mới về" products={fresh.data?.items} loading={fresh.isLoading} viewAllTo="/c/moi-ve" />

      <CategoryTiles title="Mua theo danh mục" items={TILES} />

      <SplitFeature
        image="/images/campaign/hero-nam-1.jpg"
        eyebrow="Nam · Đồ cơ bản"
        title="Ít món hơn, mặc được nhiều hơn"
        actions={
          <>
            <Button to="/c/nam-ao-thun">Áo thun & polo</Button>
            <Button variant="outline" to="/nam">
              Tất cả đồ nam
            </Button>
          </>
        }
      >
        <p>Áo thun cotton dày 220gsm, sơ mi linen và quần kaki co giãn nhẹ — những món phối được với nhau theo mọi cách.</p>
        <p className="text-[13px] text-muted">Mỗi sản phẩm đều có công cụ gợi ý size theo chiều cao & cân nặng, đo trên dáng người Việt.</p>
      </SplitFeature>

      <RecycleBand />

      <ProductRail eyebrow="Được mua nhiều nhất tuần này" title="Bán chạy" products={best.data?.items} loading={best.isLoading} viewAllTo="/c/ban-chay" />

      <section className="ds-container">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="ds-eyebrow mb-1">Gợi ý phối đồ</p>
            <h2 className="ds-h2">Mặc gì tuần này?</h2>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {LOOKS.map((l) => (
            <li key={l.title}>
              <Link to={`/tim-kiem?q=${encodeURIComponent(l.q)}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-paper-2">
                  <img src={l.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" />
                </div>
                <p className="mt-3 flex items-center justify-between font-display text-xl italic">
                  {l.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ClubBand loggedIn={loggedIn} onJoin={() => openAuth()} />

      <section className="ds-container">
        <Link to="/cua-hang" className="group relative block overflow-hidden bg-ink text-paper">
          <img src="/images/campaign/store.jpg" alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-55 transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
          <div className="relative flex min-h-64 flex-col justify-end p-8 sm:min-h-80 sm:p-12">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
              <MapPin className="size-4" /> 14 cửa hàng · 9 tỉnh thành
            </p>
            <p className="mt-3 max-w-xl ds-h1">Thử tận tay, nhận trong 2 giờ</p>
            <span className="mt-5 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
              Tìm cửa hàng gần bạn <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>
    </div>
  )
}
