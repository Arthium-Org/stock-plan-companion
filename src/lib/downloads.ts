// Single source of truth for the download links shown on the marketing site.
//
// Release-process invariant (D-04): every GitHub Release published to
// `appRepo` MUST attach the macOS DMG under the stable, version-less name
// below (`macAssetName`). GitHub's "latest release" URL only resolves to a
// fixed filename — if a release ships the asset under a versioned name
// instead (e.g. `StockPlanCompanion-1.2.0-arm64.dmg`), this link breaks for
// every visitor until the next release corrects it. Do not pin a version tag
// here; that reintroduces the "edit code every release" anti-pattern this
// module exists to remove.
//
// macDownloadUrl resolves to:
// https://github.com/Arthium-Org/stock-plan-companion-app/releases/latest/download/StockPlanCompanion-arm64.dmg

export const appRepo = 'Arthium-Org/stock-plan-companion-app';
export const macAssetName = 'StockPlanCompanion-arm64.dmg';
export const winAssetName = 'StockPlan-Setup.exe';

export const macDownloadUrl = `https://github.com/${appRepo}/releases/latest/download/${macAssetName}`;
export const winDownloadUrl = `https://github.com/${appRepo}/releases/latest/download/${winAssetName}`;

// Shared base URL for all "view source on GitHub" links on the marketing
// site (nav icon, footer link). Composed from appRepo so a future repo
// rename only requires editing that one constant.
export const repoUrl = `https://github.com/${appRepo}`;

export const windowsAvailable = true;
