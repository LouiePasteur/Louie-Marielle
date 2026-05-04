<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const navOpen = ref(false)
const scrolled = ref(false)

const rsvpSubmitted = ref(false)
const rsvpSubmitting = ref(false)

const rsvp = ref({
  fullName: '',
  email: '',
  attendance: '',
  message: '',
})

const attirePalette = [
  { label: 'Cream & linen', color: '#ede4d7' },
  { label: 'Blushing Peach', color: '#efa59a' },
  { label: 'Terracotta', color: '#c0674f' },
  { label: 'Sage', color: '#8fa38f' },
  { label: 'Olive', color: '#6f7a55' },
  { label: 'Camel', color: '#b8926a' },
  { label: 'Dusty rose', color: '#c9a09a' },
]

const programItems = [
  {
    time: '3:00 PM',
    title: 'Guest arrival',
    detail: 'Registration and light refreshments at the venue.',
  },
  { time: '3:30 PM', title: 'Ceremony', detail: 'Exchange of vows with family and friends.' },
  { time: '4:15 PM', title: 'Cocktail hour', detail: 'Drinks, conversation, and photos.' },
  {
    time: '5:00 PM',
    title: 'Reception',
    detail: 'Dinner is served; celebrate together at the table.',
  },
  {
    time: '6:30 PM',
    title: 'Toasts & cake',
    detail: 'Kind words, sweetness, and a little dancing.',
  },
  { time: '7:00 PM', title: 'Send-off', detail: 'Thank you for sharing this day with us.' },
]

function resetRsvpForm() {
  rsvp.value = {
    fullName: '',
    email: '',
    attendance: '',
    message: '',
  }
  rsvpSubmitted.value = false
}

