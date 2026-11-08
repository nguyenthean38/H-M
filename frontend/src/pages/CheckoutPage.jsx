import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { orderTotal } from '@/components/cart/OrderTotals'
import { AddressFields } from '@/components/checkout/AddressFields'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { DeliveryMethodList, PickupStoreList, addressLine } from '@/components/checkout/DeliveryOptions'
import { EMAIL_RE, PHONE_OK, digits, formatEta, priceLabel } from '@/components/checkout/helpers'
import { PaymentOptions } from '@/components/checkout/PaymentOptions'
import { CheckoutSection, ChoiceCard } from '@/components/checkout/Section'
import { Button, Checkbox, Input, PageLoader, Textarea } from '@/components/ui'
import { useAddresses, useCards } from '@/hooks/useAccount'
import { useMe } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useCheckoutOptions, usePlaceOrder } from '@/hooks/useOrders'
import { useUI } from '@/store/ui'
import { formatPrice, formatPhone } from '@/utils/format'

const emptyAddress = (province) => ({ fullName: '', phone: '', line1: '', ward: '', province })

function contactErrors(c) {
  const e = {}
  if (!c.fullName.trim()) e['contact.fullName'] = 'Vui lòng nhập họ tên.'
  if (!EMAIL_RE.test(c.email.trim())) e['contact.email'] = 'Email chưa đúng định dạng.'
  if (!PHONE_OK(c.phone)) e['contact.phone'] = 'Số điện thoại gồm 10 số, bắt đầu bằng 0.'
  return e
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { data: cart, isLoading } = useCart()
  const { data: me } = useMe()
  const { data: addresses = [] } = useAddresses()
  const { data: cards = [] } = useCards()
  const uiProvince = useUI((s) => s.province)
  const openAuth = useUI((s) => s.openAuth)
  const place = usePlaceOrder()

  const [contact, setContact] = useState({ fullName: '', email: '', phone: '' })
  const [editingContact, setEditingContact] = useState(true)
  const [methodId, setMethodId] = useState('tieu-chuan')
  const [storeId, setStoreId] = useState('')
  const [addressMode, setAddressMode] = useState('new')
  const [savedAddressId, setSavedAddressId] = useState('')
  const [address, setAddress] = useState(() => emptyAddress(uiProvince))
  const [saveAddress, setSaveAddress] = useState(true)
  const [note, setNote] = useState('')
  const [paymentId, setPaymentId] = useState('cod')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', holder: '', save: false })
  const [savedCardId, setSavedCardId] = useState('')
  const [wallet, setWallet] = useState('MoMo')
  const [installments, setInstallments] = useState(3)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState(null)

  // Điền sẵn thông tin liên hệ khi đã đăng nhập (kể cả đăng nhập giữa chừng)
  useEffect(() => {
    if (!me) return
    setContact((c) => {
      const next = {
        fullName: c.fullName || [me.lastName, me.firstName].filter(Boolean).join(' '),
        email: c.email || me.email,
        phone: c.phone || me.phone || '',
      }
      if (!Object.keys(contactErrors(next)).length) setEditingContact(false)
      return next
    })
  }, [me])

  useEffect(() => {
    if (addresses.length && !savedAddressId) {
      setSavedAddressId((addresses.find((a) => a.isDefault) ?? addresses[0]).id)
      setAddressMode('saved')
    }
  }, [addresses, savedAddressId])

  useEffect(() => {
    if (cards.length && !savedCardId) setSavedCardId(cards[0].id)
  }, [cards, savedCardId])

  const savedAddress = addresses.find((a) => a.id === savedAddressId)
  const activeAddress = addressMode === 'saved' && savedAddress ? savedAddress : address
  const { data: options } = useCheckoutOptions(activeAddress?.province || uiProvince)
  const method = options?.deliveryMethods.find((m) => m.id === methodId)
  const payment = options?.paymentMethods.find((m) => m.id === paymentId)

  // Phương thức không còn khả dụng (đổi tỉnh, đổi tổng tiền) → chuyển về lựa chọn hợp lệ đầu tiên
  useEffect(() => {
    if (method && !method.available) setMethodId('tieu-chuan')
  }, [method])
  useEffect(() => {
    if (payment && !payment.available) setPaymentId(options.paymentMethods.find((m) => m.available)?.id ?? 'cod')
  }, [payment, options])

  // Cuộn tới lỗi đầu tiên sau khi máy chủ trả về lỗi
  useEffect(() => {
    if (!Object.keys(errors).length) return
    requestAnimationFrame(() => document.querySelector('[aria-invalid="true"], [data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }, [errors])

  const shipping = method?.price ?? cart?.totals.shipping ?? 0
  const total = cart ? orderTotal(cart.totals, shipping) : 0

  const clearError = (key) => setErrors((e) => (e[key] ? Object.fromEntries(Object.entries(e).filter(([k]) => k !== key)) : e))

  if (isLoading || !cart) return <PageLoader />
  if (cart.items.length === 0 && !place.isPending && !place.isSuccess) return <Navigate to="/gio-hang" replace />

  const setContactField = (k) => (e) => {
    setContact((c) => ({ ...c, [k]: e.target.value }))
    clearError(`contact.${k}`)
  }

  const confirmContact = () => {
    const e = contactErrors(contact)
    setErrors((prev) => ({ ...prev, ...e }))
    if (!Object.keys(e).length) setEditingContact(false)
  }

  const submit = (e) => {
    e.preventDefault()
    setFormError(null)
    const ce = contactErrors(contact)
    if (Object.keys(ce).length) {
      setEditingContact(true)
      setErrors(ce)
      return
    }
    const body = {
      contact: { fullName: contact.fullName.trim(), email: contact.email.trim(), phone: digits(contact.phone) },
      deliveryMethodId: methodId,
      note,
      payment: { id: paymentId },
    }
    if (method?.requiresStore) body.storeId = storeId
    else {
      const a = activeAddress
      body.shippingAddress = { fullName: a.fullName, phone: digits(a.phone), line1: a.line1, ward: a.ward, province: a.province }
      body.saveAddress = Boolean(me) && addressMode === 'new' && saveAddress
    }
    if (paymentId === 'the' || paymentId === 'tra-gop') {
      const useSaved = me && cards.length && savedCardId && savedCardId !== 'new'
      body.payment.card = useSaved ? { savedCardId } : { ...card, number: digits(card.number) }
      if (paymentId === 'tra-gop') body.payment.installments = installments
    }
    if (paymentId === 'vi') body.payment.wallet = wallet

    place.mutate(body, {
      onSuccess: (order) => navigate(`/dat-hang-thanh-cong/${order.number}`, { state: { order } }),
      onError: (err) => {
        const f = err.fields ?? {}
        if (Object.keys(f).some((k) => k.startsWith('contact.'))) setEditingContact(true)
        if (Object.keys(f).some((k) => k.startsWith('shippingAddress.')) && addressMode === 'saved') {
          setAddress({ ...emptyAddress(uiProvince), ...savedAddress })
          setAddressMode('new')
        }
        setErrors(f)
        setFormError(Object.keys(f).length ? 'Vui lòng kiểm tra lại các thông tin được đánh dấu.' : err.message)
      },
    })
  }

  const points = Math.floor(total / 1000)

  return (
    <form id="checkout-form" onSubmit={submit} noValidate className="ds-container pt-8 pb-28 sm:pt-12 lg:pb-16">
      <h1 className="ds-h1">Thanh toán</h1>

      {!me && (
        <div className="mt-6 flex flex-col gap-3 border border-cham-300 bg-cham-50 px-5 py-4 text-cham-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[13px]">
            <Sparkles className="size-4 shrink-0" strokeWidth={1.5} />
            Đăng nhập để dùng địa chỉ đã lưu và tích <strong>{points.toLocaleString('vi-VN')} điểm</strong> cho đơn này.
          </p>
          <Button variant="cham" size="sm" onClick={() => openAuth()}>
            Đăng nhập / Đăng ký
          </Button>
        </div>
      )}

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div>
          {/* 1. Liên hệ */}
          <CheckoutSection n={1} id="lien-he" title="Thông tin liên hệ" onEdit={!editingContact ? () => setEditingContact(true) : null}>
            {editingContact ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Họ và tên" required autoComplete="name" value={contact.fullName} onChange={setContactField('fullName')} error={errors['contact.fullName']} />
                  <Input label="Số điện thoại" required inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" value={contact.phone} onChange={setContactField('phone')} error={errors['contact.phone']} hint="Shipper sẽ gọi số này khi giao hàng." />
                </div>
                <Input label="Email" required type="email" autoComplete="email" value={contact.email} onChange={setContactField('email')} error={errors['contact.email']} hint="Chúng tôi gửi xác nhận đơn hàng tới email này." />
                <Button variant="outline" onClick={confirmContact} disabled={!contact.fullName && !contact.email}>
                  Tiếp tục
                </Button>
              </div>
            ) : (
              <div className="text-[14px] leading-relaxed">
                <p className="font-semibold">{contact.fullName}</p>
                <p className="text-ink-2">{contact.email}</p>
                <p className="text-ink-2">{formatPhone(digits(contact.phone))}</p>
              </div>
            )}
          </CheckoutSection>

          {/* 2. Giao hàng */}
          <CheckoutSection n={2} id="giao-hang" title="Giao hàng">
            <DeliveryMethodList
              methods={options?.deliveryMethods}
              value={methodId}
              onChange={(id) => {
                setMethodId(id)
                clearError('deliveryMethodId')
              }}
              error={errors.deliveryMethodId}
            />

            <div className="mt-6">
              {method?.requiresStore ? (
                <PickupStoreList
                  stores={options?.pickupStores}
                  value={storeId}
                  onChange={(id) => {
                    setStoreId(id)
                    clearError('storeId')
                  }}
                  error={errors.storeId}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-[13px] font-medium">Địa chỉ nhận hàng</p>
                  {me && addresses.length > 0 && (
                    <div className="space-y-2">
                      {addresses.map((a) => (
                        <ChoiceCard
                          key={a.id}
                          name="address"
                          value={a.id}
                          checked={addressMode === 'saved' && savedAddressId === a.id}
                          onChange={() => {
                            setAddressMode('saved')
                            setSavedAddressId(a.id)
                          }}
                        >
                          <span className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
                            {a.fullName}
                            {a.label && <span className="bg-paper-2 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-ink-2 uppercase">{a.label}</span>}
                            {a.isDefault && <span className="text-[11px] font-normal text-cham">Mặc định</span>}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">{formatPhone(a.phone)}</span>
                          <span className="block text-xs text-muted">{addressLine(a)}</span>
                        </ChoiceCard>
                      ))}
                      <ChoiceCard name="address" value="new" checked={addressMode === 'new'} onChange={() => setAddressMode('new')}>
                        <span className="text-[14px] font-semibold">Giao đến địa chỉ khác</span>
                      </ChoiceCard>
                    </div>
                  )}
                  {(addressMode === 'new' || !me || !addresses.length) && (
                    <div className="space-y-4 border border-line bg-surface p-4 sm:p-5">
                      <AddressFields
                        value={address}
                        errors={errors}
                        onChange={(next, key) => {
                          setAddress(next)
                          clearError(key)
                        }}
                      />
                      {me && <Checkbox label="Lưu địa chỉ này vào sổ địa chỉ" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />}
                    </div>
                  )}
                </div>
              )}
              <Textarea className="mt-5" label="Ghi chú cho shipper (không bắt buộc)" rows={2} placeholder="Ví dụ: Gọi trước 15 phút, giao giờ hành chính…" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} />
              {method && (
                <p className="mt-4 text-xs text-muted">
                  {method.name} · {priceLabel(method.price)} · Dự kiến nhận {formatEta(method.eta)}
                </p>
              )}
            </div>
          </CheckoutSection>

          {/* 3. Thanh toán */}
          <CheckoutSection n={3} id="thanh-toan" title="Thanh toán">
            <PaymentOptions
              methods={options?.paymentMethods}
              value={paymentId}
              onChange={(id) => {
                setPaymentId(id)
                clearError('payment.id')
              }}
              total={total}
              errors={errors}
              card={card}
              setCard={(next, key) => {
                setCard(next)
                clearError(key)
              }}
              cards={me ? cards : []}
              savedCardId={savedCardId}
              setSavedCardId={setSavedCardId}
              wallet={wallet}
              setWallet={setWallet}
              installments={installments}
              setInstallments={setInstallments}
              loggedIn={Boolean(me)}
            />
          </CheckoutSection>
        </div>

        <aside className="lg:sticky lg:top-6" aria-label="Tóm tắt đơn hàng">
          <CheckoutSummary cart={cart} shipping={shipping} submitting={place.isPending} formError={formError} />
        </aside>
      </div>

      {/* Thanh đặt hàng cố định trên điện thoại */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex-1">
          <p className="text-[11px] text-muted">Tổng cộng</p>
          <p className="text-lg font-semibold tabular-nums">{formatPrice(total)}</p>
        </div>
        <Button type="submit" loading={place.isPending} className="flex-1">
          Đặt hàng
        </Button>
      </div>
    </form>
  )
}
