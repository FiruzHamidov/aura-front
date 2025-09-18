import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aura.tj";
const API_URL  = process.env.NEXT_PUBLIC_API_URL  ?? "https://backend.aura.tj/api";
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "https://storage.aura.tj";

type PropertyPhoto = { file_path: string };
type Apartment = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  currency?: "TJS" | "USD" | "RUB";
  total_area?: number;
  rooms?: number;
  location?: { name?: string };
  photos?: PropertyPhoto[];
  created_at?: string;
  updated_at?: string;
  moderation_status?: string;
  offer_type?: "sale" | "rent";
  listing_type?: "regular" | "vip";
};

async function fetchApartment(slug: string): Promise<Apartment | null> {
  const res = await fetch(`${API_URL}/properties/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

function shortDesc(a: Apartment): string {
  const bits: string[] = [];
  if (a.location?.name) bits.push(a.location.name);
  if (a.rooms) bits.push(`${a.rooms}-комнатная`);
  if (a.total_area) bits.push(`${a.total_area} м²`);
  if (a.price && a.currency) bits.push(`${a.price} ${a.currency}`);
  const tail = a.description?.slice(0, 140) ?? "";
  return `${bits.join(" · ")}.${tail ? " " + tail : ""}`.trim();
}

function firstPhotoUrl(a: Apartment): string | undefined {
  const fp = a.photos?.[0]?.file_path;
  return fp ? `${STORAGE_URL}/${fp}` : undefined;
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const apt = await fetchApartment(slug);
  if (!apt) {
    return { title: "Объект не найден — Aura", robots: { index: false, follow: false } };
  }

  const title =
      apt.title?.trim() ||
      `Купить: ${apt.rooms ? apt.rooms + "-комнатную" : ""} ${apt.total_area ? apt.total_area + " м²" : ""} — Aura Estate`;

  const description = shortDesc(apt).slice(0, 160);
  const url = `${SITE_URL}/apartment/${slug}`;
  const image = firstPhotoUrl(apt);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Aura",
      images: image ? [{ url: image }] : undefined,
      locale: "ru_RU",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: apt.moderation_status === "approved",
      follow: true,
    },
  };
}

export default async function Page(
    { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const apt = await fetchApartment(slug);
  if (!apt) notFound();

  const image = firstPhotoUrl(apt);
  const price = apt.price;
  const currency = apt.currency ?? "TJS";

  // «чистый» JSON-LD без undefined
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: apt.title,
    ...(apt.description ? { description: apt.description } : {}),
    url: `${SITE_URL}/apartment/${slug}`,
    ...(image ? { image: [image] } : {}),
    address: {
      "@type": "PostalAddress",
      ...(apt.location?.name ? { addressLocality: apt.location.name } : {}),
      addressCountry: "TJ",
    },
    category: apt.offer_type === "rent" ? "rent" : "sell",
    ...(price ? {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/apartment/${slug}`,
      },
    } : {}),
    ...(apt.total_area ? {
      floorSize: { "@type": "QuantitativeValue", value: apt.total_area, unitCode: "MTK" },
    } : {}),
    ...(apt.rooms ? { numberOfRoomsTotal: apt.rooms } : {}),
    ...(apt.created_at ? { datePosted: apt.created_at } : {}),
    ...(apt.updated_at ? { dateModified: apt.updated_at } : {}),
  };

  return (
      <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ApartmentClient slug={slug} />
      </>
  );
}

export const revalidate = 300;

// импорт внизу — норм
import ApartmentClient from "./ApartmentClient";