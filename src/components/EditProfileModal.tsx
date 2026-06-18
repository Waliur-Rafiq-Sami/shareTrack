"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Loader2,
  ShieldCheck,
  KeyRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/lib/toast-service";

import * as DialogPrimitive from "@radix-ui/react-dialog";
// ==========================================
// CRYPTOGRAPHIC SCHEMAS (ZOD VALIDATION)
// ==========================================
const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(2, "Identity alias must contain at least 2 characters"),
  profession: z.string().min(2, "Operational role declaration required"),
  phoneNumber: z.string().min(8, "Secure line trace string too short"),
  address: z
    .string()
    .min(4, "Operational nexus physical tracking footprint too brief"),
  dateOfBirth: z.string().min(1, "Temporal birth coordination trace required"),
});

const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().min(1, "Current cryptographic token key required"),
    newPassword: z
      .string()
      .min(6, "New access sequence must be at least 6 characters"),
    confirmNewPassword: z
      .string()
      .min(6, "Sequence conformation parity check required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Cryptographic validation error: Cipher keys do not align",
    path: ["confirmNewPassword"],
  });

type ProfileFormValues = z.infer<typeof profileUpdateSchema>;
type PasswordFormValues = z.infer<typeof passwordUpdateSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    dateOfBirth: string;
    phoneNumber: string;
    address: string;
    profession?: string;
  } | null;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("identity");

  // Form Initializations
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: "",
      profession: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  // Sync server scope contexts with dynamic state engines on mount/trigger hooks
  useEffect(() => {
    if (profile && isOpen) {
      profileForm.reset({
        username: profile.username || "",
        profession: profile.profession || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
      passwordForm.reset({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [profile, isOpen, profileForm, passwordForm]);

  // ==========================================
  // MUTATION 1: PROFILE META DATA MUTATOR (PUT / PATCH)
  // ==========================================
  const profileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!profile?._id)
        throw new Error("Invalid operational token target instance ID.");

      const response = await fetch("/api/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(
          err?.message || "Failed to commit corporate registry attributes.",
        );
      }
      console.log(response);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile-context"] });
      toast.success({
        title: "Profile State Synchronized",
        description:
          "Corporate matrix core records updated and locked dynamically.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast.error({
        title: "Profile Modification Rejected",
        description: error.message,
      });
    },
  });

  // ==========================================
  // MUTATION 2: CRYPTOGRAPHIC SECURE PASSWORD MUTATOR (POST)
  // ==========================================
  const passwordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(
          err?.message || "Cryptographic rotation sequence handshake aborted.",
        );
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success({
        title: "Credentials Rotated Successfully",
        description:
          "New authorization secure cipher token applied to core node.",
      });
      passwordForm.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast.error({
        title: "Rotation Handshake Failed",
        description: error.message,
      });
    },
  });

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[480px] border border-slate-800 bg-slate-950 text-slate-50 shadow-2xl rounded-xl opacity-100 overflow-hidden p-0 z-[100]"
      >
        <DialogPrimitive.Close className="absolute right-1 top-1 z-50 rounded-full p-2 hover:bg-slate-800 transition-colors group">
          <X className="h-5 w-5 text-slate-400 group-hover:text-slate-100" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>

        <div className="p-6 mt-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-slate-900 border border-slate-800 text-slate-400 p-1 rounded-lg w-full grid grid-cols-2 mb-6">
              <TabsTrigger
                value="identity"
                className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50 font-semibold text-xs tracking-wide uppercase transition-all"
              >
                <User className="h-3.5 w-3.5 mr-2" /> Identity Specs
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-slate-950 data-[state=active]:text-slate-50 font-semibold text-xs tracking-wide uppercase transition-all"
              >
                <KeyRound className="h-3.5 w-3.5 mr-2" /> Security Keys
              </TabsTrigger>
            </TabsList>

            {/* ==========================================
                TAB PANEL 1: USER CONTEXT META FORM 
                ========================================== */}
            <TabsContent
              value="identity"
              className="space-y-4 focus-visible:outline-none focus-visible:ring-0"
            >
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" /> Synchronize
                  Enterprise Scope
                </DialogTitle>
              </DialogHeader>

              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit((data) =>
                    profileMutation.mutate(data),
                  )}
                  className="space-y-4 pt-2"
                >
                  {/* Secure Locked Unmodifiable Email Node */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      System Anchor Endpoint (Immutable Email)
                    </label>
                    <div className="relative group opacity-60">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                      <Input
                        value={profile.email}
                        disabled
                        className="pl-9 h-11 font-mono tracking-wide bg-slate-900 border-slate-700 text-slate-300 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            User Handle Alias
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                              <Input
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            Corporate Profile Role
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                              <Input
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            Secure Comms Line
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                              <Input
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            Temporal Record Node (DOB)
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                              <Input
                                type="date"
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 dark:[color-scheme:dark] focus-visible:ring-1 focus-visible:ring-blue-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                          Operational Matrix Physical Nexus (Address)
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                              {...field}
                              className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-blue-500 transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-rose-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className={cn(
                      "w-full h-12 font-bold tracking-wide text-[15px] mt-6 shadow-md transition-all active:scale-[0.99]",
                      profileMutation.isPending
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white",
                    )}
                    disabled={profileMutation.isPending}
                  >
                    {profileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Synchronizing Matrix Ledger...
                      </>
                    ) : (
                      "Commit Profile Attributes"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* ==========================================
                TAB PANEL 2: PASSWORD ROTATION CRADLE 
                ========================================== */}
            <TabsContent
              value="security"
              className="space-y-4 focus-visible:outline-none focus-visible:ring-0"
            >
              <DialogHeader className="mb-2">
                <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Lock className="h-5 w-5 text-rose-500" /> Rotate Cipher
                  Credentials
                </DialogTitle>
              </DialogHeader>

              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit((data) =>
                    passwordMutation.mutate(data),
                  )}
                  className="space-y-4 pt-2"
                >
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                          Current Secret Key Cipher
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-rose-500 transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-rose-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            Generate New Cipher
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-rose-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                            Revalidate Cipher Matrix
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                                className="pl-9 h-11 bg-slate-900 border-slate-800 text-slate-100 focus-visible:ring-1 focus-visible:ring-rose-500 transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-rose-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      "w-full h-12 font-bold tracking-wide text-[15px] mt-6 shadow-md transition-all active:scale-[0.99]",
                      passwordMutation.isPending
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-rose-600 hover:bg-rose-500 text-white",
                    )}
                    disabled={passwordMutation.isPending}
                  >
                    {passwordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Reparsing Security Node Credentials...
                      </>
                    ) : (
                      "Rotate Secret Credentials"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
