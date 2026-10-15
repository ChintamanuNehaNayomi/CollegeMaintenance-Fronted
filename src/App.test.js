import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.history.pushState({}, "", "/");
  window.localStorage.clear();
  global.fetch = jest.fn();
});

test("the welcome page presents all three role options", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "College Maintenance Request System" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Student Login" })).toHaveAttribute(
    "href",
    "/login/student"
  );
  expect(screen.getByRole("link", { name: "Staff Login" })).toHaveAttribute(
    "href",
    "/login/staff"
  );
  expect(screen.getByRole("link", { name: "Admin Login" })).toHaveAttribute(
    "href",
    "/login/admin"
  );
});

test.each([
  ["/login/student", "Student Login", true],
  ["/login/staff", "Staff Login", false],
  ["/login/admin", "Admin Login", false],
])("%s shows the matching login and registration visibility", (path, heading, hasRegistration) => {
  window.history.pushState({}, "", path);
  render(<App />);

  expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  expect(screen.getByLabelText("Username")).toBeInTheDocument();
  expect(screen.getByLabelText("Password")).toBeInTheDocument();
  if (hasRegistration) {
    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/register"
    );
  } else {
    expect(screen.queryByRole("link", { name: "Create an account" })).not.toBeInTheDocument();
  }
});

test("a user cannot open a dashboard without stored authentication", () => {
  window.history.pushState({}, "", "/admin");

  render(<App />);

  expect(screen.getByRole("heading", { name: "Sign in required" })).toBeInTheDocument();
  expect(screen.queryByText("All Maintenance Requests")).not.toBeInTheDocument();
});

test("a dashboard verifies the backend role instead of trusting browser storage", async () => {
  window.history.pushState({}, "", "/admin");
  window.localStorage.setItem("accessToken", "test-token");
  window.localStorage.setItem("role", "ADMIN");
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ username: "student1", role: "STUDENT" }),
  });

  render(<App />);

  expect(await screen.findByRole("heading", { name: "Sign in required" })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/api\/me$/),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: "Bearer test-token",
      }),
    })
  );
  expect(screen.queryByText("All Maintenance Requests")).not.toBeInTheDocument();
});

test.each([
  ["/student", "STUDENT", "STUDENT PORTAL"],
  ["/staff", "STAFF", "STAFF PORTAL"],
  ["/admin", "ADMIN", "Administrator Dashboard"],
])("%s opens only after the backend confirms the matching role", async (path, role, portalLabel) => {
  window.history.pushState({}, "", path);
  window.localStorage.setItem("accessToken", "valid-token");
  window.localStorage.setItem("username", "portal-user");
  window.localStorage.setItem("role", role);
  global.fetch.mockImplementation(async (url) => ({
    ok: true,
    status: 200,
    json: async () =>
      /\/api\/me$/.test(url)
        ? { username: "portal-user", role }
        : [],
  }));

  render(<App />);

  expect(await screen.findByText(portalLabel)).toBeInTheDocument();
});

test("a backend role mismatch does not store authentication or open a dashboard", async () => {
  window.history.pushState({}, "", "/login/admin");
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      accessToken: "student-token",
      refreshToken: "student-refresh",
      username: "student1",
      role: "STUDENT",
    }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "student1" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in as Admin" }));

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent(
    "This account does not have the selected role. Please choose the correct login option."
  );
  expect(window.localStorage.getItem("accessToken")).toBeNull();
  expect(window.localStorage.getItem("refreshToken")).toBeNull();
  expect(window.location.pathname).toBe("/login/admin");
});

test("login sends the username and password fields expected by the backend", async () => {
  window.history.pushState({}, "", "/login/student");
  global.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ message: "Invalid username or password" }),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: " student1 " },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "student-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in as Student" }));

  await screen.findByRole("alert");
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Invalid username or password"
  );

  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toMatch(/\/api\/login$/);
  expect(options.method).toBe("POST");
  expect(options.headers["Content-Type"]).toBe(
    "application/x-www-form-urlencoded"
  );
  expect(options.body.get("username")).toBe("student1");
  expect(options.body.get("password")).toBe("student-password");
});

test("login distinguishes backend failures from invalid credentials", async () => {
  window.history.pushState({}, "", "/login/student");
  global.fetch.mockResolvedValue({
    ok: false,
    status: 503,
    json: async () => ({}),
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "student1" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "student-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in as Student" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "The sign-in service is temporarily unavailable."
  );
  expect(screen.getByRole("alert")).not.toHaveTextContent(
    "Invalid username or password"
  );
});

test("password visibility can be toggled", () => {
  window.history.pushState({}, "", "/login/student");
  render(<App />);

  const passwordInput = screen.getByLabelText("Password");
  expect(passwordInput).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Show password" }));
  expect(passwordInput).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
  expect(passwordInput).toHaveAttribute("type", "password");
});
