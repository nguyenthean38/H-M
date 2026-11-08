import { Link } from 'react-router-dom'
import { MapPin, Truck } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { brand } from '@/config/brand'
import { provinceName } from '@/config/locations'
import { footerColumns } from '@/config/navigation'
import { useUI } from '@/store/ui'

const PAYMENTS = ['COD', 'Visa', 'Mastercard', 'JCB', 'Napas', 'MoMo', 'ZaloPay', 'VietQR']
const SOCIALS = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Zalo']

export function Footer() {
  const province = useUI((s) => s.province)
  const openLocation = useUI((s) => s.openLocation)
  return (
    <footer className="mt-24 border-t border-line bg-paper-2">
      <div className="ds-container grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm font-display text-2xl leading-snug italic">Quần áo tử tế cho những ngày bình thường.</p>
          <div className="mt-6 space-y-2 text-[13px] text-ink-2">
            <p>
              Hotline <a href="tel:18006868" className="font-semibold text-ink">{brand.hotline}</a> · {brand.hotlineHours}
            </p>
            <p>
              Email <span className="text-ink">{brand.email}</span>
            </p>
          </div>
          <Link to="/dang-ky-nhan-tin" className="mt-6 inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-semibold tracking-[0.12em] uppercase hover:text-cham">
            Đăng ký bản tin — nhận ưu đãi 10%
          </Link>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <p className="ds-label mb-4">{col.title}</p>
            <ul className="space-y-2.5 text-[13px] text-ink-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-ink hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2">
          <p className="ds-label mb-4">Thành viên</p>
          <p className="text-[13px] text-ink-2">Tham gia Nếp Club miễn phí: tích điểm mỗi đơn, quà sinh nhật, mua sớm bộ sưu tập mới.</p>
          <Link to="/nep-club" className="mt-3 inline-block text-[13px] font-medium underline underline-offset-4 hover:text-cham">
            Tìm hiểu thêm
          </Link>
        </div>
      </div>

      <div className="ds-container flex flex-col gap-6 border-t border-line py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px]">
          <button type="button" onClick={openLocation} className="flex items-center gap-2 hover:text-cham">
            <Truck className="size-4" strokeWidth={1.5} />
            Giao đến: <span className="font-semibold">{provinceName(province)}</span>
            <span className="underline underline-offset-4">Thay đổi</span>
          </button>
          <Link to="/cua-hang" className="flex items-center gap-2 hover:text-cham">
            <MapPin className="size-4" strokeWidth={1.5} /> 14 cửa hàng trên toàn quốc
          </Link>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted" aria-label="Mạng xã hội">
          {SOCIALS.map((s) => (
            <li key={s}>
              <span className="cursor-default">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ds-container border-t border-line py-6">
        <p className="ds-eyebrow mb-3">Thanh toán</p>
        <ul className="flex flex-wrap gap-2" aria-label="Phương thức thanh toán">
          {PAYMENTS.map((p) => (
            <li key={p} className="border border-line-strong bg-surface px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink-2">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-4xl text-xs leading-relaxed text-muted">
          © 2026 Nếp. Đây là dự án demo giao diện do{' '}
          <a href={brand.maker.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
            {brand.maker.name}
          </a>{' '}
          thiết kế và lập trình. Thương hiệu, sản phẩm, cửa hàng, giá và đơn hàng đều là dữ liệu mô phỏng; không có giao dịch thật nào được xử lý. Ảnh minh hoạ thuộc giấy phép CC0 (StockSnap).
        </p>
      </div>
    </footer>
  )
}
