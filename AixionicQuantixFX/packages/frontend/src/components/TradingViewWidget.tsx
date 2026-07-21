import { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
  height?: number
}

export function TradingViewWidget({ symbol, theme = 'light', height = 400 }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TradingView = (window as any).TradingView
      if (TradingView) {
        new TradingView.widget({
          autosize: true,
          symbol,
          theme,
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? '#1a1a2e' : '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerRef.current.id,
          height,
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [symbol, theme, height])

  return (
    <div
      id={`tradingview-${symbol}`}
      ref={containerRef}
      className="w-full rounded-lg"
      style={{ height }}
    />
  )
}