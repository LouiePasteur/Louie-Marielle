// Builds the self-contained invitation.html from template.html + base64 assets,
// then emits one standalone page file per sheet for PNG export.
//
//   node build.mjs            -> invitation.html + sheet-*.html
//
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const asset = (name) => readFileSync(join(here, 'assets', `${name}.b64`), 'utf8').trim()

let html = readFileSync(join(here, 'template.html'), 'utf8')
  .replace('__GV__', asset('gv'))
  .replace('__CGREG__', asset('cg-reg'))
  .replace('__CGITAL__', asset('cg-ital'))
  .replace('__COUPLE__', asset('couple'))
  .replace('__VENUE__', asset('venue'))
  .replace('__QR__', asset('qr'))

if (/__[A-Z]+__/.test(html)) throw new Error('Unreplaced asset token in template.html')

writeFileSync(join(here, 'invitation.html'), html)

// Per-sheet pages for image export. No body width: `box-sizing: border-box`
// would make it include the padding and push the whole sheet off-centre.
const backdrop =
  'radial-gradient(120% 80% at 50% -10%, rgba(125,148,113,0.35), transparent 60%),' +
  'linear-gradient(175deg,#8a9d7c 0%,#6f8263 45%,#5c6e51 100%)'

const style = html.match(/<style>[\s\S]*?<\/style>/)[0]
const sheets = [...html.matchAll(/<section class="sheet"[\s\S]*?<\/section>/g)].map((m) => m[0])
const names = ['front', 'details', 'entourage']

sheets.forEach((sheet, i) => {
  writeFileSync(
    join(here, `sheet-${names[i]}.html`),
    `<!doctype html><html><head><meta charset="utf-8">${style}<style>` +
      `html{background:#6f8263}body{margin:0;padding:44px;background:${backdrop}}` +
      `.sheet{opacity:1!important;transform:none!important;animation:none!important;margin:0!important}` +
      `</style><script>addEventListener("load",function(){` +
      `document.documentElement.setAttribute("data-h",document.body.scrollHeight)})<\/script>` +
      `</head><body>${sheet}</body></html>`,
  )
})

console.log(`invitation.html (${Math.round(html.length / 1024)} KB) + ${sheets.length} sheet pages`)
