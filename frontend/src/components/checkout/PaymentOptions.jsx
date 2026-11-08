import { Banknote, CreditCard, QrCode, Smartphone, WalletCards } from 'lucide-react'
import { Notice } from '@/components/ui'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { CardFields } from './CardFields'
import { ChoiceCard } from './Section'
import { BRAND_LABEL } from './helpers'

const ICONS = { cod: Banknote, the: CreditCard, vi: Smartphone, 'chuyen-khoan': QrCode, 'tra-gop': WalletCards }

function reason(m) {
  if (m.minTotal) return `Áp dụng cho đơn từ ${formatPrice(m.minTotal)}.`
  if (m.maxTotal) return `Chỉ áp dụng cho đơn đến ${formatPrice(m.maxTotal)}.`
  return 'Tạm thời không khả dụng.'
}

/** Chọn thẻ đã lưu hoặc nhập thẻ mới. */
function CardChooser({ cards, savedCardId, setSavedCardId, card, setCard, errors, loggedIn }) {
  const useNew = !cards.length || !savedCardId || savedCardId === 'new'
  return (
    <div className="space-y-3">
      {cards.length > 0 && (
        <div className="space-y-2">
          {cards.map((c) => (
            <ChoiceCard key={c.id} name="saved-card" value={c.id} checked={savedCardId === c.id} onChange={() => setSavedCardId(c.id)}>
              <span className="flex items-center justify-between text-[13px]">
                <span className="font-semibold">
                  {BRAND_LABEL[c.brand] ?? 'Thẻ'} •••• {c.last4}
                </span>
                <span className="text-xs text-muted">Hết hạn {c.exp}</span>
              </span>
              <span className="text-xs text-muted">{c.holder}</span>
            </ChoiceCard>
          ))}
          <ChoiceCard name="saved-card" value="new" checked={useNew} onChange={() => setSavedCardId('new')}>
            <span className="text-[13px] font-semibold">Dùng thẻ khác</span>
          </ChoiceCard>
          {errors['payment.card'] && <p className="text-xs text-son">{errors['payment.card']}</p>}
        </div>
      )}
      {useNew && <CardFields value={card} onChange={setCard} errors={errors} canSave={loggedIn} />}
    </div>
  )
}

export function PaymentOptions({ methods, value, onChange, total, errors, card, setCard, cards, savedCardId, setSavedCardId, wallet, setWallet, installments, setInstallments, loggedIn }) {
  if (!methods) return <div className="ds-skeleton h-64" />
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Phương thức thanh toán">
      {methods.map((m) => {
        const Icon = ICONS[m.id] ?? CreditCard
        const active = value === m.id
        return (
          <div key={m.id} className={cn('border bg-surface', active ? 'border-ink' : 'border-line-strong', !m.available && 'opacity-50')}>
            <ChoiceCard name="payment" value={m.id} checked={active} onChange={() => onChange(m.id)} disabled={!m.available} className="border-0">
              <span className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold">{m.name}</span>
                <Icon className="size-5 shrink-0 text-ink-2" strokeWidth={1.5} />
              </span>
              <span className="mt-0.5 block text-xs text-muted">{m.available ? m.description : reason(m)}</span>
            </ChoiceCard>
            {active && m.available && (
              <div className="animate-drop border-t border-line px-4 py-5">
                {m.id === 'cod' && <p className="text-[13px] text-ink-2">Bạn thanh toán bằng tiền mặt hoặc chuyển khoản khi nhận hàng. Vui lòng để ý điện thoại để shipper liên hệ.</p>}
                {m.id === 'the' && <CardChooser {...{ cards, savedCardId, setSavedCardId, card, setCard, errors, loggedIn }} />}
                {m.id === 'vi' && (
                  <div>
                    <p className="mb-3 text-[13px]">Chọn ví bạn đang dùng:</p>
                    <div className="flex flex-wrap gap-2">
                      {(m.wallets ?? []).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWallet(w)}
                          aria-pressed={wallet === w}
                          className={cn('h-10 border px-4 text-[13px] font-medium transition-colors', wallet === w ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted">Sau khi đặt hàng, bạn sẽ được chuyển sang ứng dụng {wallet} để xác nhận (bản demo bỏ qua bước này).</p>
                  </div>
                )}
                {m.id === 'chuyen-khoan' && (
                  <p className="text-[13px] text-ink-2">
                    Mã VietQR kèm số tiền và nội dung chuyển khoản sẽ hiện ngay sau khi bạn đặt hàng. Đơn được xác nhận tự động khi nhận được tiền; giữ đơn trong 24 giờ.
                  </p>
                )}
                {m.id === 'tra-gop' && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-3 text-[13px]">Chọn kỳ hạn (lãi suất 0%):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[3, 6].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setInstallments(n)}
                            aria-pressed={installments === n}
                            className={cn('border px-4 py-3 text-left transition-colors', installments === n ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}
                          >
                            <span className="block text-[13px] font-semibold">{n} kỳ</span>
                            <span className="text-xs opacity-80">{formatPrice(Math.ceil(total / n / 1000) * 1000)}/tháng</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <CardChooser {...{ cards, savedCardId, setSavedCardId, card, setCard, errors, loggedIn }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
      {errors['payment.id'] && (
        <div data-error="true">
          <Notice tone="error">{errors['payment.id']}</Notice>
        </div>
      )}
    </div>
  )
}
