<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import heroImage from '../assets/images/hero.jpg'
import celebration1 from '../assets/images/1.jpg'
import celebration2 from '../assets/images/2.jpg'
import celebration3 from '../assets/images/3.jpg'
import celebration4 from '../assets/images/4.jpg'
import celebration5 from '../assets/images/5.jpg'
import celebration6 from '../assets/images/6.jpg'
import celebration7 from '../assets/images/7.jpg'
import celebration8 from '../assets/images/8.jpg'
import celebration9 from '../assets/images/9.jpg'

const navOpen = ref(false)
const scrolled = ref(false)
const isCompactCelebration = ref(false)

const rsvpFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdhuo8uQbv7YVD0QtZrRnKayMxpmKBecSYvqpPen_z-Vwg85g/viewform'

const attirePalette = [
  { label: 'Blushing Peach', color: '#efa59a' },
  { label: 'Terracotta', color: '#c0674f' },
  { label: 'Sage', color: '#8fa38f' },
  { label: 'Olive', color: '#6f7a55' },
  { label: 'Camel', color: '#b8926a' },
  { label: 'Dusty rose', color: '#c9a09a' },
]

const entourageDressCode = {
  label: 'Formal',
  description:
    'We would love for our entourage to wear formal attire. Elegant silhouettes and polished fabrics will complement the celebration beautifully.',
  colors: [{ value: 'Sage Green', color: '#8fa38f' }],
}

const guestDressCode = {
  label: 'Semi-formal',
  description:
    'We would love for our guests to wear semi-formal attire in our boho rustic palette. Natural fabrics and relaxed silhouettes fit the mood beautifully.',
}

const celebrationImages = [
  celebration1,
  celebration2,
  celebration3,
  celebration4,
  celebration5,
  celebration6,
  celebration7,
  celebration8,
  celebration9,
]

const celebrationStartIndex = ref(0)
const celebrationVisibleCount = computed(() => (isCompactCelebration.value ? 2 : 3))
const carouselDirection = ref('next')

const visibleCelebrationImages = computed(() => {
  return Array.from({ length: celebrationVisibleCount.value }, (_, offset) => {
    const index = (celebrationStartIndex.value + offset) % celebrationImages.length
    return {
      src: celebrationImages[index],
      alt: `Celebration photo ${index + 1}`,
      key: `${index}-${celebrationStartIndex.value}`,
    }
  })
})

function showPreviousCelebrationPhotos() {
  carouselDirection.value = 'previous'
  celebrationStartIndex.value =
    (celebrationStartIndex.value - 1 + celebrationImages.length) % celebrationImages.length
}

function showNextCelebrationPhotos() {
  carouselDirection.value = 'next'
  celebrationStartIndex.value = (celebrationStartIndex.value + 1) % celebrationImages.length
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function syncCelebrationLayout() {
  isCompactCelebration.value = window.matchMedia('(max-width: 767px)').matches
}

function closeNav() {
  navOpen.value = false
}

let revealObserver = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', syncCelebrationLayout, { passive: true })
  onScroll()
  syncCelebrationLayout()

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    revealObserver.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', syncCelebrationLayout)
  revealObserver?.disconnect()
  revealObserver = null
})

const venue = {
  name: "Alberto's Event Center",
  line1: 'Poblacion 1, J.P. Laurel Street',
  city: 'Santo Tomas, Batangas, Philippines',
  mapsQuery: encodeURIComponent(
    "Alberto's Event Center, J.P. Laurel Street, Santo Tomas, Batangas, Philippines",
  ),
}
</script>

