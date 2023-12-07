import {Analytics} from '@vercel/analytics/react';
import type {Metadata} from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Inter } from 'next/font/google'
import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'OPRF Hour Tracker',
    description: 'A simple viewer for the OPRF hour tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
