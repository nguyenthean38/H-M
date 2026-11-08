import { cn } from '@/utils/cn'

/** Khung trang hẹp, căn giữa cho các form đơn (quên mật khẩu, đặt lại mật khẩu...). */
export function NarrowPage({ title, children, className, center }) {
  return (
    <div className={cn('ds-container py-12 lg:py-20', className)}>
      <div className={cn('mx-auto max-w-[460px]', center && 'text-center')}>
        {title && <h1 className="ds-h1 mb-6">{title}</h1>}
        {children}
      </div>
    </div>
  )
}
