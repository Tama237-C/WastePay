import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";

type PageKey = "home" | "impact" | "about" | "programs" | "contact";

export async function EditablePageSections({ pageKey }: { pageKey: PageKey }) {
  const adminClient = createAdminClient();
  const { data: sections } = await adminClient
    .from("website_sections")
    .select("id, eyebrow, title, body, image_path")
    .eq("page_key", pageKey)
    .eq("enabled", true)
    .order("sort_order");

  if (!sections?.length) return null;

  return (
    <section className="wp-section">
      <div className="wp-page-container space-y-8">
        {sections.map((section, index) => {
          const imageUrl = section.image_path
            ? adminClient.storage
                .from("website-images")
                .getPublicUrl(section.image_path).data.publicUrl
            : null;
          return (
            <article
              key={section.id}
              className="wp-glass-panel grid items-center gap-8 rounded-[var(--wp-radius)] p-7 sm:p-9 lg:grid-cols-2"
            >
              <div className={index % 2 ? "lg:order-2" : ""}>
                {section.eyebrow ? (
                  <p className="wp-eyebrow">{section.eyebrow}</p>
                ) : null}
                <h2 className="wp-section-title mt-5">{section.title}</h2>
                {section.body ? (
                  <p className="wp-body-large mt-5">{section.body}</p>
                ) : null}
              </div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title}
                  width={900}
                  height={600}
                  className={`h-72 w-full rounded-[var(--wp-radius)] object-cover ${
                    index % 2 ? "lg:order-1" : ""
                  }`}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`h-72 rounded-[var(--wp-radius)] bg-gradient-to-br from-emerald-400/15 via-sky-400/10 to-violet-400/15 ${
                    index % 2 ? "lg:order-1" : ""
                  }`}
                />
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
