// backend/src/services/searchService.js

function parseCsv(value) {
  if (!value) return [];
  return String(value).split(',').map((v) => v.trim()).filter(Boolean);
}

function buildSearchQuery(query) {
  const params = [];
  const where = [];

  if (query.destination) {
    where.push('a.destination LIKE ?');
    params.push(`%${query.destination}%`);
  }

  const propertyTypes = parseCsv(query.propertyTypes);
  if (propertyTypes.length > 0) {
    where.push(`a.property_type IN (${propertyTypes.map(() => '?').join(',')})`);
    params.push(...propertyTypes);
  }

  const minReviewScore = query.minReviewScore !== undefined ? Number(query.minReviewScore) : undefined;
  if (minReviewScore !== undefined && !Number.isNaN(minReviewScore)) {
    where.push('a.review_score >= ?');
    params.push(minReviewScore);
  }

  const amenities = parseCsv(query.amenities);
  let amenitiesJoin = '';
  let amenitiesHaving = '';
  if (amenities.length > 0) {
    amenitiesJoin = `
      JOIN accommodation_amenities aa ON aa.accommodation_id = a.id
      JOIN amenities am ON am.id = aa.amenity_id
    `;
    where.push(`am.code IN (${amenities.map(() => '?').join(',')})`);
    params.push(...amenities);
    amenitiesHaving = `GROUP BY a.id HAVING COUNT(DISTINCT am.code) = ${amenities.length}`;
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT a.*
    FROM accommodations a
    ${amenitiesJoin}
    ${whereSql}
    ${amenitiesHaving}
    ORDER BY a.review_score DESC NULLS LAST
  `;

  return { sql, params };
}

module.exports = { buildSearchQuery };
