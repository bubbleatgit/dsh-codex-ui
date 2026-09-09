/**
 * Ambient CSS-module declaration for the dsh-ssh sources bundled into this
 * client bundle (see SshConnectorPanel.tsx). dsh-ssh's panel components
 * import './panel.module.css' relatively; their own shim
 * (src/client/css-modules.d.ts) lives inside node_modules and is not part of
 * this program, so the wildcard mirror lives here. tsdown compiles the CSS
 * module and exports its hashed class map at runtime.
 */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
