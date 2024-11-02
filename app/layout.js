import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import Loader from '@/components/Loader';
import localFont from "next/font/local";
import "./globals.css";
import { EdgeStoreProvider } from '@/lib/edgestore';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Campus Champ',
  description: 'Next auth with clerk and mongodb',
};

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider  appearance={{
      elements: {
        footer: "hidden",
      },
    }}>
      <html lang='en'>
       
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>
         
           <EdgeStoreProvider>{children}</EdgeStoreProvider> 
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}