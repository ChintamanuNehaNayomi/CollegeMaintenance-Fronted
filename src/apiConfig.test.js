function loadApiBaseUrl(environment) {
  const keys = [
    "NODE_ENV",
    "REACT_APP_API_URL",
    "REACT_APP_API_BASE_URL",
  ];
  const previousValues = Object.fromEntries(
    keys.map((key) => [key, process.env[key]])
  );

  keys.forEach((key) => {
    delete process.env[key];
  });
  Object.assign(process.env, environment);

  let apiBaseUrl;
  jest.isolateModules(() => {
    apiBaseUrl = require("./api").default;
  });

  keys.forEach((key) => {
    if (previousValues[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = previousValues[key];
    }
  });

  return apiBaseUrl;
}

test("REACT_APP_API_URL is preferred and trailing slashes are removed", () => {
  expect(
    loadApiBaseUrl({
      NODE_ENV: "production",
      REACT_APP_API_URL: "https://api.example.test///",
      REACT_APP_API_BASE_URL: "https://legacy.example.test",
    })
  ).toBe("https://api.example.test");
});

test("the previous API environment variable remains supported", () => {
  expect(
    loadApiBaseUrl({
      NODE_ENV: "production",
      REACT_APP_API_BASE_URL: "https://legacy.example.test/",
    })
  ).toBe("https://legacy.example.test");
});

test("the expected Render URL and local development URL are the fallbacks", () => {
  expect(loadApiBaseUrl({ NODE_ENV: "production" })).toBe(
    "https://collegemaintenance-backend.onrender.com"
  );
  expect(loadApiBaseUrl({ NODE_ENV: "development" })).toBe(
    "http://localhost:8080"
  );
});
