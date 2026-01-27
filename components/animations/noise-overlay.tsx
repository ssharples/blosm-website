'use client'

import { cn } from '../../lib/utils'

interface NoiseOverlayProps {
  className?: string
  opacity?: number
  blendMode?: 'overlay' | 'soft-light' | 'multiply' | 'screen'
}

export function NoiseOverlay({
  className = '',
  opacity = 0.03,
  blendMode = 'overlay',
}: NoiseOverlayProps) {
  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-[100]', className)}
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              seed="15"
              stitchTiles="stitch"
              result="turbulence"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <style jsx>{`
        svg {
          animation: noise-shift 0.5s steps(10) infinite;
        }
        @keyframes noise-shift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0); }
          60% { transform: translate(1%, 0); }
          70% { transform: translate(0, 1%); }
          80% { transform: translate(0, -1%); }
          90% { transform: translate(1%, 1%); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  )
}
