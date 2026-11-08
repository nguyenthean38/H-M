import { Input, Select } from '@/components/ui'
import { provinces, regions } from '@/config/locations'

/** Form địa chỉ giao hàng theo đơn vị hành chính 2 cấp (Tỉnh/Thành → Phường/Xã). */
export function AddressFields({ value, onChange, errors = {}, prefix = 'shippingAddress' }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value }, `${prefix}.${k}`)
  const err = (k) => errors[`${prefix}.${k}`]
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Họ tên người nhận" required autoComplete="name" value={value.fullName} onChange={set('fullName')} error={err('fullName')} />
      <Input label="Số điện thoại" required inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" value={value.phone} onChange={set('phone')} error={err('phone')} />
      <Input className="sm:col-span-2" label="Số nhà, tên đường" required autoComplete="address-line1" placeholder="Ví dụ: 18 Ngõ 52 Tô Ngọc Vân" value={value.line1} onChange={set('line1')} error={err('line1')} />
      <Input label="Phường / Xã" required placeholder="Ví dụ: Phường Tây Hồ" value={value.ward} onChange={set('ward')} error={err('ward')} />
      <Select label="Tỉnh / Thành phố" required value={value.province} onChange={set('province')} error={err('province')} placeholder="Chọn tỉnh/thành">
        {regions.map((r) => (
          <optgroup key={r.code} label={r.name}>
            {provinces
              .filter((p) => p.region === r.code)
              .map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
          </optgroup>
        ))}
      </Select>
    </div>
  )
}
