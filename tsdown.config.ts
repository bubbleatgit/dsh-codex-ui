const packageId = '@michengai/dsh-codex-ui'
const buildMode = process.env.NODE_ENV ?? 'production'

export default [
  {
    entry: ['src/index.ts', 'src/session-title-plugin.ts'],
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2022',
    dts: true,
    clean: true,
  },
  {
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2022',
    // React 由 DSH 的客户端模块表提供；内联会生成第二份 React 实例，导致 Hooks 失效。
    // @linxin666/dsh-ssh 与 @xterm/* 不在模块表里，且面板源码以 .tsx/.css
    // 形式发布（./src/* 子路径），必须编译内联进本 bundle（见 SshConnectorPanel.tsx）。
    // alwaysBundle 按导入说明符精确匹配，子路径导入必须用正则覆盖。
    deps: {
      neverBundle: ['react', 'react-dom', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'],
      alwaysBundle: [
        'lucide-react',
        /@linxin666\/dsh-ssh/,
        /@xterm\/(xterm|addon-fit)/,
      ],
      onlyBundle: ['lucide-react', '@linxin666/dsh-ssh', '@xterm/xterm', '@xterm/addon-fit'],
    },
    // CJS 根入口会带入全部图标；固定到 ESM 入口以保留摇树优化。
    alias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.mjs',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(buildMode),
      'import.meta.env.MODE': JSON.stringify(buildMode),
      'import.meta.env': JSON.stringify({ MODE: buildMode }),
    },
    // dsh-ssh 的 CSS Module 内联进 client.js（运行时 <style> 注入），
    // 与 @linxin666/dsh-ssh 自身产物一致；浏览器加载器不会单独取 .css。
    css: {
      inject: true,
    },
    dts: false,
    clean: false,
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageId)}, factory: (require) => {`,
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
]
