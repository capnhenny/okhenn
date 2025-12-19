---
layout: journal
title: journal
---

<section class="cards">
  {% assign items = site.journal | sort: "date" | reverse %}
  {% for post in items %}

    <a class="card" href="{{ post.url | relative_url }}">
      {% if post.thumb %}
        <img src="{{ post.thumb | relative_url }}" alt="" class="post-thumb" />
      {% endif %}

      <h3>{{ post.title }}</h3>

      {% if post.date %}
        <p class="date">{{ post.date | date: "%b %-d, %Y" }}</p>
      {% endif %}

      <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
    </a>

  {% endfor %}
</section>
