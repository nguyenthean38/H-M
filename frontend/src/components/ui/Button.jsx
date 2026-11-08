import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const VARIANTS = {
  primary: 'bg-ink text-paper hover:bg-ink-2 disabled:bg-line-strong disabled:text-paper',
  cham: 'bg-cham text-paper hover:bg-cham-600 disabled:bg-cham-300',
  outline: 'border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper disabled:border-line-strong disabled:text-subtle disabled:hover:bg-transparent',
  light: 'bg-paper text-ink hover:bg-white disabled:opacity-60',
  ghost: 'bg-transparent text-ink hover:bg-paper-2 disabled:text-subtle',
  link: 'h-auto bg-transparent px-0 text-ink underline underline-offset-4 hover:text-cham disabled:text-subtle',
}
const SIZES = {
  sm: 'h-9 px-4 text-2xs',
  md: 'h-12 px-6 text-2xs',
  lg: 'h-14 px-8 text-xs',
}

/**
 * Nút chuẩn: góc vuông, chữ in hoa giãn chữ.
 * `to` → render <Link>; `href` → <a>; `loading` → hiện vòng xoay và khoá nút.
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', block, loading, disabled, to, href, className, children, icon: Icon, iconRight: IconRight, type = 'button', ...rest },
  ref,
) {
  const cls = cn(
    'relative inline-flex items-center justify-center gap-2 font-semibold tracking-[0.12em] uppercase transition-colors duration-150 select-none',
    VARIANTS[variant],
    variant !== 'link' && SIZES[size],
    block && 'w-full',
    className,
  )
  const content = (
    <>
      {loading && <LoaderCircle className="absolute size-5 animate-spin" aria-hidden />}
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {Icon && <Icon className="size-4" strokeWidth={1.75} aria-hidden />}
        {children}
        {IconRight && <IconRight className="size-4" strokeWidth={1.75} aria-hidden />}
      </span>
    </>
  )
  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={cls} {...rest}>
      {content}
    </button>
  )
})

/** Nút chỉ có biểu tượng (header, đóng, yêu thích...). */
export const IconButton = forwardRef(function IconButton({ label, className, children, badge, ...rest }, ref) {
  return (
    <button ref={ref} type="button" aria-label={label} title={label} className={cn('relative inline-flex size-10 items-center justify-center transition-opacity hover:opacity-60', className)} {...rest}>
      {children}
      {badge ? (
        <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cham px-1 text-[10px] leading-none font-semibold text-paper">{badge > 99 ? '99+' : badge}</span>
      ) : null}
    </button>
  )
})
