"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogIn, UserPlus, LogOut } from "lucide-react"

const navigationData = {
  navMain: [
    {
      title: "Experiments",
      url: "/experiments",
      items: [
        {
          title: "View Experiments",
          url: "/experiments",
        },
        {
          title: "Add Experiment",
          url: "/experiments/add",
        },
      ],
    },
    {
      title: "Resources",
      url: "/view-resources",
      items: [
        {
          title: "View Resources",
          url: "/view-resources",
        },
        {
          title: "Add Resources",
          url: "/add-resources",
        },
      ],
    },
    {
      title: "Timetable",
      url: "/timetable",
      items: [
        {
          title: "View Timetable",
          url: "/time-table",
        },
        {
          title: "Add Schedule",
          url: "/time-table/add",
        },
      ],
    },
    {
      title: "API Documentation",
      url: "/api-listing",
      items: [
        {
          title: "API Listing",
          url: "/api-listing",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-bold tracking-tight">LabWise</div>
        </div>
        <ThemeSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navigationData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <a href={subItem.url}>{subItem.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <div className="mt-auto p-4 border-t">
        {session ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user?.image ?? ""} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0) ?? session.user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{session.user?.name}</span>
                <span className="text-xs text-muted-foreground">{session.user?.role}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full" 
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/signin">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
      <SidebarRail />
    </Sidebar>
  )
}
