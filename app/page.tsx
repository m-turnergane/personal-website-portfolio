import { getPublishedPosts } from "@/lib/content";
import { HomeClient, type FeaturedProduct } from "./home-client";

export default function HomePage() {
  const products: FeaturedProduct[] = getPublishedPosts("products").flatMap(
    ({ slug, frontmatter }) =>
      frontmatter.product
        ? [
            {
              slug,
              name: frontmatter.product.name,
              tagline: frontmatter.product.tagline,
              version: frontmatter.product.version,
              stack: frontmatter.product.stack,
            },
          ]
        : [],
  );

  return <HomeClient products={products} />;
}
