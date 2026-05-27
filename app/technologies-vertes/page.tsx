import { Manrope, Syne } from "next/font/google";

import { App } from "@/components/museum/App";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function TechnologiesVertesPage() {
  return (
    <div className={`${syne.variable} ${manrope.variable}`}>
      <App />
    </div>
  );
}
