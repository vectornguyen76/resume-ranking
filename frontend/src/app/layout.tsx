import { Roboto_Mono } from "next/font/google";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "./context/ContextProvider";
import "./globals.css";
import ReactQueryWrapper from "./react-query/ReactQueryWrapper";

const roboto_mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "CODEX - Jobfit",
  description: "CODEX - Jobfit",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto_mono.variable}`}>
      <body>
        <ReactQueryWrapper>
          <ContextProvider>{children}</ContextProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