<template>
  <div class="invite">
    <header class="top-nav" :class="{ 'top-nav--scrolled': scrolled }">
      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="navOpen"
        aria-label="Toggle menu"
        @click="navOpen = !navOpen"
      >
        <span class="nav-toggle__bar" />
        <span class="nav-toggle__bar" />
        <span class="nav-toggle__bar" />
      </button>
      <nav class="nav" :class="{ 'nav--open': navOpen }">
        <a href="#hero" @click="closeNav">Home</a>
        <a href="#celebration" @click="closeNav">Celebration</a>
        <a href="#venue" @click="closeNav">Venue</a>
        <a href="#attire" @click="closeNav">Attire</a>
        <a href="#rsvp" @click="closeNav">RSVP</a>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero reveal-on-scroll">
        <div
          class="hero__image"
          :style="{ backgroundImage: `url(${heroImage})` }"
          aria-hidden="true"
        />
        <div class="hero__overlay">
          <p class="hero__eyebrow">Together with their families</p>
          <h1 class="hero__names">Louie <span class="hero__ampersand">&</span> Marielle</h1>
          <p class="hero__invite">request the pleasure of your company</p>
          <a class="hero__cta" href="#celebration">Celebration details</a>
        </div>
      </section>

      <section id="celebration" class="section section--paper reveal-on-scroll">
        <div class="section__inner">
          <h2 class="section__title">The celebration</h2>
          <div class="ornament" aria-hidden="true" />
          <div class="details-grid">
            <article class="detail-card">
              <h3 class="detail-card__label">When</h3>
              <p class="detail-card__value">3:00 PM – 7:00 PM</p>
              <p class="detail-card__hint">
                Kindly arrive on time so we can celebrate every moment.
              </p>
            </article>
            <article class="detail-card">
              <h3 class="detail-card__label">Where</h3>
              <p class="detail-card__value">{{ venue.name }}</p>
              <p class="detail-card__hint">
                {{ venue.line1 }}<br />
                {{ venue.city }}
              </p>
            </article>
          </div>
          <div class="celebration-carousel">
            <button
              type="button"
              class="carousel-control"
              aria-label="Show previous celebration photos"
              @click="showPreviousCelebrationPhotos"
            >
              &lt;
            </button>
            <div :class="['inline-gallery', `inline-gallery--${carouselDirection}`]">
              <div
                v-for="photo in visibleCelebrationImages"
                :key="photo.key"
                class="celebration-photo-card"
              >
                <img :src="photo.src" :alt="photo.alt" class="celebration-photo" />
              </div>
            </div>
            <button
              type="button"
              class="carousel-control"
              aria-label="Show next celebration photos"
              @click="showNextCelebrationPhotos"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      <section id="venue" class="section section--sage reveal-on-scroll">
        <div class="section__inner">
          <h2 class="section__title section__title--light">Find us</h2>
          <div class="ornament ornament--light" aria-hidden="true" />
          <p class="venue-address">
            <strong>{{ venue.name }}</strong
            ><br />
            {{ venue.line1 }}<br />
            {{ venue.city }}
          </p>
          <div class="map-wrap">
            <iframe
              title="Map: Alberto's Event Center, Santo Tomas, Batangas"
              class="map"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
              :src="`https://www.google.com/maps?q=${venue.mapsQuery}&output=embed&z=16`"
            />
          </div>
          <a
            class="map-link"
            :href="`https://www.google.com/maps/search/?api=1&query=${venue.mapsQuery}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </section>

      <section id="attire" class="section section--paper reveal-on-scroll">
        <div class="section__inner section__inner--narrow">
          <h2 class="section__title">Dress code</h2>
          <div class="ornament" aria-hidden="true" />
          <div class="attire-group">
            <p class="attire-group__eyebrow">For Entourage</p>
            <p class="lead">{{ entourageDressCode.label }}</p>
            <p class="attire-copy">{{ entourageDressCode.description }}</p>
            <div class="attire-role-grid attire-role-grid--single">
              <div
                v-for="entry in entourageDressCode.colors"
                :key="entry.value"
                class="attire-role-card attire-role-card--plain"
              >
                <span
                  class="attire-role-card__swatch"
                  :style="{ backgroundColor: entry.color }"
                  :aria-label="`Assigned entourage color: ${entry.value}`"
                  role="img"
                />
                <p class="attire-role-card__value">{{ entry.value }}</p>
              </div>
            </div>
          </div>

          <div class="attire-group">
            <p class="attire-group__eyebrow">For Guest</p>
            <p class="lead">{{ guestDressCode.label }}</p>
            <p class="attire-copy">{{ guestDressCode.description }}</p>
            <p class="attire-palette-heading">Colors</p>
            <ul class="attire-palette" role="list">
              <li v-for="swatch in attirePalette" :key="swatch.label" class="attire-swatch">
                <span
                  class="attire-swatch__circle"
                  :style="{ backgroundColor: swatch.color }"
                  :aria-label="`Suggested color: ${swatch.label}`"
                  role="img"
                />
                <span class="attire-swatch__label">{{ swatch.label }}</span>
              </li>
            </ul>
            <p class="attire-note">Please skip stark black, neon colors, or all-white outfits.</p>
          </div>
        </div>
      </section>

      <section id="rsvp" class="section section--paper section--rsvp reveal-on-scroll">
        <div class="section__inner section__inner--narrow">
          <h2 class="section__title">RSVP</h2>
          <div class="ornament" aria-hidden="true" />
          <p class="rsvp-intro">
            Kindly let us know if you can celebrate with us so we can plan seating and catering with
            care.
          </p>
          <a class="rsvp-cta" :href="rsvpFormUrl" target="_blank" rel="noopener noreferrer">
            Open RSVP Form
          </a>
          <p class="rsvp-note">
            <i>
              Please note: This RSVP is for invited guests only. We're not able to accommodate
              plus-ones or uninvited guests due to venue capacity. Thank you for understanding!
            </i>
          </p>
        </div>
      </section>

      <footer class="footer reveal-on-scroll">
        <p class="footer__line">With love — Louie &amp; Marielle</p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
  filter: blur(0);
  transition:
    opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.reveal-on-scroll.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
    will-change: auto;
  }
}

