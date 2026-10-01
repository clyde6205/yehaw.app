import {
  allowGetOnly,
  getDirectorySql,
  normalizeSearchQuery,
  setDirectoryCache,
  setNoStore,
  unavailable
} from "../_shared.js";

const MAX_RESULTS = 24;

export default async function handler(request, response) {
  if (!allowGetOnly(request, response)) {
    return;
  }

  const query = normalizeSearchQuery(request.query?.q);

  if (!query) {
    setNoStore(response);
    return response.status(400).json({
      error: "Provide a search query up to 80 characters."
    });
  }

  try {
    const sql = getDirectorySql();
    const prefix = `${query}%`;
    const contains = `%${query}%`;

    // Values are parameterized; ranking keeps direct matches ahead of broad matches.
    const rows = await sql`
      SELECT DISTINCT ON (s.id)
        s.slug,
        s.name,
        s.short_description AS "shortDescription",
        s.canonical_url AS "canonicalUrl",
        s.icon_url AS "iconUrl",
        s.display_order AS "displayOrder",
        s.last_reviewed_at AS "lastReviewedAt",
        c.slug AS "categorySlug",
        c.name AS "categoryName",
        CASE
          WHEN lower(s.name) = ${query} THEN 0
          WHEN EXISTS (
            SELECT 1
            FROM service_aliases AS exact_alias
            WHERE exact_alias.service_id = s.id
              AND lower(exact_alias.normalized_alias) = ${query}
          ) THEN 0
          WHEN lower(s.name) LIKE ${prefix} THEN 1
          WHEN EXISTS (
            SELECT 1
            FROM service_aliases AS prefix_alias
            WHERE prefix_alias.service_id = s.id
              AND lower(prefix_alias.normalized_alias) LIKE ${prefix}
          ) THEN 1
          ELSE 2
        END AS match_rank,
        c.display_order AS category_display_order
      FROM services AS s
      INNER JOIN service_categories AS c
        ON c.id = s.category_id
       AND c.is_active = true
      LEFT JOIN service_aliases AS a
        ON a.service_id = s.id
      WHERE s.is_active = true
        AND s.is_verified = true
        AND (
          lower(s.name) LIKE ${contains}
          OR lower(s.short_description) LIKE ${contains}
          OR lower(a.normalized_alias) LIKE ${contains}
        )
      ORDER BY
        s.id,
        match_rank,
        c.display_order,
        s.display_order,
        s.name
    `;

    const services = rows
      .sort((left, right) =>
        left.match_rank - right.match_rank ||
        left.category_display_order - right.category_display_order ||
        left.displayOrder - right.displayOrder ||
        left.name.localeCompare(right.name)
      )
      .slice(0, MAX_RESULTS)
      .map(({ match_rank, category_display_order, ...service }) => service);

    setDirectoryCache(response);
    return response.status(200).json({ services });
  } catch {
    return unavailable(response);
  }
}
