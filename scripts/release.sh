#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] node not found in PATH"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm not found in PATH"
  exit 1
fi

if [[ ! -f .nvmrc ]]; then
  echo "[ERROR] .nvmrc not found"
  exit 1
fi

REQUIRED_NODE_MAJOR="$(tr -d '[:space:]' < .nvmrc | cut -d'.' -f1)"
CURRENT_NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"

if [[ "$CURRENT_NODE_MAJOR" != "$REQUIRED_NODE_MAJOR" ]]; then
  echo "[ERROR] Node major version mismatch: required ${REQUIRED_NODE_MAJOR}.x, current $(node -v)"
  exit 1
fi

if [[ -d themes/fluid ]]; then
  echo "[ERROR] themes/fluid exists. Theme must be resolved from npm dependency hexo-theme-fluid."
  exit 1
fi

if ! grep -q "git@github.com:msb8080/msb8080.github.io.git" _config.yml; then
  echo "[ERROR] deploy repository is not SSH target git@github.com:msb8080/msb8080.github.io.git"
  exit 1
fi

echo "[INFO] Environment check passed"

echo "[INFO] Install dependencies (npm ci)"
npm ci

echo "[INFO] Build site"
npm run clean
npm run build

echo "[INFO] Deploy site"
npm run deploy

echo "[INFO] Release completed"
