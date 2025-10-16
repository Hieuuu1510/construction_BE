export const API_PREFIX = "/api";

export const publicRouters = [
  { path: /^\/api\/auth\/(login|register)$/, method: "POST" }, // auth/login, auth/register
  { path: /^\/api\/construction(\/[A-Za-z0-9]+)?$/, method: "GET" }, // construction, construction/:id
  { path: /^\/api\/construction-category(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/featured-projects(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/gallery(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/news(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/news-category(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/product(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/product-category(\/[A-Za-z0-9]+)?$/, method: "GET" },
  { path: /^\/api\/contact(\/[A-Za-z0-9]+)?$/, method: "POST" },
  { path: /^\/api\/contact(\/[A-Za-z0-9]+)?$/, method: "GET" },
];
