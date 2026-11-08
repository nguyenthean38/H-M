import { useEffect } from 'react'
import { CategoryTiles, DiptychHero } from '@/components/home/Sections'
import { ProductListing } from '@/components/product/ProductListing'
import { ProductRail } from '@/components/product/ProductRail'
import { Button } from '@/components/ui'
import { useDepartments, useProducts } from '@/hooks/useCatalog'

/** Nội dung biên tập cho từng bộ phận (CMS sau này). */
const COPY = {
  nu: { eyebrow: 'Nữ · Thu Đông 2026', title: 'Thả lỏng mà vẫn chỉn chu', subtitle: 'Áo khoác da lộn, đồ len gân và quần ống rộng cho cả tuần làm việc lẫn cuối tuần.', images: ['/images/campaign/hero-nu-1.jpg', '/images/campaign/hero-nu-2.jpg'] },
  nam: { eyebrow: 'Nam · Đồ cơ bản', title: 'Mặc lại mỗi ngày, không chán', subtitle: 'Áo thun dày dặn, sơ mi linen, quần kaki co giãn — tủ đồ gọn nhưng đủ.', images: ['/images/campaign/hero-nam-1.jpg', '/images/campaign/hero-nam-2.jpg'] },
  'tre-em': { eyebrow: 'Trẻ em', title: 'Chạy nhảy cả ngày', subtitle: 'Cotton hữu cơ mềm, đường may phẳng không cọ da, dễ giặt dễ phơi.', images: ['/images/campaign/hero-tre-em.jpg', '/images/categories/tre-em.jpg'] },
  nha: { eyebrow: 'Nhà', title: 'Góc nhà dịu mắt', subtitle: 'Vải linen, gốm men tro và nến sáp đậu nành cho căn phòng chậm lại một nhịp.', images: ['/images/campaign/hero-nha.jpg', '/images/categories/nha.jpg'] },
  'lam-dep': { eyebrow: 'Làm đẹp', title: 'Da khoẻ mỗi sáng', subtitle: 'Chăm sóc da tối giản, hương thơm nhẹ, bao bì có thể nạp lại.', images: ['/images/campaign/hero-lam-dep.jpg', '/images/categories/lam-dep.jpg'] },
}

export default function DepartmentPage({ department }) {
  const copy = COPY[department]
  const { data: departments } = useDepartments()
  const dep = departments?.find((d) => d.slug === department)
  const fresh = useProducts({ department, badge: 'moi', pageSize: 12 })
  const sale = useProducts({ department, sale: 'true', pageSize: 12 })

  useEffect(() => {
    document.title = `${dep?.name ?? 'Nếp'} — Nếp`
  }, [dep])

  const tiles = (dep?.categories ?? []).map((c) => ({ label: c.name, to: `/c/${c.slug}`, image: c.image }))

  return (
    <div className="space-y-16 sm:space-y-24">
      <DiptychHero
        images={copy.images}
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          <Button variant="light" onClick={() => document.getElementById('tat-ca')?.scrollIntoView({ behavior: 'smooth' })}>
            Xem tất cả sản phẩm
          </Button>
        }
      />
      {tiles.length > 1 && <CategoryTiles title="Danh mục" items={tiles} />}
      <ProductRail title="Hàng mới về" products={fresh.data?.items} loading={fresh.isLoading} viewAllTo={['nu', 'nam'].includes(department) ? `/c/${department}-moi-ve` : undefined} />
      <ProductRail title="Đang giảm giá" products={sale.data?.items} loading={sale.isLoading} viewAllTo={['nu', 'nam'].includes(department) ? `/c/${department}-sale` : '/c/sale'} />
      <section id="tat-ca" className="scroll-mt-28">
        <div className="ds-container mb-2">
          <h2 className="ds-h2">Tất cả {dep?.name.toLowerCase() ?? ''}</h2>
        </div>
        <ProductListing baseFilters={{ department }} />
      </section>
    </div>
  )
}
