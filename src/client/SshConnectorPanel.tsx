/**
 * SshConnectorPanel — embeds the dsh-ssh operations panel into the Codex UI
 * 设置 → 连接器 (Connectors) settings page.
 *
 * Background: @linxin666/dsh-ssh mounts its panel as a center-column takeover
 * triggered by a row injected into the *native* sidebar. This plugin replaces
 * the sidebar, so that entry never renders and the panel becomes unreachable.
 * Rather than resurrect the hidden takeover, we compose the very same tab
 * components from the published `@linxin666/dsh-ssh/src/*` surface (the
 * package ships its sources and re-exports them for exactly this) inside the
 * connectors page's own React tree. The panel source is bundled at build time
 * (tsdown `onlyBundle`/`alwaysBundle`), sharing the shell's single React
 * instance; the host half of dsh-ssh (the /api/dsh-ssh routes, engine, agent
 * tools) stays owned by the installed dsh-ssh plugin — we only embed UI.
 *
 * Deliberate deviations from dsh-ssh's own SshPanel:
 *   - no header/back button (the settings page itself is the back control);
 *   - a module-level SshApi singleton, so tab data and the terminal session
 *     survive navigating away from and back into settings;
 *   - fixed viewport-proportional height instead of the center-column fill.
 */
import { useState } from 'react'
import { SshApi } from '@linxin666/dsh-ssh/src/client/api.ts'
import { tt } from '@linxin666/dsh-ssh/src/client/panel/helpers.ts'
import { ClusterTab } from '@linxin666/dsh-ssh/src/client/panel/ClusterTab.tsx'
import { HostsTab } from '@linxin666/dsh-ssh/src/client/panel/HostsTab.tsx'
import { TerminalTab } from '@linxin666/dsh-ssh/src/client/panel/TerminalTab.tsx'
import { TransferTab } from '@linxin666/dsh-ssh/src/client/panel/TransferTab.tsx'
import { TunnelsTab } from '@linxin666/dsh-ssh/src/client/panel/TunnelsTab.tsx'
import sshCss from '@linxin666/dsh-ssh/src/client/panel/panel.module.css'

/** The panel's tab identifiers (mirrors dsh-ssh's SshTab). */
type SshTab = 'hosts' | 'terminal' | 'transfer' | 'tunnels' | 'cluster'

/** Tab bar definition; labels resolved through dsh-ssh's locale dictionaries. */
const TABS: ReadonlyArray<{ id: SshTab; label: () => string }> = [
  { id: 'hosts', label: () => tt('tab.hosts') },
  { id: 'terminal', label: () => tt('tab.terminal') },
  { id: 'transfer', label: () => tt('tab.transfer') },
  { id: 'tunnels', label: () => tt('tab.tunnels') },
  { id: 'cluster', label: () => tt('tab.cluster') },
]

/**
 * Shared API client. A plain fetch/WebSocket client against /api/dsh-ssh with
 * no per-instance state beyond connection registries, so one instance for the
 * whole page lifetime is safe and keeps terminal connections alive across
 * tab remounts.
 */
let sharedApi: SshApi | undefined
function getApi(): SshApi {
  if (sharedApi === undefined) sharedApi = new SshApi()
  return sharedApi
}

const stylesheet = `
.dcu-ssh-panel{margin-top:26px}.dcu-ssh-panel>.dcu-ssh-heading{display:flex;align-items:baseline;gap:8px;margin:0 0 4px}.dcu-ssh-panel>.dcu-ssh-heading>h2{margin:0;font-size:18px}.dcu-ssh-panel>.dcu-ssh-heading>span{color:var(--dsw-alias-label-tertiary);font-size:11px}.dcu-ssh-panel>p{margin:0 0 10px;color:var(--dsw-alias-label-secondary);font-size:12px}.dcu-ssh-frame{height:clamp(480px,calc(100vh - 240px),840px);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-base)}
`

/** A pending "connect this host" request handed to the terminal tab. */
interface ConnectRequest {
  alias: string
  nonce: number
}

/** The embedded SSH operations panel: five tabs over the dsh-ssh host API. */
export function SshConnectorPanel() {
  const [activeTab, setActiveTab] = useState<SshTab>('hosts')
  const [connectRequest, setConnectRequest] = useState<ConnectRequest | null>(null)
  const api = getApi()

  const handleConnect = (alias: string): void => {
    setActiveTab('terminal')
    setConnectRequest(prev => ({ alias, nonce: (prev?.nonce ?? 0) + 1 }))
  }

  return (
    <div className="dcu-ssh-panel" data-dsh-plugin="ssh">
      <style>{stylesheet}</style>
      <div className="dcu-ssh-heading">
        <h2>{tt('panel.title')}</h2>
        <span>{tt('entry.tooltip')}</span>
      </div>
      <p>@linxin666/dsh-ssh · /api/dsh-ssh</p>
      <div className="dcu-ssh-frame">
        {/* sshCss.panel is the plugin's own flex column shell; inside our
            fixed-height frame it lays out exactly like the takeover view. */}
        <div className={sshCss.panel}>
          <div className={sshCss.tabBar} role="tablist" data-dsh-part="tab-bar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                data-active={activeTab === tab.id ? '' : undefined}
                data-dsh-part="tab"
                className={sshCss.tab}
                onClick={() => { setActiveTab(tab.id) }}
              >
                {tab.label()}
              </button>
            ))}
          </div>
          <div className={sshCss.panelContent}>
            {activeTab === 'hosts' && <HostsTab api={api} onConnect={handleConnect} />}
            {activeTab === 'terminal' && <TerminalTab api={api} presetAlias={connectRequest?.alias} requestId={connectRequest?.nonce} />}
            {activeTab === 'transfer' && <TransferTab api={api} />}
            {activeTab === 'tunnels' && <TunnelsTab api={api} />}
            {activeTab === 'cluster' && <ClusterTab api={api} />}
          </div>
        </div>
      </div>
    </div>
  )
}
