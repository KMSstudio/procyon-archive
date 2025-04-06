/* @/app/layout.js */

import { Inter } from "next/font/google";
import AuthProvider from "./components/main/SessionProvider";
import "@/styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CSE Archive",
  description: "경성제국대학 전자계산기학과의 아카이브",
  openGraph: {
    title: "CSE Archive",
    description: "경성제대 컴공과 아카이브",
    url: "https://cse-archive.com",
    siteName: "CSE Archive",
    images: [
      {
        url: "/image/opengraph/erin.png",
        width: 1200,
        height: 630,
        alt: "CSE Archive 페이지",
      },
    ],
    type: "website",
  },
  icons: {
		icon: "/image/opengraph/favicon.png",
	},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={inter.className} style={{ width: "100vw", height: "100vh" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}