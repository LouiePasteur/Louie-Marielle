<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
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
import semiFormalAttireGuys from '../assets/images/semiformal-attire-guys.png'
import semiFormalAttireGirls from '../assets/images/semiformal-attire-girls.png'
import formalAttireGuys from '../assets/images/formal-attire-guys.png'
import formalAttireGirls from '../assets/images/formal-attire-girls.png'

const store = useStore()
const route = useRoute()

const navOpen = ref(false)
const scrolled = ref(false)
const isCompactCelebration = ref(false)

const rsvpSubmitted = ref(false)
const rsvpSubmitting = computed(() => store.state.rsvpSubmitting)
const rsvpError = computed(() => store.state.rsvpError)
const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailFormatValid = computed(() => {
  const email = rsvp.value.email.trim()
  return emailValidationPattern.test(email)
})
const emailValidationError = computed(() => {
  const email = rsvp.value.email.trim()
  if (!email) return ''
  return isEmailFormatValid.value ? '' : 'Please enter a valid email address.'
})
const isRsvpFormValid = computed(() => {
  const { fullName, email, attendance } = rsvp.value
  return Boolean(fullName.trim() && email.trim() && attendance && isEmailFormatValid.value)
})

const rsvp = ref({
  fullName: '',
  email: '',
  attendance: '',
  message: '',
})

const attirePalette = [
  { label: 'Blushing Peach', color: '#efa59a' },
  { label: 'Terracotta', color: '#c0674f' },
  { label: 'Sage', color: '#8fa38f' },
  { label: 'Olive', color: '#6f7a55' },
  { label: 'Camel', color: '#b8926a' },
  { label: 'Dusty rose', color: '#c9a09a' },
]

const isWeddingPartyRoute = computed(() => route.path === '/wedding-party')
const dressCodeLabel = computed(() => (isWeddingPartyRoute.value ? 'Formal' : 'Semi-formal'))
const menAttireImage = computed(() =>
  isWeddingPartyRoute.value ? formalAttireGuys : semiFormalAttireGuys,
)
const womenAttireImage = computed(() =>
  isWeddingPartyRoute.value ? formalAttireGirls : semiFormalAttireGirls,
)
const menAttireAlt = computed(() =>
  isWeddingPartyRoute.value
    ? 'Sample formal outfit inspiration for men'
    : 'Sample semi-formal outfit inspiration for men',
)
const womenAttireAlt = computed(() =>
  isWeddingPartyRoute.value
    ? 'Sample formal outfit inspiration for women'
    : 'Sample semi-formal outfit inspiration for women',
)
const attireDescription = computed(() =>
  isWeddingPartyRoute.value
    ? 'We would love for you to wear formal attire. Refined silhouettes and elegant fabrics fit the mood beautifully.'
    : 'We would love for you to wear semi-formal attire in our boho rustic palette: warm cream and linen, soft peach, terracotta, sage and olive, camel and soft brown, and touches of dusty rose. Natural fabrics and relaxed silhouettes fit the mood beautifully.',
)
const attirePaletteHeading = computed(() =>
  isWeddingPartyRoute.value ? 'Formal color guide' : 'Semi-formal color guide',
)
const attirePaletteHint = computed(() =>
  isWeddingPartyRoute.value
    ? 'Please follow the assigned shades: Guys in Olive, Girls in Sage.'
    : 'Mix and match within these tones—no need to match exactly.',
)
const displayedAttirePalette = computed(() =>
  isWeddingPartyRoute.value
    ? [
        { label: 'Men - Olive', color: '#6f7a55' },
        { label: 'Women - Sage', color: '#8fa38f' },
      ]
    : attirePalette,
)

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

async function submitRsvp() {
  if (rsvpSubmitting.value || !isRsvpFormValid.value) return

  try {
    await store.dispatch('submitRsvp', rsvp.value)
    rsvpSubmitted.value = true
  } catch {
    /* error message is in store */
  }
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
        <a href="#program" @click="closeNav">Program</a>
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
          <p class="lead">{{ dressCodeLabel }}</p>
          <p class="attire-copy">{{ attireDescription }}</p>
          <div class="attire-samples">
            <figure class="attire-sample">
              <figcaption class="attire-sample__label">Sample outfit for men:</figcaption>
              <img :src="menAttireImage" :alt="menAttireAlt" class="attire-sample__image" />
            </figure>
            <figure class="attire-sample">
              <figcaption class="attire-sample__label">Sample outfit for women:</figcaption>
              <img :src="womenAttireImage" :alt="womenAttireAlt" class="attire-sample__image" />
            </figure>
          </div>
          <p class="attire-palette-heading">{{ attirePaletteHeading }}</p>
          <p class="attire-palette-hint">{{ attirePaletteHint }}</p>
          <ul class="attire-palette" role="list">
            <li v-for="swatch in displayedAttirePalette" :key="swatch.label" class="attire-swatch">
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
          </div>

          <form v-else class="rsvp-form" @submit.prevent="submitRsvp">
            <div class="form-field">
              <label class="form-label" for="rsvp-name"
                >Full name <span class="required-asterisk" aria-hidden="true">*</span></label
              >
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
              <label class="form-label" for="rsvp-email"
                >Email <span class="required-asterisk" aria-hidden="true">*</span></label
              >
              <input
                id="rsvp-email"
                v-model="rsvp.email"
                class="form-input"
                type="email"
                name="email"
                autocomplete="email"
                required
              />
              <p v-if="emailValidationError" class="form-error" role="alert">
                {{ emailValidationError }}
              </p>
            </div>
            <fieldset class="form-field form-field--fieldset">
              <legend class="form-label">
                Will you attend? <span class="required-asterisk" aria-hidden="true">*</span>
              </legend>
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
            <p v-if="rsvpError" class="form-error" role="alert">{{ rsvpError }}</p>
            <p class="form-note">Your RSVP is saved for Louie &amp; Marielle’s guest list.</p>
            <button
              type="submit"
              class="form-submit"
              :disabled="rsvpSubmitting || !isRsvpFormValid"
            >
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

.attire-samples {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
}

.attire-sample {
  margin: 0;
}

.attire-sample__label {
  margin: 0 0 0.5rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  letter-spacing: 0.02em;
  text-transform: none;
  color: var(--sage-dark);
  font-weight: 600;
}

.attire-sample__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 2px;
  border: 1px solid rgba(196, 165, 116, 0.35);
  box-shadow: 0 10px 30px rgba(44, 38, 32, 0.1);
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

.required-asterisk {
  color: #b3261e;
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

.form-error {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #8b3a3a;
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
