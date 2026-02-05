import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "./_components/ui/sonner";

const roboto = Roboto_Mono({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Scalercio Finance",
  description: "Fincance Control app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${roboto.className} dark min-h-screen w-full overflow-x-hidden antialiased`}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
            {children}
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  );
}
