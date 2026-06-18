// "use client";

// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";

// export default function HeaderMetadataSkeleton() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full animate-pulse">
//       {/* =========================
//           LEFT CARD SKELETON
//       ========================== */}
//       <Card className="border border-border/60 bg-card">
//         <CardHeader className="flex flex-row items-center gap-4 pb-4">
//           {/* Avatar/Icon */}
//           <div className="h-12 w-12 rounded-xl bg-black/10 dark:bg-white/10" />

//           <div className="space-y-2 flex-1">
//             {/* Username */}
//             <div className="h-4 w-32 rounded bg-black/10 dark:bg-white/10" />

//             {/* Email */}
//             <div className="h-3 w-48 rounded bg-black/10 dark:bg-white/10" />
//           </div>

//           {/* Badge */}
//           <div className="h-5 w-20 rounded-full bg-black/10 dark:bg-white/10" />
//         </CardHeader>

//         <CardContent className="border-t border-border/40 bg-muted/20 px-6 py-3 flex justify-between items-center">
//           <div className="h-3 w-32 rounded bg-black/10 dark:bg-white/10" />
//           <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
//         </CardContent>
//       </Card>

//       {/* =========================
//           RIGHT CARD SKELETON
//       ========================== */}
//       <Card className="lg:col-span-2 border border-border/60 bg-card">
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
//             {/* Field 1 */}
//             <div className="flex gap-3">
//               <div className="h-9 w-9 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
//               <div className="space-y-2 w-full">
//                 <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
//                 <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
//               </div>
//             </div>

//             {/* Field 2 */}
//             <div className="flex gap-3">
//               <div className="h-9 w-9 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
//               <div className="space-y-2 w-full">
//                 <div className="h-3 w-28 rounded bg-black/10 dark:bg-white/10" />
//                 <div className="h-4 w-44 rounded bg-black/10 dark:bg-white/10" />
//               </div>
//             </div>

//             {/* Field 3 */}
//             <div className="flex gap-3">
//               <div className="h-9 w-9 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
//               <div className="space-y-2 w-full">
//                 <div className="h-3 w-32 rounded bg-black/10 dark:bg-white/10" />
//                 <div className="h-4 w-36 rounded bg-black/10 dark:bg-white/10" />
//               </div>
//             </div>

//             {/* Field 4 */}
//             <div className="flex gap-3">
//               <div className="h-9 w-9 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
//               <div className="space-y-2 w-full">
//                 <div className="h-3 w-36 rounded bg-black/10 dark:bg-white/10" />
//                 <div className="h-4 w-52 rounded bg-black/10 dark:bg-white/10" />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HeaderMetadataSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {/* =========================
          LEFT CARD SKELETON
      ========================== */}
      <Card className="border-l-4 border-l-primary/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {/* Avatar Icon */}
            <div className="h-14 w-14 rounded-full bg-black/10 dark:bg-white/10" />

            <div className="space-y-2">
              {/* Username */}
              <div className="h-5 w-32 rounded bg-black/10 dark:bg-white/10" />
              {/* Badge */}
              <div className="h-5 w-20 rounded bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        </CardHeader>

        {/* Footer/Content area */}
        <CardContent className="bg-muted/30 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="h-3 w-40 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-6 w-16 rounded bg-black/10 dark:bg-white/10" />
          </div>
        </CardContent>
      </Card>

      {/* =========================
          RIGHT CARD SKELETON
      ========================== */}
      <Card className="lg:col-span-2 border-border shadow-sm">
        <CardHeader className="pb-2 pt-4 border-b">
          {/* Title Area */}
          <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fields (Matches InfoField component structure) */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="h-10 w-10 rounded-md bg-black/10 dark:bg-white/10 shrink-0" />
                <div className="space-y-2 w-full mt-1">
                  <div className="h-2 w-16 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-4 w-32 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
