/**
 * Post-build: fold the emitted lib/style.css (the dsh-ssh panel CSS module,
 * see src/client/SshConnectorPanel.tsx) back into lib/client.js.
 *
 * tsdown's `css.inject` keeps an ESM `import './style.css'` statement at the
 * top of the client bundle. That shape is meant for library consumers with a
 * bundler; the DSH browser plugin loader serves exactly one self-contained
 * script at /plugins/<id>/client.js, where a relative CSS import resolves to
 * a URL that is never deployed (and would abort the whole module load).
 * This script therefore:
 *   1. drops the leading `import './style.css';` statement,
 *   2. injects the CSS text into the module factory as a run-once
 *      `<style data-dsh-ssh-panel-css>` append (same pattern dsh-ssh's own
 *      bundle uses for its takeover view), and
 *   3. deletes the now-unreferenced style.css.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const libDir = path.resolve('lib')
const clientPath = path.join(libDir, 'client.js')
const cssPath = path.join(libDir, 'style.css')

if (!existsSync(clientPath)) {
  console.error('[inline-ssh-css] lib/client.js missing — run tsdown first.')
  process.exit(1)
}
if (!existsSync(cssPath)) {
  // Upstream build without the ssh panel (css never emitted): nothing to fold.
  console.log('[inline-ssh-css] lib/style.css not present, nothing to do.')
  process.exit(0)
}

const css = readFileSync(cssPath, 'utf8')
let js = readFileSync(clientPath, 'utf8')

const importLine = /^import\s+['"]\.\/style\.css['"];\r?\n/
if (!importLine.test(js)) {
  console.error('[inline-ssh-css] leading style.css import not found — check the tsdown css config.')
  process.exit(1)
}
js = js.replace(importLine, '')

// The factory intro emitted by tsdown.config.ts outputOptions.intro (the
// formatter splits it across two lines; anchor on the first).
const marker = 'var module = { exports: {} };'
if (!js.includes(marker)) {
  console.error('[inline-ssh-css] factory intro marker not found — output shape changed.')
  process.exit(1)
}

const guard = 'typeof document !== "undefined" && document.querySelector("style[data-dsh-ssh-panel-css]") === null'
const injection = [
  marker,
  `if (${guard}) {`,
  '\tvar __dshSshPanelStyle = document.createElement("style");',
  '\t__dshSshPanelStyle.dataset.dshSshPanelCss = "";',
  `\t__dshSshPanelStyle.textContent = ${JSON.stringify(css)};`,
  '\tdocument.head.appendChild(__dshSshPanelStyle);',
  '}',
].join('\n')

js = js.replace(marker, injection)
writeFileSync(clientPath, js)
rmSync(cssPath)
console.log(`[inline-ssh-css] folded ${css.length} bytes of CSS into client.js and removed style.css`)
