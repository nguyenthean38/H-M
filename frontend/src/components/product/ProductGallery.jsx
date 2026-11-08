import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Phóng to ảnh toàn màn hình. */
function Lightbox({ images, index, onClose, onIndex }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [index, images.length, onClose, onIndex])
  return createPortal(
    <div className="fixed inset-0 z-[80] flex animate-fade-in items-center justify-center bg-paper" role="dialog" aria-modal="true" aria-label="Xem ảnh lớn">
      <img src={images[index].url} alt={images[index].alt} className="max-h-full max-w-full object-contain" />
      <button type="button" onClick={onClose} aria-label="Đóng" className="absolute top-4 right-4 flex size-11 items-center justify-center bg-surface hover:bg-paper-2">
        <X className="size-5" />
      </button>
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => onIndex((index - 1 + images.length) % images.length)} aria-label="Ảnh trước" className="absolute left-4 flex size-11 items-center justify-center bg-surface hover:bg-paper-2">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={() => onIndex((index + 1) % images.length)} aria-label="Ảnh sau" className="absolute right-4 flex size-11 items-center justify-center bg-surface hover:bg-paper-2">
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
      <p className="absolute bottom-5 text-xs text-muted">
        {index + 1} / {images.length}
      </p>
    </div>,
    document.body,
  )
}

/**
 * Desktop: lưới 2 cột ảnh lớn cuộn theo trang (thông tin bên phải dính theo).
 * Điện thoại: băng chuyền vuốt ngang có chấm chỉ vị trí.
 */
export function ProductGallery({ images, badges }) {
  const [zoom, setZoom] = useState(null)
  const [active, setActive] = useState(0)
  const railRef = useRef(null)
  useEffect(() => {
    setActive(0)
    railRef.current?.scrollTo({ left: 0 })
  }, [images])
  const onScroll = () => {
    const el = railRef.current
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }
  const list = images
  // Chỉ có 1 ảnh: ô thứ hai là cận cảnh chất vải (phóng to cùng ảnh) để bố cục 2 cột không bị trống.
  const desktop = images.length === 1 ? [images[0], { ...images[0], detail: true, alt: `${images[0].alt} — cận cảnh` }] : images
  return (
    <div className="relative">
      {/* Điện thoại */}
      <div className="lg:hidden">
        <div ref={railRef} onScroll={onScroll} className="ds-scrollbar-none flex snap-x snap-mandatory overflow-x-auto">
          {list.map((img, i) => (
            <button key={img.url + i} type="button" onClick={() => setZoom(i)} className="aspect-[3/4] w-full shrink-0 snap-center bg-paper-2" aria-label={`Phóng to ảnh ${i + 1}`}>
              <img src={img.url} alt={img.alt} className="size-full object-cover" loading={i ? 'lazy' : 'eager'} />
            </button>
          ))}
        </div>
        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <span key={i} className={cn('h-0.5 w-6 transition-colors', i === active ? 'bg-ink' : 'bg-line-strong')} />
            ))}
          </div>
        )}
      </div>
      {/* Desktop */}
      <div className="hidden grid-cols-2 gap-1 lg:grid">
        {desktop.map((img, i) => (
          <button key={img.url + i} type="button" onClick={() => setZoom(img.detail ? 0 : i)} className="group relative block cursor-zoom-in overflow-hidden bg-paper-2" aria-label={`Phóng to ảnh ${i + 1}`}>
            <img
              src={img.url}
              alt={img.alt}
              className={cn('aspect-[3/4] w-full object-cover transition-transform duration-700', img.detail ? 'scale-[1.9] group-hover:scale-[2]' : 'group-hover:scale-[1.02]')}
              style={img.detail ? { objectPosition: '50% 45%' } : undefined}
              loading={i < 2 ? 'eager' : 'lazy'}
            />
            {img.detail && <span className="absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase">Cận cảnh chất liệu</span>}
          </button>
        ))}
      </div>
      {badges}
      {zoom != null && <Lightbox images={list} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />}
    </div>
  )
}
