export function pageBounds(total, requestedPage, pageSize = 50) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.max(1, Math.min(requestedPage, pages));
  const start = (page - 1) * pageSize;
  return { page, pages, start, end: Math.min(start + pageSize, total), total };
}
