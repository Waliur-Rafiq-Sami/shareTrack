// "use client";

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { User, Mail, Briefcase, Phone, MapPin, Calendar, ShieldCheck, Loader2, Pencil } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import HeaderMetadataSkeleton from "@/components/skeletons/HeaderMetadataSkeleton";
// import EditProfileModal from "../EditProfileModal";
// import { Button } from "../ui/button";

// interface UserProfileData {
//   _id: string;
//   username: string;
//   email: string;
//   isVerified: boolean;
//   dateOfBirth: string;
//   phoneNumber: string;
//   address: string;
//   profession?: string;
// }

// export default function HeaderMetadata() {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const {
//     data: response,
//     isLoading,
//     error,
//   } = useQuery<{ success: boolean; data: UserProfileData }>({
//     queryKey: ["user-profile-context"],
//     queryFn: async () => {
//       const res = await fetch("/api/profile");
//       if (!res.ok) throw new Error("Failed to fetch corporate profile scope.");
//       return res.json();
//     },
//     staleTime: 1000 * 60 * 15,
//   });

//   if (isLoading) {
//     return <HeaderMetadataSkeleton />;
//   }

//   if (error || !response?.success) {
//     return (
//       <div className="w-full p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
//         System Error: Failed to initialize full user profile matrix.
//       </div>
//     );
//   }

//   const profile = response.data;

//   // Format date safely for display execution
//   const formattedDOB = profile.dateOfBirth
//     ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : "Not Provided";

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch w-full">
//       {/* Module 1: Primary Identity Context Card */}
//       <Card className="shadow-sm border-border bg-card text-card-foreground lg:col-span-1">
//         <CardHeader className="flex flex-row items-center space-x-4 pb-4">
//           <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 border border-primary/10 shadow-inner">
//             <User className="h-6 w-6" />
//           </div>
//           <div className="space-y-1 min-w-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <CardTitle className="text-base tracking-tight font-bold truncate">{profile.username}</CardTitle>
//               {profile.isVerified && (
//                 <Badge
//                   variant="secondary"
//                   className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0">
//                   <ShieldCheck className="h-3 w-3 mr-0.5 inline" /> Verified
//                 </Badge>
//               )}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsEditModalOpen(true)}
//                 className="text-muted-foreground hover:text-foreground shrink-0">
//                 <Pencil className="h-4 w-4" />
//               </Button>
//             </div>
//             <CardDescription className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 truncate">
//               <Mail className="h-3 w-3 shrink-0" /> {profile.email}
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-0 border-t border-border/40 bg-muted/20 px-6 py-3 flex items-center justify-between text-xs">
//           <span className="text-muted-foreground font-medium">System Core Reference:</span>
//           <span className="font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border/80 text-foreground/80 tracking-tight">
//             {profile._id}
//           </span>
//         </CardContent>
//       </Card>

//       {/* Module 2: Corporate & Dynamic Metadata Profile */}
//       <Card className="shadow-sm border-border bg-card text-card-foreground lg:col-span-2">
//         <CardContent className="p-6 h-full flex flex-col justify-center">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//             {/* Field: Profession */}
//             <div className="flex items-start gap-3 min-w-0">
//               <div className="p-2 bg-muted rounded-lg text-muted-foreground shrink-0 mt-0.5">
//                 <Briefcase className="h-4 w-4" />
//               </div>
//               <div className="space-y-0.5 min-w-0">
//                 <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">Profession Role</span>
//                 <span className="text-sm font-semibold text-foreground truncate block">{profile.profession || "Senior System Operator"}</span>
//               </div>
//             </div>

//             {/* Field: Phone Number */}
//             <div className="flex items-start gap-3 min-w-0">
//               <div className="p-2 bg-muted rounded-lg text-muted-foreground shrink-0 mt-0.5">
//                 <Phone className="h-4 w-4" />
//               </div>
//               <div className="space-y-0.5 min-w-0">
//                 <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">Secure Line Contact</span>
//                 <span className="text-sm font-semibold text-foreground truncate block">{profile.phoneNumber}</span>
//               </div>
//             </div>

//             {/* Field: Date of Birth */}
//             <div className="flex items-start gap-3 min-w-0">
//               <div className="p-2 bg-muted rounded-lg text-muted-foreground shrink-0 mt-0.5">
//                 <Calendar className="h-4 w-4" />
//               </div>
//               <div className="space-y-0.5 min-w-0">
//                 <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">Date of Incarnation</span>
//                 <span className="text-sm font-semibold text-foreground truncate block">{formattedDOB}</span>
//               </div>
//             </div>

//             {/* Field: Physical Address Map */}
//             <div className="flex items-start gap-3 min-w-0">
//               <div className="p-2 bg-muted rounded-lg text-muted-foreground shrink-0 mt-0.5">
//                 <MapPin className="h-4 w-4" />
//               </div>
//               <div className="space-y-0.5 min-w-0">
//                 <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground block">Operational Nexus (Address)</span>
//                 <span className="text-sm font-semibold text-foreground truncate block" title={profile.address}>
//                   {profile.address}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile} />
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Briefcase, Phone, MapPin, Calendar, ShieldCheck, Pencil, Fingerprint, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeaderMetadataSkeleton from "@/components/skeletons/HeaderMetadataSkeleton";
import EditProfileModal from "../EditProfileModal";

// Helper component for uniform data rendering
const InfoField = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="p-2 bg-background border rounded-md text-muted-foreground shadow-sm">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 -mt-1.5">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</span>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  </div>
);

export default function HeaderMetadata() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<{ success: boolean; data: any }>({
    queryKey: ["user-profile-context"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading) return <HeaderMetadataSkeleton />;
  if (error || !response?.success)
    return <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg">System Error: Profile unavailable.</div>;

  const profile = response.data;
  const formattedDOB = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Not Provided";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* 1. Identity Card */}
      <Card className="relative lg:col-span-1 shadow-sm border-l-4 border-l-primary overflow-hidden">
        {/* Absolute Positioned Action */}
        <div className="absolute top-2 right-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="h-8 gap-1.5 text-xs font-semibold">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-full border border-primary/20">
              <User className="h-8 w-8" />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-bold">{profile.username}</CardTitle>
              {profile.isVerified && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] uppercase font-bold tracking-wider border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-muted/30 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="h-3 w-3" /> {profile.email}
            </span>
            <span className="font-mono bg-background px-2 py-0.5 rounded border">{profile._id.slice(-6)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Metadata Card */}
      <Card className="lg:col-span-2 shadow-sm border-border">
        <CardHeader className="pb-2 pt-4 border-b">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Fingerprint className="h-4 w-4" /> Operational Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField icon={Briefcase} label="Profession" value={profile.profession || "Senior System Operator"} />
            <InfoField icon={Phone} label="Secure Line" value={profile.phoneNumber} />
            <InfoField icon={Calendar} label="Date of Incarnation" value={formattedDOB} />
            <InfoField icon={MapPin} label="Nexus Address" value={profile.address} />
          </div>
        </CardContent>
      </Card>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile} />
    </div>
  );
}
