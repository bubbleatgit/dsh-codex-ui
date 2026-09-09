/**
 * Deploy the built package into the local DSH `web` profile in place.
 *
 * Why in-place: the profile applies pnpm's minimumReleaseAge supply-chain
 * policy, so `pnpm add link:./` refuses (the lockfile legitimately contains
 * packages younger than the cutoff). Copying the dist over
 * node_modules/@michengai/dsh-codex-ui is the compatible path:
 * dsh-client-hmr stat-polls every served bundle (500ms) and re-hashes changed
 * files into the module graph, so no host restart is needed — a page refresh
 * picks up the new revision.
 *
 * Caveat: any later `pnpm install` in the profile (dshmarket updates included)
 * restores the published @michengai/dsh-codex-ui. Re-run `pnpm run deploy`
 * afterwards.
 *
 * Usage: node scripts/deploy-profile.mjs [--profile-dir <path>]
 */
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function arg(name) {
  const i = process.argv.indexOf(name)
  return i === -1 ? undefined : process.argv[i + 1]
}

const profileDir = arg('--profile-dir')
  ?? path.join(os.homedir(), '.dsh', 'profiles', 'web')
const target = path.join(profileDir, 'node_modules', '@michengai', 'dsh-codex-ui')
if (!existsSync(path.join(profileDir, 'package.json'))) {
  console.error(`[deploy] not a DSH profile: ${profileDir}`)
  process.exit(1)
}
if (!existsSync(path.join(root, 'lib', 'client.js'))) {
  console.error('[deploy] lib/client.js missing — run "pnpm run build" first.')
  process.exit(1)
}

// Assemble exactly the package.json "files" surface into a temp stage.
const stage = mkdtempSync(path.join(os.tmpdir(), 'dsh-codex-ui-deploy-'))
try {
  for (const entry of ['lib', 'assets']) {
    cpSync(path.join(root, entry), path.join(stage, entry), { recursive: true })
  }
  for (const file of [
    'package.json',
    'cordis.patch.yml',
    'LICENSE',
    'README.md',
    'README.zh-CN.md',
    'CHANGELOG.md',
    'CHANGELOG.zh-CN.md',
  ]) {
    const from = path.join(root, file)
    if (existsSync(from)) cpSync(from, path.join(stage, file))
  }
  // robocopy /MIR keeps the target an exact mirror (removes stale files).
  const res = spawnSync('robocopy', [stage, target, '/MIR', '/NFL', '/NDL', '/NJH', '/NJS'], {
    encoding: 'utf8',
    shell: false,
  })
  // robocopy exit codes 0-7 are success; >=8 is failure.
  if (res.status >= 8) {
    console.error(`[deploy] robocopy failed with ${res.status}:\n${res.stdout}\n${res.stderr}`)
    process.exit(1)
  }
  console.log(`[deploy] mirrored dist into ${target}`)
  console.log('[deploy] dsh-client-hmr re-hashes within ~1s; refresh the browser tab to load it.')
} finally {
  rmSync(stage, { recursive: true, force: true })
}
