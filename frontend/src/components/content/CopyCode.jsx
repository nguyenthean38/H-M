import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Ô hiển thị mã giảm giá kèm nút sao chép. */
export function CopyCode({ code, className, tone = 'light' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* trình duyệt chặn clipboard — vẫn báo đã chọn */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className={cn('inline-flex items-stretch border border-dashed', tone === 'dark' ? 'border-paper/60' : 'border-cham-300', className)}>
      <span className={cn('flex items-center px-4 font-mono text-lg font-semibold tracking-[0.18em]', tone === 'dark' ? 'text-paper' : 'text-cham')}>{code}</span>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'flex items-center gap-1.5 px-3 text-2xs font-semibold tracking-[0.12em] uppercase transition-colors',
          tone === 'dark' ? 'bg-paper text-ink hover:bg-white' : 'bg-cham text-paper hover:bg-cham-600',
        )}
        aria-label={`Sao chép mã ${code}`}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? 'Đã chép' : 'Sao chép'}
      </button>
    </div>
  )
}
