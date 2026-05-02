import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { cookies } from "next/headers";
import FarcasterWrapper from "@/components/FarcasterWrapper";
import { WagmiProvider } from "@/providers/WagmiProvider";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
        <html lang="en">
          <head>
            {requestId && <meta name="x-request-id" content={requestId} />}
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <WagmiProvider>
              <FarcasterWrapper>
                {children}
              </FarcasterWrapper>
              <Toaster />
            </WagmiProvider>
            <ResponseLogger />
          </body>
        </html>
      );
}

export const metadata: Metadata = {
        title: "Thread Master",
        description: "Unleash your logic skills in Thread Master! Reorder scrambled threads in this speedy, social puzzle game. Challenge your memory, bust out laughter, and climb to the top of the leaderboard.",
        other: { 
          "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_ad135e0f-4f6b-47bd-bdeb-5a03c5cd8fe4-CLT8jCGpXMDWDkVKK37XF1dyBYTYtE","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Thread Master","url":"https://oxygen-construction-791.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
          ),
          "base:app_id": "68f40250b6320e0dd0819adf"
        }
    };
