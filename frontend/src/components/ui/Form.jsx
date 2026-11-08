import { forwardRef, useId, useState } from 'react'
import { Check, ChevronDown, CircleAlert, Eye, EyeOff, X } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Nhãn + ô nhập + gợi ý/lỗi. Hiện dấu ✓ xanh khi `valid` (giống luồng đăng ký trong thiết kế). */
export function Field({ label, required, hint, error, htmlFor, children, className, optionalLabel }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-medium text-ink-2">
          {label}
          {required && <span className="text-son"> *</span>}
          {optionalLabel && <span className="font-normal text-subtle"> (không bắt buộc)</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs text-son" role="alert">
          <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

const inputBase =
  'h-12 w-full border bg-surface px-3.5 text-[14px] text-ink placeholder:text-subtle transition-colors outline-none focus:border-ink disabled:bg-paper-2 disabled:text-muted'

export const Input = forwardRef(function Input({ label, required, hint, error, valid, className, inputClassName, id, right, optionalLabel, ...rest }, ref) {
  const autoId = useId()
  const fid = id ?? autoId
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={fid} className={className} optionalLabel={optionalLabel}>
      <div className="relative">
        <input
          ref={ref}
          id={fid}
          aria-invalid={error ? true : undefined}
          className={cn(inputBase, error ? 'border-son' : valid ? 'border-la' : 'border-line-strong', (valid || right) && 'pr-10', inputClassName)}
          {...rest}
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-2">
          {right}
          {valid && !error && !right && <Check className="size-4 text-la" aria-hidden />}
        </div>
      </div>
    </Field>
  )
})

export const Textarea = forwardRef(function Textarea({ label, required, hint, error, className, id, rows = 3, ...rest }, ref) {
  const autoId = useId()
  const fid = id ?? autoId
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={fid} className={className}>
      <textarea ref={ref} id={fid} rows={rows} className={cn(inputBase, 'h-auto resize-y py-3', error ? 'border-son' : 'border-line-strong')} {...rest} />
    </Field>
  )
})

export const Select = forwardRef(function Select({ label, required, hint, error, valid, className, id, children, placeholder, ...rest }, ref) {
  const autoId = useId()
  const fid = id ?? autoId
  return (
    <Field label={label} required={required} hint={hint} error={error} htmlFor={fid} className={className}>
      <div className="relative">
        <select ref={ref} id={fid} className={cn(inputBase, 'appearance-none pr-10', error ? 'border-son' : valid ? 'border-la' : 'border-line-strong')} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" aria-hidden />
      </div>
    </Field>
  )
})

/** Quy tắc mật khẩu hiển thị trực tiếp dưới ô nhập. */
export const PASSWORD_RULES = [
  { key: 'length', label: '8–25 ký tự', test: (v) => v.length >= 8 && v.length <= 25 },
  { key: 'number', label: '1 chữ số', test: (v) => /\d/.test(v) },
  { key: 'upper', label: '1 chữ hoa', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: '1 chữ thường', test: (v) => /[a-z]/.test(v) },
  { key: 'space', label: 'Không khoảng trắng', test: (v) => v.length > 0 && !/\s/.test(v) },
]
export const passwordValid = (v = '') => PASSWORD_RULES.every((r) => r.test(v))

