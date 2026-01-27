'use client'

import { useEffect, useState } from 'react'

export function SplashCursor() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      // Create splash effect
      const splash = document.createElement('div')
      splash.className = 'splash-effect'
      splash.style.left = e.clientX + 'px'
      splash.style.top = e.clientY + 'px'
      document.body.appendChild(splash)

      setTimeout(() => {
        splash.remove()
      }, 600)
    }

    const handleClick = (e: MouseEvent) => {
      // Create click ripple
      const ripple = document.createElement('div')
      ripple.className = 'click-ripple'
      ripple.style.left = e.clientX + 'px'
      ripple.style.top = e.clientY + 'px'
      document.body.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 800)
    }

    // Throttle mouse move for performance
    let lastTime = 0
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime > 50) {
        handleMouseMove(e)
        lastTime = now
      }
    }

    document.addEventListener('mousemove', throttledMouseMove)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <style jsx global>{`
        .splash-effect {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: splash-fade 600ms ease-out forwards;
          z-index: 9999;
        }

        .click-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(236, 72, 153, 0.6);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: ripple-expand 800ms ease-out forwards;
          z-index: 9999;
        }

        @keyframes splash-fade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }

        @keyframes ripple-expand {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
          }
        }
      `}</style>
    </>
  )
}
