<p align="center">
  <img src="assets/branding/dsh-banner.png" alt="DSH Codex UI" width="100%">
</p>

<div align="center">

  # DSH Codex UI

  **Organize projects, find conversations, and revisit long chats more easily in DSH Web**

  [简体中文](README.zh-CN.md) · [Changelog](CHANGELOG.md) · [Apache-2.0](LICENSE)

  [![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-codex-ui.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-codex-ui)
  [![npm downloads](https://img.shields.io/npm/dt/%40michengai%2Fdsh-codex-ui.svg?label=npm%20downloads&v=2)](https://www.npmjs.com/package/@michengai/dsh-codex-ui)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-codex-ui)
  [![Node.js 22 or later](https://img.shields.io/badge/Node.js-22%20or%20later-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

> DSH Codex UI is a community-maintained interface plugin for DeepSeek Harness (DSH), not an official DeepSeek AI product.

Working across several projects and conversations in DSH Web? DSH Codex UI helps you organize the sidebar, find tasks quickly, and jump back to earlier questions in long chats. It offers a Codex-style interface with light and dark themes.

## Host compatibility

This working tree declares DSH `0.1.5-rc.1`, `0.1.5-rc.2`, `0.1.6-alpha.1`, and `0.1.6-alpha.2`. Development dependencies are pinned to `0.1.6-alpha.2`. `@deepseek-ai/dsh-client-runtime` has no 0.1.6 release, so it stays on its highest published version, `0.1.1-rc.2`. Isolated host checks cover rc.1, rc.2, alpha.1, and alpha.2.

## What you can do

- **Organize projects and conversations**: expand or collapse projects, drag to reorder, pin frequently used projects, and see unread and running indicators.
- **Find things quickly**: search for conversations, settings, and quick actions from the header.
- **Manage everyday tasks**: rename, archive, or fork conversations, and open project folders from their menus.
- **Revisit long chats**: select a turn marker to jump directly to the corresponding question.
- **Reuse earlier input**: press Up/Down in an empty composer to recall text submitted in the current workspace.
- **Add features as needed**: check companion plugins in **Settings → About** and install or update the ones you need.

## Screenshots

Light theme: workspace tree, new conversation suggestions, and bottom composer.

![Light theme new conversation](assets/screenshots/conversation-light.png)

Dark theme: scheduled task overview and new conversation page.

![Dark theme new conversation](assets/screenshots/conversation.png)

General settings: dedicated settings page with section navigation in the light theme.

![Light theme general settings](assets/screenshots/settings-general-light.png)

Conversation menu: rename, pin, unread, archive, fork, copy, and delete.

![Conversation menu](assets/screenshots/session-menu.png)

**Settings → About** lists the companion plugins and their install state.

![About page and companion plugins](assets/screenshots/settings-about.png)

## Prerequisites

- A working DeepSeek Harness Web installation with `dsh` available in PowerShell.
- Examples use the `web` profile; replace it with the target profile.
- Node.js must satisfy `^22.19.0 || >=24.0.0`. Installing from source also requires pnpm.

## DSH product ecosystem

For a desktop workbench, download [DSH Codex Desktop](https://github.com/MichengAI/dsh-codex-desktop/releases). Existing [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) installations can add plugins as needed by following each project's README. Below are 11 first-party plugins; consult the corresponding desktop release notes and bundled catalog for what that version includes.

| Plugin | What you can do |
| --- | --- |
| [Codex UI](https://github.com/MichengAI/dsh-codex-ui) | Organize projects and conversations, search tasks, and navigate chat turns |
| [Agency Agents](https://github.com/MichengAI/dsh-agency-agents) | Choose and summon specialists for your task |
| [Skills Manager](https://github.com/MichengAI/dsh-skills-manager) | Find, enable, create, and import local skills |
| [Archive Manager](https://github.com/MichengAI/dsh-archive-manager) | Search, restore, or clean up archived conversations |
| [IM Connect](https://github.com/MichengAI/dsh-im-connect) | Send tasks and receive replies through messaging platforms |
| [Automation](https://github.com/MichengAI/dsh-automation) | Schedule tasks and review each run |
| [BTW](https://github.com/MichengAI/dsh-btw) | Ask side questions without interrupting the main task |
| [Simplify](https://github.com/MichengAI/dsh-simplify) | Use `/simplify` to improve code within your Git changes |
| [PUA](https://github.com/MichengAI/dsh-pua) | Guide the Agent to try new approaches after failures, investigate causes, and verify results before completion |
| [Code Review](https://github.com/MichengAI/dsh-code-review) | Use `/review` to request an independent Agent code review and receive the report in the current conversation |
| [Codex Pet](https://github.com/MichengAI/dsh-codex-pet) | View conversation notifications and respond to tool approvals and questions through a desktop pet |

## Installation

Choose agent-assisted or manual installation below. Both use the same command, requesting the latest version from the official npm registry.

### Ask an agent to install it (recommended)

Send the prompt below to any agent that can run terminal commands on your computer. Replace `web` with your actual profile. Once installed, use the plugin in DSH.

```text
Install the DSH plugin @michengai/dsh-codex-ui into my local web profile by running: dsh plugin --profile web add @michengai/dsh-codex-ui@latest --registry=https://registry.npmjs.org/. Then run dsh --profile web --dump-config, confirm the configuration includes codex-ui, and explain how to reload DSH and start using the plugin.
```

### Install manually

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
dsh plugin --profile web add @michengai/dsh-codex-ui@latest --registry=https://registry.npmjs.org/
dsh --profile web --dump-config
```

Restart DSH Web and hard-refresh the browser (usually `Ctrl+Shift+R`). Once the new sidebar appears, you are ready to use it. Uninstalling the plugin restores the default sidebar.

## Usage

Open DSH Web. The left navigation is rendered by this plugin.

| Goal | Action |
| --- | --- |
| Start a conversation | Select **New task**, or use a workspace **+** / **New conversation** action. |
| Find a conversation or setting | Use the header search field and choose a session, Settings page, or quick action. |
| Collapse the sidebar | Use the header panel button. The expand control stays on the collapsed rail. |
| Pin a workspace | Drag it into **Pinned**, or use **Pin project** in the project menu. |
| Manage a conversation | Open the conversation menu to rename, pin, mark unread, archive, fork, copy, or delete. |
| Reuse input | Press Up/Down in an empty composer to recall text submitted in the current workspace. |
| Jump between turns | Use the turn marks on the left of the current conversation. |
| Inspect connectors | Open **Settings → Connectors**. Addresses, commands, and credentials are never shown. |
| Check companion plugins | Open **Settings → About** to install or update individual companion plugins. |

## FAQ

### Do pinned projects and unread markers persist?

Pinned projects are saved in your DSH configuration and survive restarts. Unread markers are stored only in the current browser and do not sync across browsers.

### Why is my earlier input missing?

Input history is stored in the current browser, separately for each workspace, with up to 200 entries per workspace. It records new input while the feature is active and does not import existing conversations. When browser storage is unavailable, history is kept temporarily in memory. The BTW plugin is not required.

### Does removing a project delete local files?

Removing a workspace registration does not delete its folder or conversation records. Permanent deletion of archived conversations is provided by the companion Archive Manager plugin.

### What if nothing changes after installation?

Check that the installation profile matches the one running DSH Web, then restart DSH Web and hard-refresh the browser. Run `dsh --profile web --dump-config` to check that `codex-ui` is mounted.

## Development and contributing

### Install from source

Use this for debugging or unpublished changes. The cloned directory becomes the plugin source path:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location D:\Repository\deepseek-harness-plugin
git clone https://github.com/MichengAI/dsh-codex-ui.git
Set-Location .\dsh-codex-ui
pnpm install --frozen-lockfile
pnpm build
dsh plugin --profile web add .
dsh --profile web --dump-config
```

Restart DSH Web and hard-refresh the browser. Do not copy `lib` manually; local installation reads both package metadata and `cordis.patch.yml`.

- [src\index.ts](src/index.ts): host entry and the non-sensitive Connectors directory endpoint.
- [src\client\index.ts](src/client/index.ts): client entry for sidebar, workspace tree, turn navigation, and Settings sections.
- [src\client\CodexSidebar.tsx](src/client/CodexSidebar.tsx): sidebar shell, search panel, and visual styles.
- [src\client\CodexWorkspaceBrowser.tsx](src/client/CodexWorkspaceBrowser.tsx): workspace and conversation interactions.
- `tests\*.assert.ts` and `tests\*.spec.ts`: interaction, visual, and runtime integration checks.

After changing `src`, rebuild, test, and install from the local directory:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
pnpm build
pnpm test
dsh plugin --profile web add .
```

New features should reuse existing DSH slots and public services. Do not depend on private host DOM or write conversation records.

## Fork change: @linxin666/dsh-ssh embedded in Settings → Connectors

This repository is a personal fork of MichengAI/dsh-codex-ui. The one functional
change: the dsh-ssh operations panel (Hosts / Terminal / Transfer / Tunnels /
Cluster) is embedded into the **Connectors** section of the settings page.

Why here: dsh-ssh mounts its panel through an injected native-sidebar row plus a
center-column takeover. This plugin replaces the sidebar and settings shell, so
that entry never renders; the Connectors page is self-drawn and exposes no slot,
so the fix belongs in this repo.

How it works:

- New [src/client/SshConnectorPanel.tsx](src/client/SshConnectorPanel.tsx) imports the tab
  components from `@linxin666/dsh-ssh/src/client/panel/*` (the package publishes sources
  under `./src/*`), composed over a shared `SshApi` singleton; styles reuse dsh-ssh's CSS
  module and copy follows its built-in dictionaries.
- [src/client/ConnectorsSection.tsx](src/client/ConnectorsSection.tsx) renders
  `<SshConnectorPanel />` after the MCP market / native connector list.
- [tsdown.config.ts](tsdown.config.ts) force-bundles `@linxin666/dsh-ssh` and `@xterm/*`
  (`alwaysBundle` needs regexes for their subpath imports; the browser module table has
  neither).
- [scripts/inline-ssh-css.mjs](scripts/inline-ssh-css.mjs) folds the CSS-module output back
  into `client.js` after the build: tsdown's `css.inject` only emits a relative
  `import './style.css'`, which the single-file plugin loader cannot serve.
- The dsh-ssh host half (`/api/dsh-ssh`, connection pool, agent tools) still comes from the
  installed `@linxin666/dsh-ssh` plugin; this fork embeds UI only.

### Deploying locally (profiles with the minimumReleaseAge supply-chain policy)

Install the fork once through a `link:` dependency, so every later profile `pnpm install` (including
dshmarket upgrades) keeps serving this build instead of silently restoring the published one:

```powershell
# one-time: clear the profile's release-age gate for the entries its lockfile already holds
#   (pnpm names them in ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION) by adding
#   '<name>@<version>' lines to minimumReleaseAgeExclude in
#   ~/.dsh/profiles/web/pnpm-workspace.yaml
dsh plugin --profile web add link:D:\tmp\dsh-codex-ui
```

After that, a rebuild is all it takes — dsh-client-hmr stat-polls the mounted bundle every 500ms and
re-hashes it, so no copy and no host restart are needed:

```powershell
pnpm build          # then hard-refresh the browser (Ctrl+Shift+R)
```

`node scripts/deploy-profile.mjs` (`pnpm deploy:profile`) mirrors the dist in place as a fallback for
when a link install is not possible; it does not survive the next profile install.

## License

This project is licensed under [Apache License 2.0](LICENSE).
