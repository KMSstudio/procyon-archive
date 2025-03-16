import { Inter } from "next/font/google";
import AuthProvider from "./components/SessionProvider";
import "./styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CSE Archive",
  description: "경성제국대학 전자계산기학과의 아카이브",
  icons: {
		icon: "/favicon.png",
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