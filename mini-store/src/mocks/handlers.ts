import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/login", async () => {
    return HttpResponse.json({ token: "mock-token", expiresAt: new Date().toISOString(), userDto: { id: 1, username: "demo", email: "demo@example.com", roles: ["USER"] } });
  }),
];

