import { cn } from '@/utils/cn'

/** Biểu tượng: tấm vải gấp góc (nếp gấp) màu chàm với chữ "n". */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-7', className)} aria-hidden>
      <path d="M6 6h38l14 14v38H6z" fill="currentColor" />
      <path d="M44 6v14h14z" fill="var(--color-cham-300)" />
      <path d="M20 46V27h5v3c1.6-2.3 3.9-3.5 6.8-3.5 4.6 0 7.2 2.9 7.2 7.9V46h-5V35.4c0-2.9-1.4-4.4-3.9-4.4-2.9 0-5.1 2.1-5.1 5.6V46z" fill="var(--color-paper)" />
    </svg>
  )
}

/** Logo chữ "nếp." — serif Fraunces nghiêng nhẹ, dấu chấm màu chàm. */
export function Logo({ className, mark = true }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink', className)}>
      {mark && <LogoMark className="text-cham" />}
      <span className="font-display text-[28px] leading-none font-semibold tracking-[-0.04em]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>
        nếp<span className="text-cham">.</span>
      </span>
      <span className="sr-only">Nếp — trang chủ</span>
    </span>
  )
}
