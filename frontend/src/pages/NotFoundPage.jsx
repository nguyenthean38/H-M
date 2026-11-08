import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Không tìm thấy trang — Nếp'
  }, [])
  return (
    <div className="ds-container grid min-h-[60vh] items-center gap-10 py-16 lg:grid-cols-2">
      <div>
        <p className="font-display text-[clamp(6rem,18vw,12rem)] leading-none text-cham italic">404</p>
        <h1 className="ds-h1 mt-4">Trang này đã bị “gấp” lại mất rồi</h1>
        <p className="mt-4 max-w-md text-[15px] text-ink-2">Đường dẫn có thể đã thay đổi hoặc sản phẩm đã ngừng kinh doanh. Thử bắt đầu lại từ một trong những nơi dưới đây.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/">Về trang chủ</Button>
          <Button variant="outline" to="/c/moi-ve">
            Hàng mới về
          </Button>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-3 text-[15px]">
        {[
          ['Nữ', '/nu'],
          ['Nam', '/nam'],
          ['Trẻ em', '/tre-em'],
          ['Sale', '/c/sale'],
          ['Tìm cửa hàng', '/cua-hang'],
          ['Trợ giúp', '/thong-tin/tro-giup'],
        ].map(([l, to]) => (
          <li key={to}>
            <Link to={to} className="block border border-line-strong px-4 py-5 font-display text-xl transition-colors hover:border-ink hover:bg-ink hover:text-paper">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
