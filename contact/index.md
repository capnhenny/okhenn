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

      // show the cute popup
      alert('message sent (spiritually) ✨');

      const formData = new FormData(form);

      try {
        await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // silently clear the form; no “it sent!” message
        form.reset();
      } catch (err) {
        console.error('contact form failed:', err);
        // we stay silent to the user; just log it
      }
    });
  });
</script>
