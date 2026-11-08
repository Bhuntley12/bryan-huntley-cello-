const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#inquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const subject = encodeURIComponent(`Website inquiry: ${data.get("event") || "Event"}`);
  const body = encodeURIComponent(
`Hello Bryan,

I'd like to ask about cello music for my event.

Name: ${data.get("name")}
Email: ${data.get("email")}
Event: ${data.get("event")}
Date: ${data.get("date") || "Not specified"}
Location: ${data.get("location") || "Not specified"}

A little more about my event:
${data.get("message") || "No additional details yet."}

Thank you!`
  );

  document.querySelector("#form-status").textContent = "Your email app should open with the inquiry prepared. Please review it and press Send.";
  window.location.href = `mailto:bhuntley444@gmail.com?subject=${subject}&body=${body}`;
});
