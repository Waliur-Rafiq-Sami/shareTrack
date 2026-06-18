"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  LogOut,
  Moon,
  Sun,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Plus,
  Settings,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import LogoutDialog from "./LogoutDialog";
import UnifiedProfileModal from "@/components/profile/UnifiedProfileModal";
import { TradeModal } from "../dashboard/TradeModal";
import { WalletModal } from "../dashboard/WalletModal";

export default function NavActions() {
  const { data: session, status } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [walletModal, setWalletModal] = useState({
    isOpen: false,
    type: "DEPOSIT",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleActionSuccess = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] }),
        queryClient.invalidateQueries({ queryKey: ["portfolio", "holdings"] }),
      ]);
    } catch (error) {
      console.error("Failed to invalidate dashboard cache maps:", error);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/sign-in");
    setIsLoggingOut(false);
    setShowLogoutAlert(false);
  };

  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark");

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
      {status === "loading" ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : session ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 border border-blue-500/20 bg-blue-500/5 transition-all duration-300 ease-out hover:scale-105 hover:border-blue-500/50 hover:bg-blue-500/15 hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/50 flex items-center justify-center group"
              >
                <User className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 p-2 shadow-2xl rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md"
            >
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => setIsTradeModalOpen(true)}
                className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shadow-sm">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>

                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight">
                      Trade Assets
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-none mt-0.5">
                      Execute buy or sell orders
                    </span>
                  </div>

                  <div className="flex items-center justify-center h-6 w-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                </div>
              </DropdownMenuItem>

              <div className="grid grid-cols-2 gap-1.5 my-2 px-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-14 flex-col gap-1 rounded-xl bg-muted/30 border-muted hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:bg-emerald-500/20 transition-all group"
                  onClick={() =>
                    setWalletModal({ isOpen: true, type: "DEPOSIT" })
                  }
                >
                  <PiggyBank className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[11px] font-medium tracking-tight">
                    Deposit
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-14 flex-col gap-1 rounded-xl bg-muted/30 border-muted hover:bg-blue-500/10 hover:text-blue-500 dark:hover:bg-blue-500/20 transition-all group"
                  onClick={() =>
                    setWalletModal({ isOpen: true, type: "WITHDRAW" })
                  }
                >
                  <Wallet className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  <span className="text-[11px] font-medium tracking-tight">
                    Withdraw
                  </span>
                </Button>
              </div>

              <DropdownMenuSeparator className="my-1" />

              {/* UPGRADED PROFILE SETTINGS ITEM */}
              <DropdownMenuItem
                onClick={() => setShowProfileModal(true)}
                className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-indigo-500/10 focus:bg-indigo-500/10 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                </div>

                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm tracking-tight text-foreground">
                      Profile Settings
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-none mt-0.5">
                      Manage account & security
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </DropdownMenuItem>

              <div className="flex items-center justify-between px-3 py-2.5 mt-1 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/80">
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-sm">Dark Mode</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
                />
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowLogoutAlert(true)}
                className="cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 rounded-xl font-medium p-3 mt-1 group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 mr-3 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                  <LogOut className="h-4 w-4" />
                </div>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Core Configuration Modals */}
          <UnifiedProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
          />
          <LogoutDialog
            open={showLogoutAlert}
            onOpenChange={setShowLogoutAlert}
            onConfirm={handleLogout}
            isLoggingOut={isLoggingOut}
          />

          <TradeModal
            isOpen={isTradeModalOpen}
            onClose={() => setIsTradeModalOpen(false)}
            onSuccess={handleActionSuccess}
          />

          <WalletModal
            isOpen={walletModal.isOpen}
            type={walletModal.type as "DEPOSIT" | "WITHDRAW"}
            onClose={() =>
              setWalletModal((prev) => ({ ...prev, isOpen: false }))
            }
            onSuccess={handleActionSuccess}
          />
        </>
      ) : (
        <Link href="/sign-in">
          <Button className="bg-blue-600 hover:bg-blue-700 font-semibold tracking-wide px-5 text-white transition-all active:scale-[0.98]">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}
