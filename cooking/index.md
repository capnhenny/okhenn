---
layout: default
title: cooking
---

<!-- Cooking index: list all cooking entries -->
<section class="cards">
  {% assign items = site.cooking | sort: "date" | reverse %}
  {% for r in items %}
    <a class="card" href="{{ r.url | relative_url }}">
      <h3>{{ r.title }}</h3>

      {% if r.date %}
      <p class="date">{{ r.date | date: "%b %-d, %Y" }}</p>
      {% endif %}

      <p>{{ r.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</section>
