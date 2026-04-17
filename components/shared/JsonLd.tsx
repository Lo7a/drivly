interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JSON-LD structured data component for SEO.
 * Data is always server-generated (never from user input),
 * so dangerouslySetInnerHTML is safe here - this is the
 * standard Next.js pattern for structured data.
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
