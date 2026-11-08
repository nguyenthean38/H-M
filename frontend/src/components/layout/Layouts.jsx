import { Suspense, useEffect } from 'react'
import { Navigate, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom'
import { AuthModal } from '@/components/auth/AuthModal'
import { AddedToBag } from '@/components/cart/AddedToBag'
import { PageLoader } from '@/components/ui'
import { useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { Footer } from './Footer'
import { Header } from './Header'
import { LocationModal } from './LocationModal'
import { SearchPanel } from './SearchPanel'

function GlobalOverlays() {
  return (
    <>
      <AuthModal />
      <SearchPanel />
      <LocationModal />
      <AddedToBag />
    </>
  )
}

/** Bố cục chuẩn: header + nội dung + footer. */
export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#noi-dung" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Bỏ qua đến nội dung chính
      </a>
      <Header />
      <main id="noi-dung" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <GlobalOverlays />
      <ScrollRestoration />
    </div>
  )
}

/** Bố cục thanh toán: header tối giản, không footer, giúp tập trung. */
export function CheckoutLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header minimal />
      <main id="noi-dung" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <GlobalOverlays />
      <ScrollRestoration />
    </div>
  )
}

/** Chặn trang cần đăng nhập: chưa đăng nhập → về trang chủ và mở modal đăng nhập. */
export function RequireAuth({ children }) {
  const { data: me, isLoading } = useMe()
  const location = useLocation()
  const navigate = useNavigate()
  const openAuth = useUI((s) => s.openAuth)
  const target = location.pathname + location.search
  useEffect(() => {
    if (!isLoading && !me) openAuth({ onSuccess: () => navigate(target) })
  }, [isLoading, me, openAuth, navigate, target])
  if (isLoading) return <PageLoader />
  if (!me) return <Navigate to="/" replace state={{ from: location.pathname }} />
  return children
}
