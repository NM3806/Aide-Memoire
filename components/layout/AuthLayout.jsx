"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen bg-muted/30">
      {/* Faint grid background */}
      <div className="absolute inset-0 bg-grid bg-gradient pointer-events-none" />

      {/* Left panel */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex relative w-1/2 flex-col justify-between p-12 border-r border-border bg-card/70 backdrop-blur-sm"
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-grid bg-gradient pointer-events-none" />

        {/* Top: Logo + tagline */}
        <div className="relative z-10">
          <Link href="/dashboard" className='cursor-pointer'>
            <Image
              src="/logo.png"
              alt="aide-memoire logo"
              width={180}
              height={40}
              priority
            />
          </Link>
          <p className="mt-3 text-muted-foreground max-w-sm leading-relaxed">
            Your personal knowledge base. Write, organize, and collaborate beautifully.
          </p>
        </div>

        {/* Center illustration */}
        <div className="relative z-10 flex justify-center">
          <Image
            src="/undraw_saving-notes.svg"
            alt="Character illustration"
            width={400}
            height={400}
            priority
            className="drop-shadow-md"
          />
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-muted-foreground text-center">
          Built with Next.js · Clerk · shadcn/ui · Tailwind · Framer Motion
        </p>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 items-center justify-center px-6 md:px-12 relative z-10"
      >
        <div className="w-full max-w-md space-y-6">
          {/* Title + subtitle */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>

          {/* Auth form card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg border border-border rounded-2xl bg-card/80 backdrop-blur">
              <CardContent className="p-6">{children}</CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
