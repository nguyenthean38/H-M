import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { IconButton } from '@/components/ui'
import { announcements, mainNav } from '@/config/navigation'
import { useCart } from '@/hooks/useCart'
import { useMe } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

function AnnouncementBar() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % announcements.length), 5000)
    return () => clearInterval(t)
  }, [])
  const a = announcements[i]
  return (
    <div className="bg-cham text-paper">
      <div className="ds-container flex h-9 items-center justify-between gap-3 text-xs">
        <button type="button" aria-label="Thông báo trước" onClick={() => setI((n) => (n - 1 + announcements.length) % announcements.length)} className="opacity-70 hover:opacity-100">
          <ChevronLeft className="size-4" />
        </button>
        <Link key={i} to={a.to} className="animate-fade-in truncate text-center tracking-wide hover:underline">
          {a.text}
        </Link>
        <button type="button" aria-label="Thông báo tiếp theo" onClick={() => setI((n) => (n + 1) % announcements.length)} className="opacity-70 hover:opacity-100">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function MegaMenu({ item, onClose }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 animate-drop border-t border-line bg-paper shadow-[0_24px_40px_-24px_rgba(27,26,23,0.25)]" onMouseLeave={onClose}>
      <div className="ds-container grid grid-cols-12 gap-8 py-10">
        <div className="col-span-7 grid grid-cols-3 gap-8">
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="ds-eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} onClick={onClose} className={cn('text-[15px] hover:underline hover:underline-offset-4', l.tone === 'sale' && 'font-medium text-son')}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="col-span-5 grid grid-cols-2 gap-4">
          {item.promos.map((p) => (
            <Link key={p.title} to={p.to} onClick={onClose} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-paper-2">
                <img src={p.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
              </div>
              <p className="mt-3 font-display text-lg italic">{p.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  const [active, setActive] = useState(null)
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  useEffect(() => {
    if (!open) setActive(null)
  }, [open])
  if (!open) return null
  const item = mainNav.find((n) => n.slug === active)
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={onClose} aria-hidden />
      <nav className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-slide-in-left flex-col bg-paper" aria-label="Menu">
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          {item ? (
            <button type="button" onClick={() => setActive(null)} className="flex items-center gap-1 ds-label">
              <ChevronLeft className="size-4" /> {item.label}
            </button>
          ) : (
            <Logo className="scale-90" />
          )}
          <IconButton label="Đóng menu" onClick={onClose}>
            <X className="size-5" strokeWidth={1.5} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!item ? (
            <>
              <ul className="divide-y divide-line">
                {mainNav.map((n) => (
                  <li key={n.slug}>
                    {n.columns ? (
                      <button type="button" onClick={() => setActive(n.slug)} className="flex w-full items-center justify-between py-4 font-display text-2xl">
                        {n.label}
                        <ChevronRight className="size-5" strokeWidth={1.25} />
                      </button>
                    ) : (
                      <Link to={n.to} onClick={onClose} className={cn('block py-4 font-display text-2xl', n.tone === 'sale' && 'text-son')}>
                        {n.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="mt-8 space-y-3 text-[15px]">
                <li>
                  {me ? (
                    <Link to="/tai-khoan" onClick={onClose}>
                      Tài khoản của tôi
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        openAuth()
                      }}
                    >
                      Đăng nhập / Đăng ký
                    </button>
                  )}
                </li>
                <li>
                  <Link to="/yeu-thich" onClick={onClose}>
                    Yêu thích
                  </Link>
                </li>
                <li>
                  <Link to="/cua-hang" onClick={onClose}>
                    Tìm cửa hàng
                  </Link>
                </li>
                <li>
                  <Link to="/theo-doi-don-hang" onClick={onClose}>
                    Theo dõi đơn hàng
                  </Link>
                </li>
                <li>
                  <Link to="/doi-cu-lay-moi" onClick={onClose}>
                    Đổi cũ lấy mới
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            <div className="space-y-8">
              <Link to={`/${item.slug}`} onClick={onClose} className="block font-display text-2xl italic underline-offset-4 hover:underline">
                Trang {item.label}
              </Link>
              {item.columns.map((col) => (
                <div key={col.title}>
                  <p className="ds-eyebrow mb-3">{col.title}</p>
                  <ul className="space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} onClick={onClose} className={cn('text-[15px]', l.tone === 'sale' && 'text-son')}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export function Header({ minimal = false }) {
  const [hovered, setHovered] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const timer = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { data: cart } = useCart()
  const { data: wishlist = [] } = useWishlist()
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  const openSearch = useUI((s) => s.openSearch)

  useEffect(() => {
    setHovered(null)
    setMobileOpen(false)
  }, [location.pathname, location.search])

  const enter = (slug) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(slug), 120)
  }
  const leave = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(null), 160)
  }

  if (minimal) {
    return (
      <header className="border-b border-line bg-paper">
        <div className="ds-container flex h-16 items-center justify-between">
          <Link to="/gio-hang" className="ds-label flex items-center gap-1 hover:text-cham">
            <ChevronLeft className="size-4" /> Giỏ hàng
          </Link>
          <Link to="/" aria-label="Về trang chủ">
            <Logo />
          </Link>
          <span className="hidden text-xs text-muted sm:block">Thanh toán bảo mật</span>
        </div>
      </header>
    )
  }

  const active = mainNav.find((n) => n.slug === hovered && n.columns)

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div className="relative border-b border-line bg-paper/95 backdrop-blur" onMouseLeave={leave}>
        <div className="ds-container flex h-16 items-center gap-4">
          <IconButton label="Mở menu" className="-ml-2 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" strokeWidth={1.5} />
          </IconButton>
          <Link to="/" className="shrink-0" aria-label="Nếp — trang chủ">
            <Logo />
          </Link>
          <nav className="ml-8 hidden h-full items-stretch lg:flex" aria-label="Danh mục chính">
            {mainNav.map((n) => (
              <NavLink
                key={n.slug}
                to={n.to ?? `/${n.slug}`}
                onMouseEnter={() => (n.columns ? enter(n.slug) : leave())}
                onFocus={() => n.columns && setHovered(n.slug)}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center px-3.5 text-[13px] font-medium tracking-[0.06em] uppercase transition-colors after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform hover:after:scale-x-100',
                    (isActive || hovered === n.slug) && 'after:scale-x-100',
                    n.tone === 'sale' && 'text-son after:bg-son',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button type="button" onClick={openSearch} className="mr-2 hidden h-10 w-56 items-center gap-2 border-b border-ink/30 px-1 text-left text-[13px] text-muted transition-colors hover:border-ink md:flex" aria-label="Tìm kiếm">
              <Search className="size-4 text-ink" strokeWidth={1.5} />
              Tìm sản phẩm, màu sắc…
            </button>
            <IconButton label="Tìm kiếm" className="md:hidden" onClick={openSearch}>
              <Search className="size-5" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={me ? 'Tài khoản của tôi' : 'Đăng nhập'} onClick={() => (me ? navigate('/tai-khoan') : openAuth())}>
              <User className="size-5" strokeWidth={1.5} />
              {me && <span className="absolute right-2 bottom-2 size-2 rounded-full border-2 border-paper bg-la" aria-hidden />}
            </IconButton>
            <IconButton label="Yêu thích" onClick={() => navigate('/yeu-thich')} badge={wishlist.length}>
              <Heart className="size-5" strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Giỏ hàng" onClick={() => navigate('/gio-hang')} badge={cart?.count}>
              <ShoppingBag className="size-5" strokeWidth={1.5} />
            </IconButton>
          </div>
        </div>
        {active && (
          <div onMouseEnter={() => clearTimeout(timer.current)}>
            <MegaMenu item={active} onClose={() => setHovered(null)} />
          </div>
        )}
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
