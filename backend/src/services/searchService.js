// backend/src/services/searchService.js

const ALLOWED_PROPERTY_TYPES = new Set(['hotel', 'villa', 'apartment', 'hostel']);
const AMENITY_CODE_PATTERN = /^[A-Z0-9_]+$/;
const MAX_FILTER_LIST_SIZE = 20;

/**
 * parseCsv converts a comma-separated query param into a string array.
 *
 * @param {unknown} value - Raw query param value.
 * @returns {string[]} Parsed list.
 */
function parseCsv(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * parseOptionalNumber parses an optional numeric query parameter.
 *
 * @param {unknown} value - Raw query param value.
 * @returns {number|undefined} Parsed number, or undefined when not provided/empty.
 */
function parseOptionalNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? NaN : n;
}

/**
 * validateFilters validates incoming search filters.
 *
 * @param {object} query - Express req.query object.
 * @returns {string[]} List of validation errors.
 */
function validateFilters(query) {
  const errors = [];

  const propertyTypes = parseCsv(query.propertyTypes);
  if (propertyTypes.length > MAX_FILTER_LIST_SIZE) {
    errors.push(`propertyTypes exceeds maximum of ${MAX_FILTER_LIST_SIZE}`);
  }
  for (const pt of propertyTypes) {
    if (!ALLOWED_PROPERTY_TYPES.has(pt)) {
      errors.push(`Invalid propertyType: ${pt}`);
    }
  }

  const amenities = parseCsv(query.amenities);
  if (amenities.length > MAX_FILTER_LIST_SIZE) {
    errors.push(`amenities exceeds maximum of ${MAX_FILTER_LIST_SIZE}`);
  }
  for (const code of amenities) {
    if (!AMENITY_CODE_PATTERN.test(code)) {
      errors.push(`Invalid amenity code: ${code}`);
    }
  }

  if (query.minReviewScore !== undefined) {
    const score = Number(query.minReviewScore);
    if (Number.isNaN(score) || score < 0 || score > 10) {
      errors.push('minReviewScore must be a number between 0 and 10');
    }
  }

  // Validates minPrice/maxPrice as non-negative numbers, and minPrice <= maxPrice.
  const minPrice = parseOptionalNumber(query.minPrice);
  const maxPrice = parseOptionalNumber(query.maxPrice);

  if (minPrice !== undefined) {
    if (Number.isNaN(minPrice) || minPrice < 0) {
      errors.push('minPrice must be a non-negative number');
    }
  }

  if (maxPrice !== undefined) {
    if (Number.isNaN(maxPrice) || maxPrice < 0) {
      errors.push('maxPrice must be a non-negative number');
    }
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    !Number.isNaN(minPrice) &&
    !Number.isNaN(maxPrice) &&
    minPrice > maxPrice
  ) {
    errors.push('minPrice must be less than or equal to maxPrice');
  }

  return errors;
}

/**
 * buildSearchQuery builds SQL and parameter list for the given query filters.
 *
 * @param {object} query - Express req.query object.
 * @returns {{sql: string, params: unknown[]}} SQL and bound params.
 */
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

  // Applies price range filters when provided.
  const minPrice = parseOptionalNumber(query.minPrice);
  if (minPrice !== undefined && !Number.isNaN(minPrice)) {
    where.push('a.price_per_night >= ?');
    params.push(minPrice);
  }

  const maxPrice = parseOptionalNumber(query.maxPrice);
  if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    where.push('a.price_per_night <= ?');
    params.push(maxPrice);
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

  // SQLite-compatible null-safe ordering (NULLS LAST not supported in SQLite)
  const sql = `
    SELECT a.*
    FROM accommodations a
    ${amenitiesJoin}
    ${whereSql}
    ${amenitiesHaving}
    ORDER BY (a.review_score IS NULL), a.review_score DESC
  `;

  return { sql, params };
}

module.exports = { buildSearchQuery, validateFilters };
