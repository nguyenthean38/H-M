import { cn } from '@/utils/cn'

/** Khối đánh số trong trang thanh toán; `onEdit` hiện nút "Sửa" khi đang ở dạng tóm tắt. */
export function CheckoutSection({ n, title, onEdit, children, className, id }) {
  return (
    <section id={id} className={cn('border-t border-ink pt-5 pb-8', className)} aria-labelledby={`${id}-title`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id={`${id}-title`} className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center bg-ink text-xs font-semibold text-paper">{n}</span>
          <span className="ds-label text-xs">{title}</span>
        </h2>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-xs font-semibold tracking-[0.1em] uppercase underline underline-offset-4 hover:text-cham">
            Sửa
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

/** Thẻ lựa chọn có radio (phương thức giao, địa chỉ, cửa hàng...). */
export function ChoiceCard({ name, value, checked, onChange, disabled, children, className, ...rest }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 border bg-surface px-4 py-3.5 transition-colors',
        checked ? 'border-ink' : 'border-line-strong hover:border-ink-2',
        disabled && 'cursor-not-allowed opacity-50 hover:border-line-strong',
        className,
      )}
      {...rest}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cham">
        {checked && <span className="size-2.5 rounded-full bg-ink" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}
