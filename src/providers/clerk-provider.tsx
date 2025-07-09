"use client"

import { ClerkProvider as AuthProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { ThemeProvider } from "./theme-provider";
import { dark } from "@clerk/themes";


export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthProvider appearance={{
        baseTheme: dark
      }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Suspense>
  )
}