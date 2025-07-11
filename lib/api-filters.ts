// Converts URLSearchParams to proper object with split values
export const convertObject = (obj: Record<string, string>) => {
  const result: Record<string, string[] | string> = {};
  for (const key in obj) {
    if (key === "q") result[key] = obj[key];
    else result[key] = obj[key].replace("-", " ").split("_");
  }
  return result;
};

// Build Prisma filter conditions
export const convertFilters = (obj: Record<string, string[] | string>) => {
  const filters: any[] = [];

  if (obj.gender) filters.push({ genders: { hasSome: obj.gender } });
  if (obj.category) filters.push({ productType: { in: obj.category } });
  if (obj.color) filters.push({ colors: { some: { name: { in: obj.color } } } });
  if (obj.size) filters.push({ sizes: { some: { key: { in: obj.size } } } });

  // remove key like [q, page, limit] and already handled filters
  const keysToIgnore = ["q", "page", "limit", "gender", "category", "color", "size"];
  for (const key of keysToIgnore) {
    delete obj[key];
  }

  // Handle attributes like brand, material, etc.
  for (const key of Object.keys(obj)) {
    if (obj[key]) {
      filters.push({
        attributes: {
          some: { value: { in: obj[key] } },
        },
      });
    }
  }

  return filters;
};
