const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();
const form = document.querySelector("#inquiry-form");
const status = document.querySelector("#form-status");
const preview = document.querySelector("#inquiry-preview");
const inquiryText = document.querySelector("#inquiry-text");
document.querySelectorAll(".service-inquire").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#event-type").value = link.dataset.event;
  });
});
function prepareInquiry() {
  if (!form.reportValidity()) return null;
  const data = new FormData(form);
  const subject = `Cello inquiry: ${data.get("event")} · ${data.get("date") || "Date to be confirmed"}`;
  const body = `Hello Bryan,

I'd like to ask about cello music for my event.

Name: ${data.get("name")}
Email: ${data.get("email")}
Event: ${data.get("event")}
Date: ${data.get("date") || "Not sure yet"}
Location: ${data.get("location") || "Not sure yet"}
Music time: ${data.get("duration") || "Not sure yet"}

A little more about my event:
${data.get("message") || "I'd love to talk through the possibilities."}

Thank you!`;
  inquiryText.value = `To: bhuntley444@gmail.com\nSubject: ${subject}\n\n${body}`;
  preview.hidden = false;
  return { subject, body };
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inquiry = prepareInquiry();
  if (!inquiry) return;
  status.textContent = "Your inquiry is ready. If your email app opens, review the draft and press Send. If it doesn't open, use Copy inquiry instead. Nothing has been sent by this website.";
  window.location.href = `mailto:bhuntley444@gmail.com?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
});
document.querySelector("#copy-inquiry").addEventListener("click", async () => {
  if (!prepareInquiry()) return;
  try {
    await navigator.clipboard.writeText(inquiryText.value);
    status.textContent = "Inquiry copied. Paste it into an email to bhuntley444@gmail.com and press Send.";
  } catch {
    inquiryText.focus();
    inquiryText.select();
    status.textContent = "Select and copy the inquiry below, then paste it into an email to bhuntley444@gmail.com. Nothing has been sent yet.";
  }
});

