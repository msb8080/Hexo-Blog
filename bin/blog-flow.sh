#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<USAGE
Usage: ./bin/blog-flow.sh <command>

Commands:
  check    Validate environment and run clean/build checks
  preview  Start local preview server
  release  Clean, build, and deploy
USAGE
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "[ERROR] Missing command: $1" >&2
    exit 1
  }
}

check_fs_permissions() {
  local issues=0

  if [[ -e "public" && ! -w "public" ]]; then
    echo "[ERROR] No write permission: public/"
    issues=1
  fi

  if [[ -e "db.json" && ! -w "db.json" ]]; then
    echo "[ERROR] No write permission: db.json"
    issues=1
  fi

  if [[ "$issues" -ne 0 ]]; then
    echo "[HINT] Fix ownership and retry:"
    echo "  sudo chown -R \$(whoami):staff public db.json docs source/_posts source/_drafts bin"
    exit 1
  fi
}

check_front_matter() {
  local latest_post
  latest_post=$(ls -t source/_posts/*.md 2>/dev/null | head -n 1 || true)
  if [[ -z "${latest_post}" ]]; then
    echo "[WARN] No posts found under source/_posts"
    return 0
  fi

  echo "[INFO] Checking front matter in latest post: ${latest_post}"
  rg -q '^title:' "$latest_post" || { echo "[ERROR] Missing title"; exit 1; }
  rg -q '^date:' "$latest_post" || { echo "[ERROR] Missing date"; exit 1; }
  rg -q '^updated:' "$latest_post" || { echo "[ERROR] Missing updated"; exit 1; }
  rg -q '^tags:' "$latest_post" || { echo "[ERROR] Missing tags"; exit 1; }
  rg -q '^categories:' "$latest_post" || { echo "[ERROR] Missing categories"; exit 1; }
}

run_check() {
  require_cmd npm
  require_cmd rg

  echo "[INFO] Running workflow checks"
  check_fs_permissions
  check_front_matter

  echo "[INFO] npm run clean"
  npm run clean

  echo "[INFO] npm run build"
  npm run build

  echo "[OK] Check completed"
}

run_preview() {
  require_cmd npm
  echo "[INFO] Starting local preview on http://localhost:4000"
  npm run server
}

run_release() {
  require_cmd npm

  echo "[INFO] Running clean/build/deploy"
  npm run clean
  npm run build
  npm run deploy
  echo "[OK] Release completed"
}


main() {
  if [[ $# -ne 1 ]]; then
    usage
    exit 1
  fi

  case "$1" in
    check)
      run_check
      ;;
    preview)
      run_preview
      ;;
    release)
      run_release
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
