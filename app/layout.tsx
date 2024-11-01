import {Analytics} from '@vercel/analytics/react';
import type {Metadata} from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Inter } from 'next/font/google'
import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode } from 'react'
import React from 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    placeholder?: string
    onPointerEnterCapture?: React.PointerEventHandler
    onPointerLeaveCapture?: React.PointerEventHandler
    crossOrigin?: string
  }
}

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'OPRF Hour Tracker',
    description: 'A simple viewer for the OPRF hour tracker',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
