"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon, PlusIcon, MailIcon, GlobeIcon, MapPinIcon, CheckCircle2 } from "lucide-react";
import DotPattern from "@/components/ui/dot-pattern";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  className?: string;
};

type ContactCardProps = {
  title?: string;
  description?: string;
  contactInfo?: ContactInfoItem[];
  className?: string;
};

export function ContactCard({
  title = "Get in touch with Ayush",
  description = "Have questions about FlowForge AI, custom enterprise integrations, or collaborative opportunities? Send a message and I will respond within 24 hours.",
  contactInfo = [
    {
      icon: MailIcon,
      label: "Email",
      value: "ayushdubey23.dev@gmail.com",
      href: "mailto:ayushdubey23.dev@gmail.com",
    },
    {
      icon: GlobeIcon,
      label: "Portfolio",
      value: "ayushdubey23.vercel.app",
      href: "https://ayushdubey23.vercel.app/",
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: "Uttar Pradesh, India (MMMUT)",
      className: "col-span-2",
    },
  ],
  className,
}: ContactCardProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div
      className={cn(
        "relative grid w-full border-2 border-white/10 bg-white/5 backdrop-blur-md shadow-2xl md:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden",
        className
      )}
    >
      <DotPattern width={6} height={6} />
      <PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]" />
      <PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]" />
      <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]" />
      <PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)]" />

      {/* Left Info Column */}
      <div className="flex flex-col justify-between p-6 md:p-10 lg:col-span-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <span>Direct Line</span>
          </div>
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_60%)] font-open-sans-custom">
            {title}
          </h1>
          <p className="max-w-xl text-sm md:text-base text-gray-300 [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)] font-open-sans-custom">
            {description}
          </p>

          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              const content = (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10",
                    info.className
                  )}
                >
                  <div className="rounded-lg bg-white/10 p-2.5 text-white">
                    <Icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 font-open-sans-custom uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="text-sm font-semibold text-white font-open-sans-custom truncate">
                      {info.value}
                    </p>
                  </div>
                </div>
              );

              return info.href ? (
                <a
                  key={idx}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                content
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex flex-col justify-center border-t border-white/10 bg-white/10 p-6 md:col-span-1 md:border-t-0 md:border-l">
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h3 className="text-lg font-bold text-white font-open-sans-custom">
              Message Transmitted!
            </h3>
            <p className="text-xs text-gray-300 font-open-sans-custom">
              Thank you for reaching out. Ayush Dubey will review your message and reply promptly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", message: "" });
              }}
              className="mt-4 text-xs text-indigo-300 hover:text-white underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-name" className="text-white font-open-sans-custom text-xs">
                Your Name
              </Label>
              <Input
                id="contact-name"
                type="text"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email" className="text-white font-open-sans-custom text-xs">
                Email Address
              </Label>
              <Input
                id="contact-email"
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-message" className="text-white font-open-sans-custom text-xs">
                Message / Inquiry
              </Label>
              <Textarea
                id="contact-message"
                required
                rows={3}
                placeholder="How can FlowForge AI or Ayush help your team?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md py-2.5 px-4 bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all font-open-sans-custom uppercase tracking-wider active:scale-98 shadow-md"
            >
              Transmit Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactCard;
