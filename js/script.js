document.addEventListener("DOMContentLoaded", function () {
  // Initialize Animate On Scroll (AOS) library for scroll animations
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
  });

  // =================================================================
  // REVISED & BUG-FREE THEME TOGGLE FUNCTIONALITY
  // =================================================================
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === "neon") {
      body.classList.remove("light-mode");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      body.classList.add("light-mode");
      themeToggle.setAttribute("aria-pressed", "false");
    }
  };

  const savedTheme = localStorage.getItem("siteTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }

  themeToggle.addEventListener("click", () => {
    const isLightMode = body.classList.contains("light-mode");
    const newTheme = isLightMode ? "neon" : "light";
    applyTheme(newTheme);
    localStorage.setItem("siteTheme", newTheme);
  });
  
  // =================================================================
  // AJAX FORM SUBMISSION
  // =================================================================
  const form = document.getElementById("contactForm");
  const statusDiv = document.getElementById("form-status");
  const submitBtn = document.getElementById("submitBtn");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch("https://formspree.io/f/xkgqgwoj", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        statusDiv.innerHTML = "Thank you! Your message has been sent.";
        statusDiv.className = "success";
        form.reset();
        Array.from(form.elements).forEach(field => field.disabled = true);
        submitBtn.textContent = "Message Sent!";
      } else {
        const responseData = await response.json();
        if (Object.hasOwn(responseData, "errors")) {
          statusDiv.innerHTML = responseData["errors"].map((error) => error["message"]).join(", ");
        } else {
          statusDiv.innerHTML = "Oops! There was a problem submitting your form.";
        }
        statusDiv.className = "error";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    } catch (error) {
      statusDiv.innerHTML = "Oops! There was a network problem. Please try again.";
      statusDiv.className = "error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }
  
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});