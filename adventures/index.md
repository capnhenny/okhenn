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

<script>
  (async function () {
    var el = document.getElementById('travel-map');
    var adventures = window.adventuresMapData || [];
    if (!el) return;

    var map = L.map('travel-map', {
      scrollWheelZoom: false,
      worldCopyJump: true
    }).setView([20, 0], 2);

            L.tileLayer(
              'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
              {
                maxZoom: 10,
                attribution: '&copy; OpenStreetMap &copy; CARTO'
              }
            ).addTo(map);

    function normalizeCountry(name) {
      if (!name) return '';
      var n = String(name).trim();

      var aliases = {
        'USA': 'United States of America',
        'US': 'United States of America',
        'United States': 'United States of America',
        'U.S.A.': 'United States of America',
        'UK': 'United Kingdom'
      };

      return aliases[n] || n;
    }

    function normalizeState(name) {
      if (!name) return '';
      return String(name).trim();
    }

    function getVisitColor(count) {
      if (count >= 4) return '#43c463'; // green
      if (count === 3) return '#d83b3b'; // red
      if (count === 2) return '#ff9f40'; // orange
      if (count === 1) return '#ff78c8'; // pink
      return '#241431'; // unvisited
    }

    var countryCounts = {};
    var stateCounts = {};
    var bounds = [];

    adventures.forEach(function (a) {
      var country = normalizeCountry(a.country);
      var state = normalizeState(a.us_state);

      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }

      if (country === 'United States of America' && state) {
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      }

      if (typeof a.lat === 'number' && typeof a.lng === 'number') {
        var marker = L.circleMarker([a.lat, a.lng], {
          radius: 6,
          weight: 2,
          color: '#ffd6f4',
          fillColor: '#ff78c8',
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(
          '<strong>' + a.title + '</strong><br>' +
          (a.location ? a.location + '<br>' : '') +
          '<a href="' + a.url + '">read this adventure →</a>'
        );

        bounds.push([a.lat, a.lng]);
      }
    });

    var worldUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
    var statesUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

    var responses = await Promise.all([
      fetch(worldUrl),
      fetch(statesUrl)
    ]);

    var worldTopo = await responses[0].json();
    var statesTopo = await responses[1].json();

    var worldFeatures = topojson.feature(
      worldTopo,
      worldTopo.objects.countries
    ).features;

    var stateFeatures = topojson.feature(
      statesTopo,
      statesTopo.objects.states
    ).features;

    L.geoJSON(worldFeatures, {
      style: function (feature) {
        var name = feature && feature.properties ? feature.properties.name : '';
        var count = countryCounts[name] || 0;

        return {
          color: '#6f5a86',
          weight: 1,
          fillColor: getVisitColor(count),
          fillOpacity: count ? 0.6 : 0.18
        };
      },
      onEachFeature: function (feature, layer) {
        var name = feature && feature.properties ? feature.properties.name : '';
        var count = countryCounts[name] || 0;

        if (count > 0) {
          layer.bindTooltip(name + ' · ' + count + ' visit' + (count === 1 ? '' : 's'));
        }
      }
    }).addTo(map);

    L.geoJSON(stateFeatures, {
      style: function (feature) {
        var name = feature && feature.properties ? feature.properties.name : '';
        var count = stateCounts[name] || 0;

        return {
          color: '#f5dfff',
          weight: count ? 1.4 : 0.8,
          fillColor: getVisitColor(count),
          fillOpacity: count ? 0.85 : 0
        };
      },
      onEachFeature: function (feature, layer) {
        var name = feature && feature.properties ? feature.properties.name : '';
        var count = stateCounts[name] || 0;

        if (count > 0) {
          layer.bindTooltip(name + ' · ' + count + ' visit' + (count === 1 ? '' : 's'));
        }
      }
    }).addTo(map);

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

</section>
