"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, EarIcon, UserCog, Settings, LogOut, PlusCircle, Edit, FolderOpen, FolderPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
// import Image from "next/image";
import { cn } from "@/lib/utils";

const Logo = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      LabWise
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "View Experiments",
      href: "/experiments",
      icon: <EarIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Add Experiment",
      href: "/experiments/add",
      icon: <PlusCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Edit Experiment",
      href: "/experiments/edit",
      icon: <Edit className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "View Resources",
      href: "/view-resources",
      icon: <FolderOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Add Resources",
      href: "/add-resources",
      icon: <FolderPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden",
      "min-h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between gap-10">
          <div className="flex flex-col flex-1">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "John Doe",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1">
        <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
