import { useEffect, useState } from 'react'
import { storage } from '@/utils/storage'

const KEY = 'nep.recentlyViewed'
const MAX = 12

/** Lưu tóm tắt sản phẩm vừa xem (chỉ ở trình duyệt này). */
export function rememberProduct(p) {
  const summary = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    badges: p.badges,
    image: p.image,
    hoverImage: p.hoverImage,
    colors: p.colors.map((c) => ({ code: c.code, name: c.name, hex: c.hex, image: c.images[0] })),
  }
  const list = storage.get(KEY, []).filter((x) => x.id !== p.id)
  storage.set(KEY, [summary, ...list].slice(0, MAX))
}

export function useRecentlyViewed(excludeId) {
  const [list, setList] = useState(() => storage.get(KEY, []))
  useEffect(() => {
    setList(storage.get(KEY, []))
  }, [excludeId])
  return list.filter((p) => p.id !== excludeId)
}
