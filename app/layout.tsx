import type { Metadata } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/vazirmatn";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("http://localhost:3000");

  return {
    metadataBase,
    title: "رضا شکورزاد | مسیر یادگیری شخصی هوش مصنوعی و ریاضی",
    description:
      "با تعیین سطح کوتاه، مسیر مناسب یادگیری هوش مصنوعی یا ریاضی را پیدا کنید و دوره‌های متناسب با توانایی‌های خود را بشناسید.",
    openGraph: {
      title: "رضا شکورزاد | مسیر یادگیری شخصی",
      description: "نقطه شروع خود را بشناس و مسیر مناسب یادگیری را انتخاب کن.",
      locale: "fa_IR",
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "رضا شکورزاد، مسیر یادگیری شخصی",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "رضا شکورزاد | مسیر یادگیری شخصی",
      description: "نقطه شروع خود را بشناس و مسیر مناسب یادگیری را انتخاب کن.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
