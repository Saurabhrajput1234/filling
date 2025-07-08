import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "../store/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Portal",
  description: "A full-stack job portal like Naukri.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