function submitRsvp() {
  if (rsvpSubmitting.value) return
  const { fullName, email, attendance } = rsvp.value
  if (!fullName.trim() || !email.trim() || !attendance) return

  rsvpSubmitting.value = true
  window.setTimeout(() => {
    rsvpSubmitting.value = false
    rsvpSubmitted.value = true
  }, 450)
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function closeNav() {
  navOpen.value = false
}

let revealObserver = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

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
        <a href="#program" @click="closeNav">Program</a>
        <a href="#venue" @click="closeNav">Venue</a>
        <a href="#attire" @click="closeNav">Attire</a>
        <a href="#rsvp" @click="closeNav">RSVP</a>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero reveal-on-scroll">
        <div class="hero__image-slot image-slot image-slot--hero" aria-hidden="true">
          <span class="image-slot__label">Your photo</span>
        </div>
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
          <div class="inline-gallery">
            <div class="image-slot image-slot--square" aria-hidden="true">
              <span class="image-slot__label">Your photo</span>
            </div>
            <div class="image-slot image-slot--square" aria-hidden="true">
              <span class="image-slot__label">Your photo</span>
            </div>
            <div class="image-slot image-slot--square" aria-hidden="true">
              <span class="image-slot__label">Your photo</span>
            </div>
          </div>
        </div>
      </section>

      <section id="program" class="section section--paper section--program reveal-on-scroll">
        <div class="section__inner">
          <h2 class="section__title">Program</h2>
          <div class="ornament" aria-hidden="true" />
          <p class="program-intro">
            A gentle flow for our afternoon together. Times may shift slightly so everyone can relax
            and enjoy the moment.
          </p>
          <ol class="program-timeline">
            <li
              v-for="(item, index) in programItems"
              :key="index"
              class="program-step"
              :class="index % 2 === 0 ? 'program-step--left' : 'program-step--right'"
            >
              <div class="program-step__body">
                <p class="program-step__time">{{ item.time }}</p>
                <h3 class="program-step__title">{{ item.title }}</h3>
                <p class="program-step__detail">{{ item.detail }}</p>
              </div>
            </li>
          </ol>
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
          <p class="lead">Semi-formal</p>
          <p class="attire-copy">
            We would love for you to wear
            <strong>semi-formal</strong>
            attire in our
            <strong>boho rustic</strong>
            palette: warm cream and linen, soft peach, terracotta, sage and olive, camel and soft
            brown, and touches of dusty rose. Natural fabrics and relaxed silhouettes fit the mood
            beautifully.
          </p>
          <p class="attire-palette-heading">Semi-formal color guide</p>
          <p class="attire-palette-hint">
            Mix and match within these tones—no need to match exactly.
          </p>
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
      </section>

      <section id="rsvp" class="section section--paper section--rsvp reveal-on-scroll">
        <div class="section__inner section__inner--narrow">
          <h2 class="section__title">RSVP</h2>
          <div class="ornament" aria-hidden="true" />
          <p class="rsvp-intro">
            Kindly let us know if you can celebrate with us so we can plan seating and catering with
            care.
          </p>

          <div v-if="rsvpSubmitted" class="rsvp-success" role="status">
            <p class="rsvp-success__title">Thank you</p>
            <p class="rsvp-success__text">
              Your response has been noted. We’re so grateful you took a moment to reply.
            </p>
            <button type="button" class="rsvp-reset" @click="resetRsvpForm">
              Send another response
            </button>
          </div>

          <form v-else class="rsvp-form" @submit.prevent="submitRsvp">
            <div class="form-field">
              <label class="form-label" for="rsvp-name">Full name</label>
              <input
                id="rsvp-name"
                v-model="rsvp.fullName"
                class="form-input"
                type="text"
                name="fullName"
                autocomplete="name"
                required
              />
            </div>
            <div class="form-field">
              <label class="form-label" for="rsvp-email">Email</label>
              <input
                id="rsvp-email"
                v-model="rsvp.email"
                class="form-input"
                type="email"
                name="email"
                autocomplete="email"
                required
              />
            </div>
            <fieldset class="form-field form-field--fieldset">
              <legend class="form-label">Will you attend?</legend>
              <div class="form-radios">
                <label class="form-radio">
                  <input
                    v-model="rsvp.attendance"
                    type="radio"
                    name="attendance"
                    value="yes"
                    required
                  />
                  <span>Joyfully accepts</span>
                </label>
                <label class="form-radio">
                  <input v-model="rsvp.attendance" type="radio" name="attendance" value="no" />
                  <span>Regretfully declines</span>
                </label>
              </div>
            </fieldset>
            <div class="form-field">
              <label class="form-label" for="rsvp-message"
                >Dietary needs or a note (optional)</label
              >
              <textarea
                id="rsvp-message"
                v-model="rsvp.message"
                class="form-textarea"
                name="message"
                rows="3"
              />
            </div>
            <p class="form-note">
              This form is for the website preview. Connect it to your email or backend when you’re
              ready to collect real responses.
            </p>
            <button type="submit" class="form-submit" :disabled="rsvpSubmitting">
              {{ rsvpSubmitting ? 'Sending…' : 'Send RSVP' }}
            </button>
          </form>
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
  --terracotta: #b86b52;
  --terracotta-dark: #8f4f3c;
  --sage: #8a9b7e;
  --sage-dark: #5f6e54;
  --bark: #4a3f36;
  --ink: #2c2620;
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
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.top-nav--scrolled {
  background: rgba(243, 236, 227, 0.94);
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
  align-items: flex-end;
  justify-content: center;
  padding: 5rem 1.25rem 3rem;
}

.hero__image-slot {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 0;
}

.hero__overlay {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 36rem;
  padding: 2rem 1.5rem 2.25rem;
  background: rgba(243, 236, 227, 0.88);
  border: 1px solid rgba(196, 165, 116, 0.35);
  border-radius: 2px;
  box-shadow: 0 24px 48px rgba(44, 38, 32, 0.12);
}

.hero__eyebrow {
  margin: 0 0 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sage-dark);
}

.hero__names {
  margin: 0;
  font-family: 'Great Vibes', cursive;
  font-weight: 400;
  font-size: clamp(2.75rem, 10vw, 4.25rem);
  line-height: 1.15;
  color: var(--bark);
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
  color: var(--ink);
  opacity: 0.9;
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
  color: var(--cream);
  background: var(--terracotta-dark);
  border-radius: 2px;
  transition:
    background 0.2s,
    transform 0.2s;
}

.hero__cta:hover {
  background: var(--bark);
  color: var(--cream);
}

