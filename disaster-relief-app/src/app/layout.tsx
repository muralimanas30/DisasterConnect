import ClientOnlyProvider from "@/components/ClientOnlyProvider";
import "./globals.css";
import Providers from "@/components/providers";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Disaster Relief Coordination System",
  description: "Help when it's needed most.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientOnlyProvider>
          <Providers>
            <main className="">{children}</main>
          </Providers>
        </ClientOnlyProvider>
      </body>
    </html>
  );
}