export const PasswordInput = forwardRef(function PasswordInput({ showRules, value = '', touched, ...rest }, ref) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        value={value}
        autoComplete={showRules ? 'new-password' : 'current-password'}
        right={
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="text-ink-2 hover:text-ink">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        valid={showRules && passwordValid(value)}
        {...rest}
      />
      {showRules && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs" aria-label="Yêu cầu mật khẩu">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(value)
            const bad = touched && value && !ok
            return (
              <li key={r.key} className={cn('flex items-center gap-1', ok ? 'text-la' : bad ? 'text-son' : 'text-muted')}>
                {ok ? <Check className="size-3" aria-hidden /> : bad ? <X className="size-3" aria-hidden /> : <span className="size-1 rounded-full bg-current" aria-hidden />}
                {r.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
})

export const Checkbox = forwardRef(function Checkbox({ label, className, error, children, ...rest }, ref) {
  return (
    <div className={className}>
      <label className="group flex cursor-pointer items-start gap-3 text-[13px] leading-snug">
        <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
        <span className="mt-px flex size-[18px] shrink-0 items-center justify-center border border-ink bg-surface transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cham peer-disabled:border-line-strong [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
          <Check className="size-3 text-paper" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-ink-2">{label ?? children}</span>
      </label>
      {error && <p className="mt-1 pl-[30px] text-xs text-son">{error}</p>}
    </div>
  )
})

export const Radio = forwardRef(function Radio({ label, description, className, right, ...rest }, ref) {
  return (
    <label className={cn('group flex cursor-pointer items-start gap-3 text-[13px] leading-snug has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50', className)}>
      <input ref={ref} type="radio" className="peer sr-only" {...rest} />
      <span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border border-ink bg-surface peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cham [&>span]:scale-0 peer-checked:[&>span]:scale-100">
        <span className="size-2.5 rounded-full bg-ink transition-transform" />
      </span>
      <span className="flex-1">
        <span className="block text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      {right}
    </label>
  )
})

/** Ô nhập ngày sinh dạng DD / MM / YYYY (người Việt quen thứ tự ngày trước). */
export function DateOfBirthInput({ value = '', onChange, error, label = 'Ngày sinh', required }) {
  const [y = '', m = '', d = ''] = value ? value.split('-') : []
  const [parts, setParts] = useState({ d, m, y })
  const id = useId()
  const update = (k, v) => {
    const next = { ...parts, [k]: v.replace(/\D/g, '').slice(0, k === 'y' ? 4 : 2) }
    setParts(next)
    const { d: dd, m: mm, y: yy } = next
    const date = new Date(`${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T00:00:00`)
    const ok = yy.length === 4 && mm && dd && !Number.isNaN(date.getTime()) && date.getDate() === Number(dd)
    onChange?.(ok ? `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}` : '')
  }
  const complete = Boolean(value)
  const seg = 'w-10 bg-transparent text-center outline-none placeholder:text-subtle'
  return (
    <Field label={label} required={required} error={error} htmlFor={id}>
      <div className={cn('flex h-12 items-center border bg-surface px-3 focus-within:border-ink', error ? 'border-son' : complete ? 'border-la' : 'border-line-strong')}>
        <input id={id} inputMode="numeric" placeholder="DD" aria-label="Ngày" value={parts.d} onChange={(e) => update('d', e.target.value)} className={seg} />
        <span className="text-subtle">/</span>
        <input inputMode="numeric" placeholder="MM" aria-label="Tháng" value={parts.m} onChange={(e) => update('m', e.target.value)} className={seg} />
        <span className="text-subtle">/</span>
        <input inputMode="numeric" placeholder="YYYY" aria-label="Năm" value={parts.y} onChange={(e) => update('y', e.target.value)} className={cn(seg, 'w-16')} />
        {complete && <Check className="ml-auto size-4 text-la" aria-hidden />}
      </div>
    </Field>
  )
}

/** Bộ tăng giảm số lượng. */
export function QuantityStepper({ value, min = 1, max = 10, onChange, disabled, onRemove }) {
  return (
    <div className="inline-flex h-10 items-center border border-line-strong">
      {value <= min && onRemove ? (
        <button type="button" onClick={onRemove} disabled={disabled} className="flex size-10 items-center justify-center hover:bg-paper-2" aria-label="Xoá sản phẩm">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
          </svg>
        </button>
      ) : (
        <button type="button" onClick={() => onChange(value - 1)} disabled={disabled || value <= min} className="flex size-10 items-center justify-center text-lg hover:bg-paper-2 disabled:text-subtle" aria-label="Giảm số lượng">
          −
        </button>
      )}
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={disabled || value >= max} className="flex size-10 items-center justify-center text-lg hover:bg-paper-2 disabled:text-subtle" aria-label="Tăng số lượng">
        +
      </button>
    </div>
  )
}
