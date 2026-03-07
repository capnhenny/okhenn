---
layout: default
title: cooking
body_class: cooking-theme
---

{% assign items = site.cooking | sort: "date" | reverse %}
{% assign featured_items = items | where: "featured", true %}
{% assign categories = "quick & easy|weeknight magic|no-brain hitters|breakfast nonsense|soups & stews|sauces & things|vegan|freezer prep|cooking experiments|delectable" | split: "|" %}

<section class="cooking-page">
  <div class="cooking-main">

    <section class="about-section cooking-intro">
      <h1>cooking 🍳</h1>
      <p>food, foolishness, and occasional competence.</p>
      <p>browse by category, admire the thumbnails, and witness my kitchen choices.</p>
    </section>

    <section class="cooking-chip-wrap" aria-label="Cooking categories">
      {% for cat in categories %}
        <a class="cooking-chip" href="#{{ cat | slugify }}">{{ cat }}</a>
      {% endfor %}
    </section>

    {% if featured_items.size > 0 %}
    <section class="cooking-featured">
      <h2>featured recipes</h2>
      <div class="featured-grid">
        {% for r in featured_items limit:3 %}
          <a class="featured-card" href="{{ r.url | relative_url }}">
            {% if r.thumb %}
              <div class="featured-thumb">
                <img src="{{ r.thumb | relative_url }}" alt="{{ r.title }}">
              </div>
            {% endif %}
            <div class="featured-content">
              <h3>{{ r.title }}</h3>
              {% if r.blurb %}
                <p>{{ r.blurb }}</p>
              {% else %}
                <p>{{ r.excerpt | strip_html | truncate: 110 }}</p>
              {% endif %}
              {% if r.category %}
                <span class="recipe-tag">{{ r.category }}</span>
              {% endif %}
            </div>
          </a>
        {% endfor %}
      </div>
    </section>
    {% endif %}

    <section class="all-recipes">
      <h2>all recipes</h2>

      {% for cat in categories %}
        {% assign cat_items = items | where: "category", cat %}
        {% if cat_items.size > 0 %}
          <section class="recipe-category-block" id="{{ cat | slugify }}">
            <h3 class="recipe-category-title">{{ cat }}</h3>

            <div class="recipe-grid">
              {% for r in cat_items %}
                <a class="recipe-card" href="{{ r.url | relative_url }}">
                  {% if r.thumb %}
                    <div class="recipe-thumb">
                      <img src="{{ r.thumb | relative_url }}" alt="{{ r.title }}">
                    </div>
                  {% endif %}

                  <div class="recipe-card-body">
                    <h4>{{ r.title }}</h4>

                    {% if r.blurb %}
                      <p>{{ r.blurb }}</p>
                    {% else %}
                      <p>{{ r.excerpt | strip_html | truncate: 120 }}</p>
                    {% endif %}

                    <div class="recipe-meta">
                      {% if r.category %}
                        <span class="recipe-tag">{{ r.category }}</span>
                      {% endif %}
                      {% if r.time %}
                        <span class="recipe-pill">{{ r.time }}</span>
                      {% endif %}
                      {% if r.freezer %}
                        <span class="recipe-pill">freezer-friendly</span>
                      {% endif %}
                      {% if r.vegan %}
                        <span class="recipe-pill">vegan</span>
                      {% endif %}
                    </div>
                  </div>
                </a>
              {% endfor %}
            </div>
          </section>
        {% endif %}
      {% endfor %}
    </section>

  </div>

  <aside class="cooking-sidebar">
    {% include henn-pantry.html %}
  </aside>
</section>
