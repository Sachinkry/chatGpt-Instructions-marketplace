import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { InstructionProvider } from "@/context/InstructionContext";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatGPT Instructions Marketplace",
  description: "A marketplace to share and explore custom ChatGPT instructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <AuthProvider>
            <UserProvider>
              <InstructionProvider>
                {children}
              </InstructionProvider>
            </UserProvider>
          </AuthProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