.invite {
  --cream: #f3ece3;
  --parchment: #e8dfd2;
  --terracotta: #c78871;
  --terracotta-dark: #a76a56;
  --sage: #9cae90;
  --sage-dark: #76886b;
  --bark: #63564b;
  --ink: #453b33;
  --wheat: #c4a574;

  min-height: 100vh;
  color: var(--ink);
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(196, 165, 116, 0.18), transparent 55%),
    var(--cream);
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: rgba(243, 236, 227, 0.42);
  backdrop-filter: blur(6px);
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.top-nav--scrolled {
  background: rgba(243, 236, 227, 0.72);
  box-shadow: 0 1px 0 rgba(74, 63, 54, 0.08);
  backdrop-filter: blur(8px);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
}

.nav a {
  text-decoration: none;
  color: var(--bark);
  padding: 0.35rem 0.25rem;
  border-bottom: 1px solid transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.nav a:hover {
  color: var(--terracotta-dark);
  border-bottom-color: rgba(184, 107, 82, 0.45);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.nav-toggle__bar {
  display: block;
  height: 2px;
  width: 22px;
  background: var(--bark);
  border-radius: 1px;
}

@media (max-width: 640px) {
  .nav-toggle {
    display: flex;
  }

  .top-nav {
    justify-content: flex-start;
    min-height: 3.25rem;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 1rem 1rem;
    background: rgba(243, 236, 227, 0.98);
    box-shadow: 0 8px 24px rgba(44, 38, 32, 0.08);
    gap: 0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition:
      max-height 0.35s ease,
      opacity 0.25s ease;
  }

  .nav--open {
    max-height: 440px;
    opacity: 1;
    pointer-events: auto;
  }

  .nav a {
    padding: 0.65rem 0;
    border-bottom: 1px solid rgba(74, 63, 54, 0.1);
  }
}

.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.25rem 3rem;
}

.hero__image {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 0;
  background-position: calc(50% + 6%) 76%;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero__overlay {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 36rem;
  padding: 2rem 1.5rem 2.25rem;
  background: transparent;
  border: none;
  border-radius: 2px;
  box-shadow: none;
}

.hero__eyebrow {
  margin: 0 0 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f6eee4;
  text-shadow: 0 1px 4px rgba(44, 38, 32, 0.32);
}

.hero__names {
  margin: 0;
  font-family: 'Great Vibes', cursive;
  font-weight: 400;
  font-size: clamp(2.75rem, 10vw, 4.25rem);
  line-height: 1.15;
  color: #fff8ef;
  text-shadow: 0 2px 10px rgba(44, 38, 32, 0.4);
}

.hero__ampersand {
  display: inline-block;
  margin: 0 0.15em;
  font-size: 0.65em;
  color: var(--terracotta);
}

.hero__invite {
  margin: 0.75rem 0 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #5a4a3f;
  opacity: 0.96;
  text-shadow: 0 1px 3px rgba(243, 236, 227, 0.42);
}

.hero__cta {
  display: inline-block;
  margin-top: 1.35rem;
  padding: 0.65rem 1.35rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff9f2;
  background: rgba(167, 106, 86, 0.9);
  border-radius: 2px;
  transition:
    background 0.2s,
    transform 0.2s;
}

.hero__cta:hover {
  background: var(--bark);
  color: var(--cream);
}

.section {
  padding: 4rem 1.25rem;
}

.section--paper {
  background: linear-gradient(180deg, var(--parchment) 0%, var(--cream) 40%, var(--cream) 100%);
}

.section--sage {
  background: linear-gradient(160deg, #7d8f72 0%, #5f6e54 48%, #4f5d46 100%);
  color: #f7f3ec;
}

.section__inner {
  max-width: 900px;
  margin: 0 auto;
}

.section__inner--narrow {
  max-width: 560px;
}

.section--sage .section__inner {
  text-align: center;
}

.section__title {
  margin: 0;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bark);
}

.section__title--light {
  color: #f7f3ec;
}

.ornament {
  width: 48px;
  height: 1px;
  margin: 1rem auto 2rem;
  background: linear-gradient(90deg, transparent, var(--wheat), transparent);
  position: relative;
}

.ornament::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 8px;
  height: 8px;
  border: 1px solid var(--wheat);
  background: var(--cream);
}

.ornament--light::before {
  background: rgba(247, 243, 236, 0.15);
  border-color: rgba(247, 243, 236, 0.5);
}

.ornament--light {
  background: linear-gradient(90deg, transparent, rgba(247, 243, 236, 0.6), transparent);
}

.details-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.detail-card {
  padding: 1.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(196, 165, 116, 0.35);
  border-radius: 2px;
  box-shadow: 0 8px 24px rgba(44, 38, 32, 0.06);
}

.detail-card__label {
  margin: 0 0 0.35rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage-dark);
}

