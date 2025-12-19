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
    </p>
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
    ></div>

    <p id="map-note" class="map-note">
      someday soon: click a glowing spot to see journal entries from that adventure.
    </p>

    <!-- expose adventures to JS -->
    <script>
      window.adventuresMapData = [
        {% assign items = site.adventures | sort: "date" %}
        {% for trip in items %}
        {
          "title": {{ trip.title | jsonify }},
          "url": {{ trip.url | relative_url | jsonify }},
          "lat": {{ trip.lat | default: "null" }},
          "lng": {{ trip.lng | default: "null" }}
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
      ];
    </script>

    <!-- Leaflet CSS & JS -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    >
    <script
      src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossorigin=""
    ></script>

    <script>
      (function () {
        var el = document.getElementById('travel-map');
        if (!el || !window.adventuresMapData || !window.adventuresMapData.length) return;

        // base map
        var map = L.map('travel-map', {
          scrollWheelZoom: false,
          worldCopyJump: true
        }).setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 10,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var bounds = [];

        (window.adventuresMapData || []).forEach(function (a) {
          if (typeof a.lat !== 'number' || typeof a.lng !== 'number') return;

          var marker = L.marker([a.lat, a.lng]).addTo(map);
          marker.bindPopup(
            '<strong>' + a.title + '</strong><br>' +
            '<a href="' + a.url + '">read this adventure →</a>'
          );
          bounds.push([a.lat, a.lng]);
        });

        if (bounds.length) {
          map.fitBounds(bounds, { padding: [30, 30] });
        }
      })();
    </script>
  </section>

  <!-- intro paragraph under the map -->
  <header class="adventures-hero">
    <h2>away missions</h2>
    <p>
      sometimes i leave the house. this is where those quests get logged:
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
    <img src="{{ trip.thumb | relative_url }}" alt="" class="post-thumb">
  {% elsif trip.photo %}
    <img src="{{ trip.photo | relative_url }}" alt="" class="post-thumb">
  {% endif %}

  <h3>{{ trip.title }}</h3>

  {% if trip.date %}
    <p class="date">{{ trip.date | date: "%b %-d, %Y · %-I:%M %p" }}</p>
  {% endif %}

  {% if trip.location %}
    <p class="meta">📍 {{ trip.location }}</p>
  {% endif %}

  {% if trip.itinerary %}
    <p class="meta">🗺️ {{ trip.itinerary | strip_html | truncate: 90 }}</p>
  {% endif %}

  <p>{{ trip.excerpt | strip_html | truncate: 160 }}</p>
</a>

{% endfor %}

    </div>
  </section>

</section>
