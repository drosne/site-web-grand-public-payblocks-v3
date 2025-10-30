"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Earth,
  FileText,
  Zap,
  Info,
  Library,
  Newspaper,
  Dumbbell,
  Network,
  UserCheck,
  UserCircle,
  FolderOpen,
  ChevronDown,
  ExternalLink,
  PanelLeft,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/utilities/cn"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { JusticeCoolLogo } from "@/components/ui/justice-cool-logo"
import { JusticeCoolText } from "@/components/ui/justice-cool-text"
import { DataFromGlobalSlug } from 'payload'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export function AppSidebar({ header }: { header: DataFromGlobalSlug<'header'> }) {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const [isDossiersOpen, setIsDossiersOpen] = React.useState(false)

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="relative group h-8 flex items-center">
            {header.logo && typeof header.logo === 'object' && 'url' in header.logo ? (
              <img 
                src={`${NEXT_PUBLIC_SERVER_URL}${header.logo.url}`} 
                alt="Justice.cool Logo" 
                className="h-8 w-8 object-contain"
              />
            ) : (
              <JusticeCoolLogo className="h-8 w-8" />
            )}
            {/* Bouton expand au hover en mode collapsed */}
            {isCollapsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20 rounded text-primary-foreground"
                  onClick={toggleSidebar}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex flex-col items-start justify-center ml-2 h-8">
                <JusticeCoolText className="h-3 w-auto" />
                <span className="text-xs text-muted-foreground">Site Grand Public</span>
              </div>
              {/* Bouton collapse visible en mode étendu */}
              <Button 
                variant="ghost" 
                size="icon"
                className="ml-auto h-6 w-6 p-0 hover:bg-gray-100 rounded"
                onClick={toggleSidebar}
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Earth className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Organisations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Articles</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Offres</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-2">
        {/* Menu secondaire */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu Secondaire</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Info className="h-4 w-4 shrink-0" />
                  <span className="flex-1">À propos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Library className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Mentions Légales</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Newspaper className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Presse</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="items-center">
                  <Dumbbell className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Professionnels de justice</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Séparateur */}
        <div className="w-full h-px bg-[hsl(var(--sidebar-border))]" />
        
        {/* Menu utilisateur */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback className="text-sm bg-blue-500 text-white">RD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-medium truncate">Romain DROSNE</span>
                        <span className="text-xs text-muted-foreground truncate">Fondateur Justice.cool</span>
                      </div>
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Section Dossiers */}
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                      Dossiers
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <a 
                        href="https://app.justice.cool/dossiers" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        <span>Mes dossiers en cours</span>
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Section Compte */}
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                      Compte
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <a 
                        href="/user/public" 
                        className="flex items-center w-full"
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Espace utilisateur public</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a 
                        href="/user/profil" 
                        className="flex items-center w-full"
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Mon profil utilisateur</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a 
                        href="https://app.justice.cool/entreprise" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <Network className="mr-2 h-4 w-4" />
                        <span>Mon profil entreprise</span>
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a 
                        href="https://app.justice.cool/organisations" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full"
                      >
                        <Earth className="mr-2 h-4 w-4" />
                        <span>Mes organisations</span>
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a 
                        href="/user/articles" 
                        className="flex items-center w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Mes articles</span>
                      </a>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}