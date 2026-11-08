import { cn } from '@/utils/cn'

const METHODS = ['COD', 'Visa', 'Mastercard', 'JCB', 'Napas', 'MoMo', 'ZaloPay', 'VietQR']

export function PaymentBadges({ className }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Phương thức thanh toán được chấp nhận">
      {METHODS.map((m) => (
        <li key={m} className="border border-line-strong bg-surface px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink-2">
          {m}
        </li>
      ))}
    </ul>
  )
}
