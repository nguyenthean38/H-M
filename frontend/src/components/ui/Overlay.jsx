import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Minus, Plus, X } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Khoá cuộn trang + đóng bằng Esc + trả focus khi overlay đóng. */
function useOverlayBehavior(open, onClose) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current?.()
    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => panelRef.current?.focus())
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, [open])
  return panelRef
}

const MODAL_SIZES = { sm: 'max-w-[400px]', md: 'max-w-[520px]', lg: 'max-w-[760px]', xl: 'max-w-[1040px]' }

/** Modal giữa màn hình: tiêu đề nhãn in hoa nhỏ + nút X (đăng nhập, xác nhận huỷ đơn, chọn khu vực...). */
export function Modal({ open, onClose, title, size = 'md', children, footer, className, bodyClassName }) {
  const panelRef = useOverlayBehavior(open, onClose)
  const titleId = useId()
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn('relative flex max-h-[92vh] w-full animate-slide-up flex-col bg-surface outline-none', MODAL_SIZES[size], className)}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 px-6 pt-5 pb-3">
          <h2 id={titleId} className="ds-label">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="-mr-2 flex size-9 items-center justify-center hover:opacity-60">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </header>
        <div className={cn('overflow-y-auto px-6 pb-6', bodyClassName)}>{children}</div>
        {footer && <footer className="shrink-0 border-t border-line px-6 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}

/**
 * Ngăn kéo trượt từ cạnh phải (bộ lọc, bảng size, đánh giá, chọn cửa hàng, thêm địa chỉ...).
 * `onBack` hiện mũi tên quay lại để làm panel con (ví dụ "Sắp xếp" bên trong "Bộ lọc").
 */
export function Drawer({ open, onClose, onBack, title, footer, children, side = 'right', width = 'sm:max-w-[440px]', className, bodyClassName }) {
  const panelRef = useOverlayBehavior(open, onClose)
  const titleId = useId()
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[65]">
      <div className="absolute inset-0 animate-fade-in bg-ink/55" onClick={onClose} aria-hidden />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'absolute top-0 flex h-full w-full flex-col bg-surface outline-none',
          side === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left',
          width,
          className,
        )}
      >
        <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-line px-14">
          {onBack && (
            <button type="button" onClick={onBack} aria-label="Quay lại" className="absolute left-3 flex size-9 items-center justify-center hover:opacity-60">
              <ArrowLeft className="size-5" strokeWidth={1.5} />
            </button>
          )}
          <h2 id={titleId} className="ds-label text-center">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="absolute right-3 flex size-9 items-center justify-center hover:opacity-60">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </header>
        <div className={cn('flex-1 overflow-y-auto', bodyClassName)}>{children}</div>
        {footer && <footer className="shrink-0 border-t border-line bg-surface px-5 py-4">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  )
}

/** Mục gập/mở với dấu +/− (Mô tả, Chất liệu, Giao hàng & thanh toán...). */
export function Accordion({ title, children, defaultOpen = false, className, titleClassName, onToggle }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={cn('border-b border-line', className)}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setOpen((o) => !o)
            onToggle?.(!open)
          }}
          className={cn('flex w-full items-center justify-between gap-4 py-4 text-left', titleClassName ?? 'ds-label')}
        >
          {title}
          {open ? <Minus className="size-4 shrink-0" strokeWidth={1.5} /> : <Plus className="size-4 shrink-0" strokeWidth={1.5} />}
        </button>
      </h3>
      {open && (
        <div id={id} className="animate-drop pb-5">
          {children}
        </div>
      )}
    </div>
  )
}

/** Tab gạch chân (Online / Tại cửa hàng, Thường / Dài...). */
export function Tabs({ tabs, value, onChange, className, stretch }) {
  return (
    <div role="tablist" className={cn('flex gap-6 border-b border-line', className)}>
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative -mb-px pb-3 text-xs font-semibold tracking-[0.1em] uppercase transition-colors',
              stretch && 'flex-1 text-center',
              active ? 'border-b-2 border-ink text-ink' : 'border-b-2 border-transparent text-subtle hover:text-ink',
            )}
          >
            {t.label}
            {t.count != null && <span className="ml-1 font-normal">({t.count})</span>}
          </button>
        )
      })}
    </div>
  )
}
