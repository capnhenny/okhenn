---
layout: default
title: Contact
permalink: /contact/
---

<form
  id="contact-form"
  action="https://formspree.io/f/mnnevlzw" 
  method="POST"
>
  <!-- Name -->
  <label for="name">Your name</label>
  <input
    type="text"
    id="name"
    name="name"
    placeholder="government name"
    required
  />

  <!-- Email -->
  <label for="email">Your email</label>
  <input
    type="email"
    id="email"
    name="_replyto"
    placeholder="preferred response address"
    required
  />

  <!-- Message -->
  <label for="message">Your message</label>
  <textarea
    id="message"
    name="message"
    rows="6"
    placeholder="your message (promise i'll read it)"
    required
  ></textarea>

  <button type="submit">send it</button>
</form>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Cute popup BEFORE the email sends
      alert('message sent (spiritually) ✨');

      const formData = new FormData(form);

      try {
        await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // reset silently
        form.reset();
      } catch (err) {
        console.error('contact form failed:', err);
      }
    });
  });
</script>
