---
layout: default
title: adventures
permalink: /adventures/
---

<section class="adventures">

  <!-- interactive map FIRST -->
  <section class="about-section adventures-map">
    <h1>stamp collection 🌍</h1>
    <p>
      it's fun to know where you've been, so this is where my own little
      interactive map will live. 
      <p>
      zoom around, poke the glowing bits, and
      soon you'll be able to hop straight into the journal entries tied to each place.
    </p>
    <p>
      someday: click a highlighted city → jump into the adventure log →
      discover what unhinged side quest occurred there.
    </p>

    <div
      id="travel-map"
      class="travel-map"
      aria-describedby="map-note"
    >
      <p class="map-placeholder">
        [ future interactive map of henn’s wanderings goes here ✈️ ]
      </p>
    </div>
    <p id="map-note" class="map-note">
      someday soon: click a glowing spot to see journal entries from that adventure.
    </p>
  </section>

  <!-- intro paragraph under the map -->
  <header class="adventures-hero">
    <h2>away missions</h2>
    <p>
      sometimes i leave the house. this is where those quests get logged:
      <p></p>
      road trips, plane rides, walks that went a little too far, and
      all the little moments i don’t want to forget.
    </p>
  </header>

  <!-- mission log -->
  <section class="about-section adventures-list">
    <h2>mission log</h2>

    <div class="cards">
      {% assign items = site.adventures | sort: "date" | reverse %}
      {% for trip in items %}
        <a class="card" href="{{ trip.url | relative_url }}">

          {% if trip.thumb %}
            <img
              src="{{ trip.thumb | relative_url }}"
              alt=""
              class="post-thumb"
            >
          {% endif %}

          <h3>{{ trip.title }}</h3>

          {% if trip.date %}
            <p class="date">{{ trip.date | date: "%b %-d, %Y" }}</p>
          {% endif %}

          <p>{{ trip.excerpt | strip_html | truncate: 160 }}</p>
        </a>
      {% endfor %}
    </div>
  </section>

</section>