.image-slot {
  position: relative;
  background:
    repeating-linear-gradient(
      -12deg,
      rgba(232, 223, 210, 0.5) 0,
      rgba(232, 223, 210, 0.5) 1px,
      transparent 1px,
      transparent 12px
    ),
    linear-gradient(145deg, rgba(196, 165, 116, 0.15), rgba(138, 155, 126, 0.12));
  border: 2px dashed rgba(184, 107, 82, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-slot--hero {
  min-height: 100%;
}

.image-slot--square {
  aspect-ratio: 1;
  border-radius: 2px;
}

.image-slot__label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  font-style: italic;
  color: rgba(74, 63, 54, 0.45);
  pointer-events: none;
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

.inline-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 2.5rem;
}

@media (max-width: 640px) {
  .inline-gallery {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
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

.attire-palette-heading {
  margin: 2rem 0 0.35rem;
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

.section--program {
  background: linear-gradient(180deg, var(--cream) 0%, var(--parchment) 45%, var(--cream) 100%);
}

.program-intro {
  margin: 0 auto 2rem;
  max-width: 36rem;
  text-align: center;
  font-size: 1.02rem;
  line-height: 1.65;
  color: rgba(44, 38, 32, 0.88);
}

.program-timeline {
  position: relative;
  list-style: none;
  margin: 0 auto;
  padding: 0.35rem 0 0;
  max-width: 760px;
}

.program-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    rgba(184, 107, 82, 0.45),
    rgba(138, 155, 126, 0.38),
    rgba(138, 155, 126, 0.28)
  );
  border-radius: 1px;
}

.program-step {
  position: relative;
  padding-bottom: 2rem;
}

.program-step:last-child {
  padding-bottom: 0;
}

.program-step::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0.35rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: var(--cream);
  border: 2px solid var(--terracotta);
  box-shadow: 0 0 0 3px rgba(196, 165, 116, 0.35);
  z-index: 1;
}

.program-step__body {
  width: calc(50% - 1.85rem);
  box-sizing: border-box;
}

.program-step--left .program-step__body {
  margin-right: auto;
  text-align: right;
  padding-right: 0.35rem;
}

.program-step--right .program-step__body {
  margin-left: auto;
  text-align: left;
  padding-left: 0.35rem;
}

@media (max-width: 700px) {
  .program-timeline::before {
    left: 11px;
    transform: none;
  }

  .program-step::before {
    left: 11px;
    transform: translateX(-50%);
  }

  .program-step__body {
    width: auto;
  }

  .program-step--left .program-step__body,
  .program-step--right .program-step__body {
    margin-left: 2.35rem;
    margin-right: 0;
    text-align: left;
    padding-left: 0;
    padding-right: 0;
  }
}

.program-step__time {
  margin: 0 0 0.2rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--terracotta-dark);
}

.program-step__title {
  margin: 0 0 0.35rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--bark);
}

.program-step__detail {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.6;
  color: rgba(44, 38, 32, 0.88);
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

.rsvp-form {
  margin-top: 0.5rem;
}

.form-field {
  margin-bottom: 1.25rem;
}

.form-field--fieldset {
  border: none;
  padding: 0;
  margin: 0 0 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sage-dark);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 1rem;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(196, 165, 116, 0.45);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(44, 38, 32, 0.04);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(184, 107, 82, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 5rem;
}

.form-radios {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.35rem;
}

.form-radio {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 1rem;
  line-height: 1.45;
  color: rgba(44, 38, 32, 0.92);
  cursor: pointer;
}

.form-radio input {
  margin-top: 0.2rem;
  accent-color: var(--terracotta-dark);
}

.form-note {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  line-height: 1.5;
  font-style: italic;
  color: rgba(44, 38, 32, 0.65);
}

.form-submit {
  width: 100%;
  padding: 0.75rem 1.25rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cream);
  background: var(--terracotta-dark);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition:
    background 0.2s,
    opacity 0.2s;
}

.form-submit:hover:not(:disabled) {
  background: var(--bark);
}

.form-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.rsvp-success {
  text-align: center;
  padding: 2rem 1.25rem;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(196, 165, 116, 0.4);
  border-radius: 2px;
  box-shadow: 0 8px 28px rgba(44, 38, 32, 0.08);
}

.rsvp-success__title {
  margin: 0 0 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--bark);
}

.rsvp-success__text {
  margin: 0 0 1.25rem;
  font-size: 1.02rem;
  line-height: 1.65;
  color: rgba(44, 38, 32, 0.88);
}

.rsvp-reset {
  padding: 0.5rem 1rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--terracotta-dark);
  background: transparent;
  border: 1px solid rgba(184, 107, 82, 0.5);
  border-radius: 2px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.rsvp-reset:hover {
  background: rgba(184, 107, 82, 0.08);
}

.footer {
  padding: 2.5rem 1.25rem 3rem;
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
