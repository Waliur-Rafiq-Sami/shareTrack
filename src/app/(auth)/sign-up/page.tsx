// "use client";

// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDebounce } from "usehooks-ts";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Eye,
//   EyeOff,
//   Loader2,
//   CheckCircle2,
//   XCircle,
//   Lock,
//   ArrowLeft,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { signUpSchema } from "@/schemas/signUpSchema";
// import ThemeToggle from "@/components/ThemeToggle";
// import { toast } from "@/lib/toast-service";

// // Dynamically extend your existing schema to add robust password validation parity checks
// const localSignUpSchema = signUpSchema
//   .extend({
//     confirmPassword: z.string().min(1, "Password confirmation is required"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// export default function SignUpForm() {
//   const [username, setUsername] = useState("");
//   const [usernameMessage, setUsernameMessage] = useState("");
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const debouncedUsername = useDebounce(username, 300);

//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const form = useForm<z.infer<typeof localSignUpSchema>>({
//     resolver: zodResolver(localSignUpSchema),
//     defaultValues: {
//       username: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       dateOfBirth: "",
//       phoneNumber: "",
//       address: "",
//       profession: "",
//     },
//   });

//   // Watch fields to render instant visual feedback validation updates
//   const passwordValue = form.watch("password");
//   const confirmPasswordValue = form.watch("confirmPassword");

//   useEffect(() => {
//     const checkUsernameUnique = async () => {
//       if (debouncedUsername) {
//         setIsCheckingUsername(true);
//         setUsernameMessage("");
//         try {
//           const res = await fetch(
//             `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`,
//           );
//           const data: ApiResponse = await res.json();

//           if (!res.ok) {
//             throw new Error(data.message || "Error checking username");
//           }

//           setUsernameMessage(data.message);
//         } catch (error: any) {
//           setUsernameMessage(error.message || "Error checking username");
//         } finally {
//           setIsCheckingUsername(false);
//         }
//       }
//     };
//     checkUsernameUnique();
//   }, [debouncedUsername]);

//   const onSubmit = async (values: z.infer<typeof localSignUpSchema>) => {
//     setIsSubmitting(true);
//     try {
//       // Destructure confirmPassword away so your backend payload contract stays perfectly clean
//       const { confirmPassword, ...signUpData } = values;

//       const res = await fetch("/api/sign-up", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signUpData),
//       });

//       const data: ApiResponse = await res.json();

//       if (!res.ok) {
//         throw new Error(
//           data.message || "There was a problem with your sign-up.",
//         );
//       }

//       if (typeof window !== "undefined") {
//         sessionStorage.setItem(
//           "ShareTrack_pending_signup_credentials",
//           JSON.stringify({
//             identifier: values.email,
//             password: values.password,
//           }),
//         );
//       }

//       toast.success({
//         title: "Success",
//         description: data.message,
//       });

//       router.replace(
//         `/verify/${encodeURIComponent(values.username)}?email=${encodeURIComponent(values.email)}`,
//       );
//     } catch (error: any) {
//       console.error("Error during sign-up:", error);
//       toast.error({
//         title: "Sign Up Failed",
//         description: error.message,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isUsernameValid = usernameMessage === "Username is unique";
//   const doPasswordsMatch =
//     passwordValue &&
//     confirmPasswordValue &&
//     passwordValue === confirmPasswordValue;

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 py-10">
//       <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 px-8 py-10 shadow-2xl shadow-black/15 backdrop-blur-xl transition-colors duration-300">
//         <div className="absolute left-5 top-3 z-20">
//           <Link
//             href="/"
//             className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary shadow-[0_0_1rem_-0.25rem_rgba(59,130,246,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_1.5rem_-0.25rem_rgba(59,130,246,0.4)] active:scale-95 active:border-primary/50 active:bg-primary/20 sm:px-4 sm:hover:scale-105"
//           >
//             {/* Continuous slow pulsing background to catch the eye instantly */}
//             <span className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

//             {/* Shimmer sweep effect (Triggers on hover for desktop, tap for mobile) */}
//             <span className="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%] group-active:translate-x-[100%]" />

