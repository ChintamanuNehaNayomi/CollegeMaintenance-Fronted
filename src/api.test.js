import API_BASE_URL, { authenticatedFetch } from "./api";

const response = (status, body = {}) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
});

beforeEach(() => {
  window.localStorage.clear();
  global.fetch = jest.fn();
});

test("expired access tokens refresh and retry the protected request", async () => {
  window.localStorage.setItem("accessToken", "old-access");
  window.localStorage.setItem("refreshToken", "valid-refresh");
  window.localStorage.setItem("username", "staff1");
  window.localStorage.setItem("role", "STAFF");
  global.fetch
    .mockResolvedValueOnce(response(401))
    .mockResolvedValueOnce(
      response(200, {
        accessToken: "new-access",
        refreshToken: "valid-refresh",
        username: "staff1",
        role: "STAFF",
      })
    )
    .mockResolvedValueOnce(response(200, []));
  const queuedFetch = global.fetch;
  const requestHeaders = [];
  global.fetch = jest.fn((...args) => {
    requestHeaders.push({ ...(args[1]?.headers || {}) });
    return queuedFetch(...args);
  });

  const result = await authenticatedFetch(
    `${API_BASE_URL}/api/staff/requests`
  );

  expect(result.status).toBe(200);
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(global.fetch.mock.calls[1][0]).toBe(`${API_BASE_URL}/api/refresh`);
  expect(
    requestHeaders[0].Authorization.startsWith("Bearer ")
  ).toBe(true);
  expect(
    requestHeaders[0].Authorization.endsWith("old-access")
  ).toBe(true);
  expect(
    requestHeaders[2].Authorization.startsWith("Bearer ")
  ).toBe(true);
  expect(
    requestHeaders[2].Authorization.endsWith("new-access")
  ).toBe(true);
  expect(window.localStorage.getItem("accessToken")).toBe("new-access");
});

test("a refresh response with a changed role clears saved authentication", async () => {
  window.localStorage.setItem("accessToken", "old-access");
  window.localStorage.setItem("refreshToken", "valid-refresh");
  window.localStorage.setItem("username", "staff1");
  window.localStorage.setItem("role", "STAFF");
  global.fetch
    .mockResolvedValueOnce(response(401))
    .mockResolvedValueOnce(
      response(200, {
        accessToken: "unexpected-access",
        refreshToken: "valid-refresh",
        username: "staff1",
        role: "ADMIN",
      })
    );

  const result = await authenticatedFetch(
    `${API_BASE_URL}/api/staff/requests`
  );

  expect(result.status).toBe(401);
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(window.localStorage.getItem("accessToken")).toBeNull();
  expect(window.localStorage.getItem("refreshToken")).toBeNull();
});
