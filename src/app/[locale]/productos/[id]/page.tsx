import { notFound } from "next/navigation";
import { getProduct } from "@/lib/odoo";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(Number(id));
    if (!product) return {};
    return {
      title: product.name,
      description: product.shortDescription || product.description.slice(0, 160),
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) notFound();

  const product = await getProduct(numId).catch(() => null);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
