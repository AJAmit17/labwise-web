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
          roles: ["PUBLIC", "STUDENT", "TEACHER"], // PUBLIC means accessible without login
        },
        {
          title: "Add Experiment",
          url: "/experiments/add",
          roles: ["TEACHER"], // Only teachers can add
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
          roles: ["PUBLIC", "STUDENT", "TEACHER"], // PUBLIC means accessible without login
        },
        {
          title: "Add Resources",
          url: "/add-resources",
          roles: ["TEACHER"], // Only teachers can add
        },
      ],
    },
    {
      title: "Timetable",
      url: "/timetable",
      roles: ["TEACHER"],
      items: [
        // {
        //   title: "View Timetable",
        //   url: "/time-table",
        //   roles: ["PUBLIC", "STUDENT", "TEACHER"], // PUBLIC means accessible without login
        // },
        {
          title: "Add Schedule",
          url: "/time-table/add",
          roles: ["TEACHER"], // Only teachers can add
        },
      ],
    },
    {
      title: "API Documentation",
      url: "/api-listing",
      roles: ["TEACHER"], // Only teachers can view API documentation
      items: [
        {
          title: "API Listing",
          url: "/api-listing",
          roles: ["TEACHER"], // Only teachers can access
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || null

  // Helper function to check if user has access to an item
  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return false
    
    // Allow access if the item has the PUBLIC role, regardless of login status
    if (itemRoles.includes("PUBLIC")) return true
    
    // If user is not logged in and the item isn't public, don't show
    if (!userRole) return false
    
    // Show if user role is in the allowed roles
    return itemRoles.includes(userRole)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-2xl font-bold tracking-tight">LabWise</div>
        </div>
        <ThemeSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navigationData.navMain
          // Only show section if user has role access to at least one item in the section
          .filter(section => !section.roles || hasAccess(section.roles) ||
            section.items.some(item => !item.roles || hasAccess(item.roles)))
          .map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items
                    // Only show items that user has access to
                    .filter(item => !item.roles || hasAccess(item.roles))
                    .map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>{item.title}</a>
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
