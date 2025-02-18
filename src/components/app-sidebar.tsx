import * as React from "react"
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
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          {/* Logo placeholder */}
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
      <SidebarRail />
    </Sidebar>
  )
}