.detail-card__value {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.45rem;
  font-weight: 600;
  color: var(--bark);
}

.detail-card__hint {
  margin: 0.65rem 0 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(44, 38, 32, 0.85);
}

.celebration-carousel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.85rem;
  margin-top: 2.5rem;
}

.inline-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.celebration-photo-card {
  aspect-ratio: 1;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(196, 165, 116, 0.45);
  box-shadow: 0 10px 24px rgba(44, 38, 32, 0.1);
}

.inline-gallery--next .celebration-photo-card {
  animation: celebrationSlideInNext 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.inline-gallery--previous .celebration-photo-card {
  animation: celebrationSlideInPrevious 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.inline-gallery .celebration-photo-card:nth-child(2) {
  animation-delay: 0.07s;
}

.inline-gallery .celebration-photo-card:nth-child(3) {
  animation-delay: 0.14s;
}

.celebration-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-control {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(184, 107, 82, 0.5);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.68);
  color: var(--terracotta-dark);
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.carousel-control:hover {
  background: var(--terracotta-dark);
  color: var(--cream);
  border-color: var(--terracotta-dark);
}

@keyframes celebrationSlideInNext {
  from {
    opacity: 0;
    transform: translate3d(14px, 0, 0) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes celebrationSlideInPrevious {
  from {
    opacity: 0;
    transform: translate3d(-14px, 0, 0) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@media (max-width: 640px) {
  .inline-gallery {
    width: min(100%, 360px);
  }
}

@media (max-width: 767px) {
  .celebration-carousel {
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    justify-content: center;
  }

  .inline-gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .carousel-control {
    align-self: center;
    justify-self: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inline-gallery--next .celebration-photo-card,
  .inline-gallery--previous .celebration-photo-card {
    animation: none;
  }
}

.venue-address {
  text-align: center;
  margin: 0 0 1.5rem;
  font-size: 1rem;
  line-height: 1.65;
  opacity: 0.95;
}

.map-wrap {
  position: relative;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(247, 243, 236, 0.35);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.map {
  display: block;
  width: 100%;
  height: min(420px, 55vh);
  border: 0;
}

.map-link {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  color: #f7f3ec;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.map-link:hover {
  color: #fff;
}

.lead {
  text-align: center;
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.65rem;
  font-weight: 600;
  color: var(--terracotta-dark);
}

.attire-copy,
.attire-note {
  font-size: 1.02rem;
  line-height: 1.7;
  text-align: center;
  margin: 1rem 0 0;
  color: rgba(44, 38, 32, 0.92);
}

.attire-group + .attire-group {
  margin-top: 2.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(196, 165, 116, 0.3);
}

.attire-group__eyebrow {
  margin: 0;
  text-align: center;
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--terracotta-dark);
}

.attire-role-grid {
  margin: 1.5rem auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  max-width: 28rem;
}

.attire-role-grid--single {
  grid-template-columns: minmax(0, 1fr);
  max-width: 10rem;
}

.attire-role-card {
  padding: 1.25rem 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(196, 165, 116, 0.3);
  border-radius: 2px;
  box-shadow: 0 10px 24px rgba(44, 38, 32, 0.06);
}

.attire-role-card--plain {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.attire-role-card__swatch {
  display: block;
  width: 4rem;
  height: 4rem;
  margin: 0.85rem auto 0.6rem;
  border-radius: 50%;
  border: 1px solid rgba(74, 63, 54, 0.18);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.35),
    0 4px 12px rgba(44, 38, 32, 0.12);
}

.attire-role-card__value {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(44, 38, 32, 0.82);
}

.attire-palette-heading {
  margin: 1.75rem 0 0.75rem;
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-dark);
}

.attire-palette-hint {
  margin: 0 0 1.25rem;
  text-align: center;
  font-size: 0.92rem;
  line-height: 1.5;
  color: rgba(44, 38, 32, 0.72);
}

.attire-palette {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5.75rem, 1fr));
  gap: 1.1rem 0.85rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.attire-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.attire-swatch__circle {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(74, 63, 54, 0.18);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.35),
    0 4px 12px rgba(44, 38, 32, 0.12);
}

.attire-swatch__label {
  font-size: 0.78rem;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: rgba(44, 38, 32, 0.82);
  max-width: 7rem;
}

.attire-note {
  font-size: 0.95rem;
  font-style: italic;
  opacity: 0.88;
  margin-top: 1.75rem;
}

.section--rsvp {
  padding-bottom: 4.5rem;
}

.rsvp-intro {
  margin: 0 0 1.75rem;
  text-align: center;
  font-size: 1.02rem;
  line-height: 1.65;
  color: rgba(44, 38, 32, 0.88);
}

.rsvp-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cream);
  background: var(--terracotta-dark);
  text-decoration: none;
  border-radius: 2px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
}

.rsvp-cta:hover {
  background: var(--bark);
  transform: translateY(-1px);
}

.rsvp-note {
  margin: 1rem auto 0;
  max-width: 34rem;
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(44, 38, 32, 0.74);
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.25rem 2.5rem;
  text-align: center;
  background: var(--bark);
  color: rgba(247, 243, 236, 0.88);
}

.footer__line {
  margin: 0;
  font-family: 'Great Vibes', cursive;
  font-size: 1.75rem;
}
</style>
