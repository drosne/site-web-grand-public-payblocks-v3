"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DataFromGlobalSlug } from 'payload'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export function SidebarLayout({ 
  children, 
  header 
}: { 
  children: React.ReactNode
  header: DataFromGlobalSlug<'header'>
}) {
  return (
    <SidebarProvider>
      <AppSidebar header={header} />
      <SidebarInset className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            {header.logo && typeof header.logo === 'object' && 'url' in header.logo ? (
              <img 
                src={`${NEXT_PUBLIC_SERVER_URL}${header.logo.url}`} 
                alt="Justice.cool Logo" 
                className="h-6 w-6 object-contain"
              />
            ) : (
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-sm" />
              </div>
            )}
            <span className="text-sm font-semibold">Justice.cool</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
