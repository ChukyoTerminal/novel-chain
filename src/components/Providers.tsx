'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProperties {
  children: ReactNode
}

export function Providers({ children }: ProvidersProperties) {
  return (
    <SessionProvider basePath="/api/mock/auth">
      {children}
    </SessionProvider>
  )
}
