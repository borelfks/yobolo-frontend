// Vérifie que chaque locales/en.json a exactement les mêmes clés que son
// locales/fr.json (le français fait foi). Usage : npm run i18n:check
import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve(import.meta.dirname, '../src')

const dossiers = []
const parcourir = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (!e.isDirectory()) continue
    if (e.name === 'locales') dossiers.push(p)
    else parcourir(p)
  }
}
parcourir(src)

const aplatir = (obj, prefixe = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? aplatir(v, `${prefixe}${k}.`) : [`${prefixe}${k}`]))

let problemes = 0
for (const dossier of dossiers) {
  const nom = path.relative(src, dossier).replaceAll('\\', '/')
  const fr = path.join(dossier, 'fr.json')
  const en = path.join(dossier, 'en.json')
  if (!fs.existsSync(fr) || !fs.existsSync(en)) {
    console.error(`✗ ${nom} : il faut fr.json et en.json`)
    problemes++
    continue
  }
  const base = new Set(aplatir(JSON.parse(fs.readFileSync(fr, 'utf8'))))
  const cles = new Set(aplatir(JSON.parse(fs.readFileSync(en, 'utf8'))))
  for (const k of base) {
    if (cles.has(k)) continue
    console.error(`✗ ${nom}/en.json : clé manquante « ${k} »`)
    problemes++
  }
  for (const k of cles) {
    if (base.has(k)) continue
    console.error(`✗ ${nom}/en.json : clé en trop « ${k} »`)
    problemes++
  }
}

if (problemes) {
  console.error(`\n${problemes} problème(s) de traduction.`)
  process.exit(1)
}
console.log(`✓ Traductions complètes : ${dossiers.length} dossiers locales/, mêmes clés en fr et en`)
