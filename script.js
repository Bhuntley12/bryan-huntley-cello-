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
  return { subject, body };
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const inquiry = prepareInquiry();
  if (!inquiry || form.dataset.sending === "true") return;
  if (new FormData(form).get("_honey")) return;
  const button = form.querySelector('[type="submit"]');
  const label = button.textContent;
  form.dataset.sending = "true";
  button.disabled = true;
  button.textContent = "Sending…";
  form.setAttribute("aria-busy", "true");
  status.textContent = "Sending your inquiry…";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      event: data.get("event"),
      date: data.get("date") || "Not sure yet",
      location: data.get("location") || "Not sure yet",
      duration: data.get("duration") || "Not sure yet",
      message: data.get("message") || "I'd love to discuss music for my event.",
      _subject: inquiry.subject,
      _template: "table",
      _honey: data.get("_honey") || ""
    };
    const response = await fetch("https://formsubmit.co/ajax/bhuntley444@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || ![true, "true"].includes(result.success) ||
        /activat|confirm your email|verif/i.test(result.message || "")) {
      throw new Error("Submission not confirmed");
    }
    status.textContent = "Thank you! Your inquiry has been sent. Bryan will be in touch.";
    preview.hidden = true;
    form.reset();
  } catch {
    status.textContent = "We couldn't confirm your inquiry was sent. Your details are still here. Please try again or use Copy inquiry and email bhuntley444@gmail.com.";
  } finally {
    clearTimeout(timeout);
    form.dataset.sending = "false";
    form.setAttribute("aria-busy", "false");
    button.disabled = false;
    button.textContent = label;
  }
});
document.querySelector("#copy-inquiry").addEventListener("click", async () => {
  if (!prepareInquiry()) return;
  preview.hidden = false;
  try {
    await navigator.clipboard.writeText(inquiryText.value);
    status.textContent = "Inquiry copied. Paste it into an email to bhuntley444@gmail.com and press Send.";
  } catch {
    inquiryText.focus();
    inquiryText.select();
    status.textContent = "Select and copy the inquiry below, then paste it into an email to bhuntley444@gmail.com. Nothing has been sent yet.";
  }
});

