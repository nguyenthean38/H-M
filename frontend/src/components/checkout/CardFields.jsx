import { CreditCard } from 'lucide-react'
import { Checkbox, Input } from '@/components/ui'
import { DEMO } from '@/config/demo'
import { BRAND_LABEL, detectBrand, digits, formatCardNumber, formatExp } from './helpers'

/** Form nhập thẻ: tự chia nhóm 4 số, nhận diện loại thẻ, tự chèn "/" cho hạn thẻ. */
export function CardFields({ value, onChange, errors = {}, canSave }) {
  const brand = detectBrand(value.number)
  const set = (k, v) => onChange({ ...value, [k]: v }, `payment.card.${k}`)
  return (
    <div className="space-y-4">
      <Input
        label="Số thẻ"
        required
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        value={value.number}
        onChange={(e) => set('number', formatCardNumber(e.target.value))}
        error={errors['payment.card.number']}
        inputClassName="tabular-nums tracking-wider"
        right={
          brand ? (
            <span className="text-[10px] font-bold tracking-wide text-cham uppercase">{BRAND_LABEL[brand]}</span>
          ) : (
            <CreditCard className="size-4 text-subtle" strokeWidth={1.5} />
          )
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Hạn thẻ"
          required
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          hint="In ở mặt trước thẻ"
          value={value.exp}
          onChange={(e) => set('exp', formatExp(e.target.value, value.exp))}
          error={errors['payment.card.exp']}
          valid={/^(0[1-9]|1[0-2])\/\d{2}$/.test(value.exp)}
        />
        <Input
          label="Mã bảo mật (CVC)"
          required
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="123"
          hint="3–4 số ở mặt sau thẻ"
          value={value.cvc}
          onChange={(e) => set('cvc', digits(e.target.value).slice(0, 4))}
          error={errors['payment.card.cvc']}
          valid={/^\d{3,4}$/.test(value.cvc)}
        />
      </div>
      <Input
        label="Tên in trên thẻ"
        required
        autoComplete="cc-name"
        placeholder="NGUYEN VAN A"
        value={value.holder}
        onChange={(e) => set('holder', e.target.value.toUpperCase())}
        error={errors['payment.card.holder']}
        valid={value.holder.trim().length > 2}
      />
      {canSave && <Checkbox label="Lưu thẻ cho lần mua sau" checked={value.save} onChange={(e) => set('save', e.target.checked)} />}
      <p className="text-xs text-muted">
        Thẻ demo: <span className="font-mono text-ink-2">{DEMO.card}</span>, hạn bất kỳ trong tương lai, CVC bất kỳ.
      </p>
    </div>
  )
}
