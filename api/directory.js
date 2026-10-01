import {
  allowGetOnly,
  getDirectorySql,
  setDirectoryCache,
  unavailable
} from "./_shared.js";

export default async function handler(request, response) {
  if (!allowGetOnly(request, response)) {
    return;
  }

  try {
    const sql = getDirectorySql();

    const rows = await sql`
      SELECT
        c.slug AS category_slug,
        c.name AS category_name,
        c.description AS category_description,
        c.display_order AS category_display_order,
        s.slug AS service_slug,
        s.name AS service_name,
        s.short_description AS service_short_description,
        s.canonical_url AS service_canonical_url,
        s.icon_url AS service_icon_url,
        s.display_order AS service_display_order,
        s.last_reviewed_at AS service_last_reviewed_at
      FROM service_categories AS c
      LEFT JOIN services AS s
        ON s.category_id = c.id
       AND s.is_active = true
       AND s.is_verified = true
      WHERE c.is_active = true
      ORDER BY c.display_order ASC, s.display_order ASC, s.name ASC
    `;

    const categories = [];
    const categoryBySlug = new Map();

    for (const row of rows) {
      let category = categoryBySlug.get(row.category_slug);

      if (!category) {
        category = {
          slug: row.category_slug,
          name: row.category_name,
          description: row.category_description,
          displayOrder: row.category_display_order,
          services: []
        };

        categoryBySlug.set(row.category_slug, category);
        categories.push(category);
      }

      if (row.service_slug) {
        category.services.push({
          slug: row.service_slug,
          name: row.service_name,
          shortDescription: row.service_short_description,
          canonicalUrl: row.service_canonical_url,
          iconUrl: row.service_icon_url,
          displayOrder: row.service_display_order,
          lastReviewedAt: row.service_last_reviewed_at
        });
      }
    }

    setDirectoryCache(response);
    return response.status(200).json({ categories });
  } catch {
    return unavailable(response);
  }
}
