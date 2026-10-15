import React from "react";

const roleOptions = [
  {
    role: "Student",
    icon: "🎓",
    description: "Submit maintenance requests and track their progress.",
    button: "Student Login",
    href: "/login/student",
    className: "student",
  },
  {
    role: "Staff",
    icon: "🛠️",
    description: "View assigned maintenance work and update its progress.",
    button: "Staff Login",
    href: "/login/staff",
    className: "staff",
  },
  {
    role: "Administrator",
    icon: "🏛️",
    description: "Manage requests, approve or reject them, and assign staff.",
    button: "Admin Login",
    href: "/login/admin",
    className: "administrator",
  },
];

function WelcomePage() {
  return (
    <main className="welcome-page">
      <div className="welcome-shell">
        <header className="welcome-heading">
          <div className="welcome-mark" aria-hidden="true">🏫</div>
          <p className="welcome-kicker">CAMPUSCARE</p>
          <h1>College Maintenance Request System</h1>
          <p className="welcome-subtitle">
            Report, track, and manage campus maintenance requests in one place.
          </p>
        </header>

        <section className="role-grid" aria-label="Choose your account type">
          {roleOptions.map((option) => (
            <article
              className={`role-card role-card-${option.className}`}
              key={option.role}
            >
              <span className="role-icon" aria-hidden="true">
                {option.icon}
              </span>
              <h2>{option.role}</h2>
              <p>{option.description}</p>
              <a className="role-button" href={option.href}>
                {option.button}
              </a>
            </article>
          ))}
        </section>

        <p className="welcome-footnote">
          Choose the account type assigned to you by your college.
        </p>
      </div>
    </main>
  );
}

export default WelcomePage;
