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
      "location": {{ trip.location | jsonify }},
      "country": {{ trip.country | jsonify }},
      "us_state": {{ trip.us_state | jsonify }},
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
    
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>

.travel-star:hover {
  transform: scale(1.8);
  box-shadow:
    0 0 12px #ffb3e6,
    0 0 24px #ff78c8,
    0 0 36px #ff78c8;
}

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
<p class="map-note adventures-filter-reset" style="display:none;">
  <a href="/adventures/">show all adventures</a>
</p>
    
    <div class="cards">
{% assign items = site.adventures | sort: "date" | reverse %}
{% for trip in items %}

  <a
    class="card"
    href="{{ trip.url | relative_url }}"
    data-country="{{ trip.country | escape }}"
    data-us-state="{{ trip.us_state | escape }}"
  >

{% if trip.thumb %}
  <img src="{{ trip.thumb | relative_url }}" alt="" class="post-thumb">
{% elsif trip.media %}
  <img src="{{ trip.media | relative_url }}" alt="" class="post-thumb">
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

<script>
  (function () {
    var params = new URLSearchParams(window.location.search);
    var country = params.get('country');
    var usState = params.get('us_state');

    if (!country && !usState) return;

    var reset = document.querySelector('.adventures-filter-reset');
        if (reset && (country || usState)) {
          reset.style.display = '';
        }
    
    var cards = Array.from(document.querySelectorAll('.adventures-list .card'));
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardCountry = card.getAttribute('data-country') || '';
      var cardState = card.getAttribute('data-us-state') || '';
      var matches = true;

      if (country) {
        matches = matches && cardCountry === country;
      }

      if (usState) {
        matches = matches && cardState === usState;
      }

      card.style.display = matches ? '' : 'none';

      if (matches) visibleCount++;
    });

    var heading = document.querySelector('.adventures-list h2');
    if (heading) {
      if (country && usState) {
        heading.textContent = 'mission log · ' + usState + ', ' + country;
      } else if (usState) {
        heading.textContent = 'mission log · ' + usState;
      } else if (country) {
        heading.textContent = 'mission log · ' + country;
      }
    }

    var notes = document.querySelector('.adventures-hero p');
    if (notes) {
      if (country && usState) {
        notes.textContent = 'showing adventures tagged in ' + usState + ', ' + country + '.';
      } else if (usState) {
        notes.textContent = 'showing adventures tagged in ' + usState + '.';
      } else if (country) {
        notes.textContent = 'showing adventures tagged in ' + country + '.';
      }
    }

    if (visibleCount === 0) {
      var cardsWrap = document.querySelector('.adventures-list .cards');
      if (cardsWrap) {
        cardsWrap.innerHTML = '<p class="meta">no adventures logged for that place yet.</p>';
      }
    }
  })();
</script>

</section>