//             {/* Arrow Container - Distinct initial tinted style */}
//             <div className="flex items-center justify-center rounded-full bg-primary/10 p-1 shadow-sm ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40 group-active:bg-primary/30">
//               <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 group-active:-translate-x-1" />
//             </div>
//             <span>Home</span>
//           </Link>
//         </div>
//         <div className="absolute right-5 top-5">
//           <ThemeToggle />
//         </div>
//         <div className="space-y-4 pb-6 border-b border-border/50 pt-5">
//           <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
//             Softwarence LTD
//           </p>
//           <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
//             Create your Share<span className="text-blue-500">Track</span>{" "}
//             account
//           </h1>
//           <p className="max-w-xl text-sm leading-7 text-muted-foreground">
//             Welcome to Softwarence LTD. Share your personal details below and
//             start using ShareTrack with a secure, professional signup flow.
//           </p>
//         </div>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-5 mt-6"
//           >
//             {/* Username */}
//             <FormField
//               name="username"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <div className="relative flex items-center">
//                     <Input
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         setUsername(e.target.value);
//                       }}
//                       placeholder="john_doe"
//                       className={`pr-10 transition-all duration-200 ${
//                         username && !isCheckingUsername
//                           ? isUsernameValid
//                             ? "border-green-500/50 focus-visible:ring-green-500/30"
//                             : "border-destructive/50 focus-visible:ring-destructive/30"
//                           : ""
//                       }`}
//                     />
//                     <div className="absolute right-3 flex items-center pointer-events-none">
//                       {isCheckingUsername && (
//                         <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                       )}
//                       {!isCheckingUsername &&
//                         username &&
//                         (isUsernameValid ? (
//                           <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in-75 duration-200" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-destructive animate-in fade-in zoom-in-75 duration-200" />
//                         ))}
//                     </div>
//                   </div>

//                   {!isCheckingUsername && usernameMessage && (
//                     <div
//                       className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border mt-1.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${
//                         isUsernameValid
//                           ? "bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20"
//                           : "bg-destructive/5 text-red-500 border-destructive/20"
//                       }`}
//                     >
//                       <span>{usernameMessage}</span>
//                     </div>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Email */}
//             <FormField
//               name="email"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <Input {...field} placeholder="you@company.com" />
//                   <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
//                     We will send you a verification code
//                   </p>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Date of Birth & Phone Number */}
//             <div className="grid gap-4 sm:grid-cols-2">
//               <FormField
//                 name="dateOfBirth"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Date of Birth</FormLabel>
//                     <Input {...field} type="date" />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="phoneNumber"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone Number</FormLabel>
//                     <Input {...field} type="tel" placeholder="+123 456 7890" />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Address */}
//             <FormField
//               name="address"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <Input
//                     {...field}
//                     placeholder="123 Business St, City, Country"
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Profession */}
//             <FormField
//               name="profession"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Profession (optional)</FormLabel>
//                   <Input {...field} placeholder="Engineer, Doctor, Farmer" />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Primary Password Field */}
//             <FormField
//               name="password"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       {...field}
//                       placeholder="••••••••"
//                       className="pl-9 pr-12 transition-all duration-200"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((current) => !current)}
//                       className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4.5 w-4.5" />
//                       ) : (
//                         <Eye className="h-4.5 w-4.5" />
//                       )}
//                     </button>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Confirm Password Field with Dynamic Edge Checks */}
//             <FormField
//               name="confirmPassword"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
//                     <Input
//                       type={showConfirmPassword ? "text" : "password"}
//                       {...field}
//                       placeholder="••••••••"
//                       className={`pl-9 pr-12 transition-all duration-200 ${
//                         confirmPasswordValue
//                           ? doPasswordsMatch
//                             ? "border-green-500/50 focus-visible:ring-green-500/30"
//                             : "border-destructive/50 focus-visible:ring-destructive/30"
//                           : ""
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword((current) => !current)
//                       }
//                       className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4.5 w-4.5" />
//                       ) : (
//                         <Eye className="h-4.5 w-4.5" />
//                       )}
//                     </button>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Form Actions Guardrails */}
//             <Button
//               type="submit"
//               className="w-full py-3 text-base font-semibold shadow-md active:scale-[0.98] transition-transform duration-100 mt-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
//               disabled={isSubmitting || isCheckingUsername || !isUsernameValid}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>
//           </form>
//         </Form>
//         <div className="text-center mt-6">
//           <p className="text-sm text-muted-foreground">
//             Already a member?{" "}
//             <Link
//               href="/sign-in"
//               className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "@/lib/toast-service";

const localSignUpSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for the Test Mode OTP Modal
  const [testOtp, setTestOtp] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 300);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof localSignUpSchema>>({
    resolver: zodResolver(localSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      profession: "",
    },
  });

  const passwordValue = form.watch("password");
  const confirmPasswordValue = form.watch("confirmPassword");

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await fetch(
            `/api/check-username-unique?username=${encodeURIComponent(
              debouncedUsername,
            )}`,
          );
          const data: ApiResponse = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Error checking username");
          }

          setUsernameMessage(data.message);
        } catch (error: any) {
          setUsernameMessage(error.message || "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (values: z.infer<typeof localSignUpSchema>) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...signUpData } = values;

      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "There was a problem with your sign-up.",
        );
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "ShareTrack_pending_signup_credentials",
          JSON.stringify({
            identifier: values.email,
            password: values.password,
          }),
        );
      }

      // Check if we received a verifyCode (Test Mode)
      if (data.verifyCode) {
        // Show the large modal instead of an alert
        setTestOtp(data.verifyCode);
      } else {
        toast.success({
          title: "Success",
          description: data.message,
        });
        router.replace(
          `/verify/${encodeURIComponent(
            values.username,
          )}?email=${encodeURIComponent(values.email)}`,
        );
      }
    } catch (error: any) {
      console.error("Error during sign-up:", error);
      toast.error({
        title: "Sign Up Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameValid = usernameMessage === "Username is unique";
  const doPasswordsMatch =
    passwordValue &&
    confirmPasswordValue &&
    passwordValue === confirmPasswordValue;

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground px-4 py-10 relative">
      {/* LARGE TEST MODE MODAL OVERLAY */}
      {testOtp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card border border-border p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(245,158,11,0.5)] text-center space-y-8 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />

            <div className="mx-auto inline-flex items-center justify-center bg-amber-500/10 text-amber-500 p-5 rounded-full mb-2">
              <AlertTriangle className="h-12 w-12" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Developer Test Mode
              </h2>
              <p className="text-base text-muted-foreground px-4">
                Since domain verification is pending, email delivery is
                restricted. Use the verification code below to activate this
                account.
              </p>
            </div>

            <div className="bg-muted p-8 rounded-2xl border border-border flex items-center justify-center shadow-inner">
              <span className="text-6xl font-mono font-black tracking-[0.2em] text-primary selection:bg-transparent">
                {testOtp}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold shadow-lg transition-transform active:scale-95"
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText(testOtp);
                toast.success({
                  title: "Copied!",
                  description: "Verification code copied to clipboard.",
                });

                // Hide modal and redirect
                setTestOtp(null);
                router.push(
                  `/verify/${encodeURIComponent(
                    form.getValues("username"),
                  )}?email=${encodeURIComponent(form.getValues("email"))}`,
                );
              }}
            >
              Copy Code & Continue
            </Button>
          </div>
        </div>
      )}

      {/* STANDARD SIGN UP FORM UI */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 px-8 py-10 shadow-2xl shadow-black/15 backdrop-blur-xl transition-colors duration-300">
        <div className="absolute left-5 top-3 z-20">
          <Link
            href="/"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary shadow-[0_0_1rem_-0.25rem_rgba(59,130,246,0.2)] backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_1.5rem_-0.25rem_rgba(59,130,246,0.4)] active:scale-95 active:border-primary/50 active:bg-primary/20 sm:px-4 sm:hover:scale-105"
          >
            <span className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
            <span className="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%] group-active:translate-x-[100%]" />
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-1 shadow-sm ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40 group-active:bg-primary/30">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 group-active:-translate-x-1" />
            </div>
            <span>Home</span>
          </Link>
        </div>
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <div className="space-y-4 pb-6 border-b border-border/50 pt-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Softwarence LTD
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Create your Share<span className="text-blue-500">Track</span>{" "}
            account
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Welcome to Softwarence LTD. Share your personal details below and
            start using ShareTrack with a secure, professional signup flow.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-6"
          >
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                      placeholder="john_doe"
                      className={`pr-10 transition-all duration-200 ${
                        username && !isCheckingUsername
                          ? isUsernameValid
                            ? "border-green-500/50 focus-visible:ring-green-500/30"
                            : "border-destructive/50 focus-visible:ring-destructive/30"
                          : ""
                      }`}
                    />
                    <div className="absolute right-3 flex items-center pointer-events-none">
                      {isCheckingUsername && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!isCheckingUsername &&
                        username &&
                        (isUsernameValid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in-75 duration-200" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive animate-in fade-in zoom-in-75 duration-200" />
                        ))}
                    </div>
                  </div>

                  {!isCheckingUsername && usernameMessage && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border mt-1.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${
                        isUsernameValid
                          ? "bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20"
                          : "bg-destructive/5 text-red-500 border-destructive/20"
                      }`}
                    >
                      <span>{usernameMessage}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} placeholder="you@company.com" />
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth & Phone Number */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                name="dateOfBirth"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input {...field} type="date" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <Input {...field} type="tel" placeholder="+123 456 7890" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input
                    {...field}
                    placeholder="123 Business St, City, Country"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Profession */}
            <FormField
              name="profession"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession (optional)</FormLabel>
                  <Input {...field} placeholder="Engineer, Doctor, Farmer" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="••••••••"
                      className="pl-9 pr-12 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      placeholder="••••••••"
                      className={`pl-9 pr-12 transition-all duration-200 ${
                        confirmPasswordValue
                          ? doPasswordsMatch
                            ? "border-green-500/50 focus-visible:ring-green-500/30"
                            : "border-destructive/50 focus-visible:ring-destructive/30"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold shadow-md active:scale-[0.98] transition-transform duration-100 mt-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
              disabled={isSubmitting || isCheckingUsername || !isUsernameValid}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
