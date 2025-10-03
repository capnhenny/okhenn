---
layout: default
title: Adventures
permalink: /adventures/
---

<section class="cards">
  {% assign items = site.adventures | sort: "date" | reverse %}
  {% for a in items %}
    <a class="card" href="{{ a.url | relative_url }}">
      <h3>{{ a.title }}</h3>
      {% if a.date %}<p class="date">{{ a.date | date: "%b %-d, %Y" }}</p>{% endif %}
      <p>{{ a.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</section>
