// ================================================
// main.js — All interactivity for the portfolio
// ================================================

// "DOMContentLoaded" means: wait until the HTML is
// fully loaded before running any of this code.
document.addEventListener('DOMContentLoaded', () => {


  // ----------------------------------------------
  // 1. NAVBAR — shrink/style on scroll
  // ----------------------------------------------
  // We grab the navbar element by its ID.
  const navbar = document.getElementById('navbar');

  // "scroll" event fires every time the user scrolls.
  window.addEventListener('scroll', () => {
    // window.scrollY = how many pixels scrolled from the top
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');    // adds the CSS class
    } else {
      navbar.classList.remove('scrolled'); // removes it
    }
  });


  // ----------------------------------------------
  // 2. HAMBURGER MENU — mobile nav toggle
  // ----------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // When hamburger is clicked, toggle the 'active' and 'open' classes.
  // CSS uses these classes to animate the icon and show/hide the menu.
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // When a nav link is clicked, close the mobile menu.
  // querySelectorAll returns a list of ALL matching elements.
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  // ----------------------------------------------
  // 3. SCROLL REVEAL — animate sections into view
  // ----------------------------------------------
  // We add the 'reveal' class to every section so they
  // start invisible (defined in CSS).
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('reveal');
  });

  // IntersectionObserver watches elements and fires a
  // callback when they enter or leave the viewport.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // entry.isIntersecting = true when the element is visible
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // triggers CSS animation
        observer.unobserve(entry.target);      // stop watching once animated
      }
    });
  }, {
    threshold: 0.1 // trigger when 10% of the element is visible
  });

  // Tell the observer to watch each section
  sections.forEach(section => observer.observe(section));


  // ----------------------------------------------
  // 4. CONTACT FORM — validation & submission
  // ----------------------------------------------
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', (event) => {
    // Prevent the browser's default behaviour (page refresh on submit)
    event.preventDefault();

    // Read values from the form fields
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation — check nothing is empty
    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'error');
      return; // stop here, don't go further
    }

    // Basic email format check using a regular expression (regex)
    // The pattern checks for: something @ something . something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // --- In a real site, you'd send data to a server here.
    // For now, we just simulate a successful send. ---

    // Disable the button while "sending"
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // setTimeout simulates a network delay (1.5 seconds)
    setTimeout(() => {
      showStatus('Message sent! I\'ll get back to you soon.', 'success');
      form.reset(); // clears all form fields
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1500);
  });

  // Helper function to display a status message
  // Keeps the code DRY (Don't Repeat Yourself)
  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type; // applies 'success' or 'error' CSS class
  }


}); // end of DOMContentLoaded