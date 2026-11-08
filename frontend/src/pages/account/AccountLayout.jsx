import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { TierProgress } from '@/components/account/TierProgress'
import { useLogout, useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const NAV = [
  { to: '/tai-khoan', label: 'Tài khoản & ưu đãi', end: true },
  { to: '/tai-khoan/don-hang', label: 'Đơn hàng' },
  { to: '/tai-khoan/thanh-vien', label: 'Nếp Club' },
  { to: '/tai-khoan/cai-dat', label: 'Cài đặt' },
]

export default function AccountLayout() {
  const { data: me } = useMe()
  const logout = useLogout()
  const navigate = useNavigate()
  const toast = useUI((s) => s.toast)
  const signOut = () =>
    logout.mutate(undefined, {
      onSettled: () => {
        navigate('/')
        toast('Bạn đã đăng xuất. Hẹn gặp lại!', 'success')
      },
    })
  if (!me) return null
  const linkCls = ({ isActive }) => cn('block py-1.5 text-[15px] transition-colors hover:text-cham', isActive ? 'font-semibold text-ink' : 'text-ink-2')

  return (
    <div className="ds-container py-8 lg:py-12">
      {/* Điện thoại */}
      <div className="mb-6 lg:hidden">
        <p className="font-display text-2xl">Chào, {me.firstName ?? 'bạn'}</p>
        <TierProgress me={me} className="mt-3" />
        <nav className="ds-scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto border-b border-line px-4 pb-3 sm:-mx-6 sm:px-6" aria-label="Tài khoản">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => cn('shrink-0 border px-3 py-1.5 text-xs font-medium whitespace-nowrap', isActive ? 'border-ink bg-ink text-paper' : 'border-line-strong')}
            >
              {n.label}
            </NavLink>
          ))}
          <button type="button" onClick={signOut} className="shrink-0 border border-line-strong px-3 py-1.5 text-xs font-medium whitespace-nowrap">
            Đăng xuất
          </button>
        </nav>
      </div>

      <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <p className="font-display text-2xl">Chào, {me.firstName ?? 'bạn'}</p>
            <TierProgress me={me} className="mt-4 border-b border-line pb-5" />
            <p className="mt-4 text-xs text-muted">
              Mã thành viên: <span className="font-mono text-ink-2">{me.memberId}</span>
            </p>
            <nav className="mt-8 space-y-1" aria-label="Tài khoản">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className={linkCls}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <button type="button" onClick={signOut} className="mt-8 flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4 hover:text-cham">
              <LogOut className="size-3.5" /> Đăng xuất
            </button>
          </div>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
