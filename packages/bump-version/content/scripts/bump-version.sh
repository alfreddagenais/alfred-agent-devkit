#!/usr/bin/env bash
# Bump the app release version and sync local sources of truth.
#
# Usage:
#   ./scripts/bump-version.sh patch
#   ./scripts/bump-version.sh minor
#   ./scripts/bump-version.sh major          # only when the user explicitly asks
#   ./scripts/bump-version.sh set 1.4.0
#   ./scripts/bump-version.sh --dry-run patch
#
# Sync targets (when they exist):
#   - package.json "version"
#   - package-lock.json root / packages[""] "version" (npm)
#   - composer.json "version"
#   - composer.lock content-hash (Composer hashes the root "version")
#   - README.md heading ## Presets (vX.Y.Z)
#   - .env keys that already exist: APP_VERSION, NATIVEPHP_APP_VERSION
#   - .env.example commented copies of those keys when already present
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DRY_RUN=0
MODE=""
EXPLICIT=""

usage() {
  cat <<'EOF'
Usage: ./scripts/bump-version.sh [--dry-run] <patch|minor|major|set> [x.y.z]

  patch   1.3.2 -> 1.3.3
  minor   1.3.2 -> 1.4.0
  major   1.3.2 -> 2.0.0  (manual / explicit user request only)
  set     set exact version (requires x.y.z)

Syncs (when present): package.json, package-lock.json, composer.json,
                      composer.lock (content-hash), README Presets heading,
                      existing APP_VERSION / NATIVEPHP_APP_VERSION keys.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    patch|minor|major|set)
      MODE="$1"
      shift
      ;;
    *)
      if [[ -z "$EXPLICIT" && "$MODE" == "set" ]]; then
        EXPLICIT="$1"
        shift
      else
        echo "error: unexpected argument: $1" >&2
        usage >&2
        exit 1
      fi
      ;;
  esac
done

if [[ -z "$MODE" ]]; then
  usage >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is required to bump JSON versions" >&2
  exit 1
fi

is_semver() {
  [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]
}

read_json_version() {
  local file="$1"
  BUMP_FILE="$file" node -e '
    const fs = require("fs");
    const file = process.env.BUMP_FILE;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!data || typeof data.version !== "string") {
      console.error("error: missing string version in " + file);
      process.exit(1);
    }
    process.stdout.write(data.version);
  '
}

write_json_version() {
  local file="$1"
  local version="$2"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "dry-run: would set version=${version} in ${file}"
    return
  fi
  BUMP_FILE="$file" BUMP_VERSION="$version" node -e '
    const fs = require("fs");
    const file = process.env.BUMP_FILE;
    const version = process.env.BUMP_VERSION;
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data.version !== "string") {
      console.error("error: missing string version in " + file);
      process.exit(1);
    }
    if (data.version === version) process.exit(0);
    const updated = raw.replace(/("version"\s*:\s*")([^"]+)(")/, "$1" + version + "$3");
    if (updated === raw) {
      console.error("error: failed to replace version in " + file);
      process.exit(1);
    }
    JSON.parse(updated);
    fs.writeFileSync(file, updated);
  '
}

write_npm_lock_version() {
  local file="$1"
  local version="$2"
  if [[ ! -f "$file" ]]; then
    return
  fi
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "dry-run: would set version=${version} in ${file} (root + packages[\"\"])"
    return
  fi
  BUMP_FILE="$file" BUMP_VERSION="$version" node -e '
    const fs = require("fs");
    const file = process.env.BUMP_FILE;
    const version = process.env.BUMP_VERSION;
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    const cut = raw.indexOf("\"node_modules/\"");
    const head = cut === -1 ? raw : raw.slice(0, cut);
    const tail = cut === -1 ? "" : raw.slice(cut);
    const currentRoot = typeof data.version === "string" ? data.version : "";
    const currentEmpty = data.packages && data.packages[""] && typeof data.packages[""].version === "string"
      ? data.packages[""].version
      : "";
    if (currentRoot === version && currentEmpty === version) process.exit(0);
    let n = 0;
    const newHead = head.replace(/("version"\s*:\s*")([^"]+)(")/g, (m, a, _v, c) => {
      if (n >= 2) return m;
      n += 1;
      return a + version + c;
    });
    if (n < 1) {
      console.error("error: failed to replace version in " + file);
      process.exit(1);
    }
    const updated = newHead + tail;
    JSON.parse(updated);
    fs.writeFileSync(file, updated);
  '
}

replace_readme_presets() {
  local file="$1"
  local version="$2"
  if [[ ! -f "$file" ]]; then
    return 1
  fi
  if ! grep -qE '^## Presets \(v[0-9]+\.[0-9]+\.[0-9]+' "$file"; then
    return 1
  fi
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "dry-run: would set ## Presets (v${version}) in ${file}"
    return 0
  fi
  BUMP_FILE="$file" BUMP_VERSION="$version" node -e '
    const fs = require("fs");
    const file = process.env.BUMP_FILE;
    const version = process.env.BUMP_VERSION;
    const raw = fs.readFileSync(file, "utf8");
    const updated = raw.replace(
      /^(## Presets \(v)([0-9]+\.[0-9]+\.[0-9]+)(\))/m,
      "$1" + version + "$3"
    );
    if (updated === raw) {
      const already = new RegExp("^## Presets \\(v" + version.replace(/\./g, "\\.") + "\\)", "m");
      if (already.test(raw)) process.exit(0);
      console.error("error: failed to replace Presets heading in " + file);
      process.exit(1);
    }
    fs.writeFileSync(file, updated);
  '
  return 0
}

upsert_env_key_if_present() {
  local file="$1"
  local key="$2"
  local value="$3"
  local commented="${4:-0}"

  if [[ ! -f "$file" ]]; then
    return
  fi
  if ! grep -qE "^#?[[:space:]]*${key}=" "$file"; then
    return
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "dry-run: would upsert ${key}=${value} in ${file}"
    return
  fi

  BUMP_FILE="$file" BUMP_KEY="$key" BUMP_VALUE="$value" BUMP_COMMENTED="$commented" node -e '
    const fs = require("fs");
    const file = process.env.BUMP_FILE;
    const key = process.env.BUMP_KEY;
    const value = process.env.BUMP_VALUE;
    const commented = process.env.BUMP_COMMENTED === "1";
    const line = (commented ? "# " : "") + key + "=" + value;
    const pattern = new RegExp("^#?\\s*" + key + "=.*$", "m");
    let contents = fs.readFileSync(file, "utf8");
    if (!pattern.test(contents)) process.exit(0);
    contents = contents.replace(pattern, line);
    fs.writeFileSync(file, contents);
  '
}

refresh_composer_lock() {
  local lock="${ROOT}/composer.lock"

  if [[ ! -f "$lock" ]]; then
    return
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "dry-run: would refresh composer.lock content-hash (composer update --lock --no-scripts)"
    return
  fi

  if ! command -v composer >/dev/null 2>&1; then
    echo "error: composer is required to refresh composer.lock after changing composer.json version" >&2
    exit 1
  fi

  composer update --lock --no-scripts --no-interaction
  composer validate --no-check-publish --no-interaction
}

bump_semver() {
  local current="$1"
  local part="$2"
  local major minor patch

  if [[ ! "$current" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)(.*)$ ]]; then
    echo "error: current version is not semver-like: ${current}" >&2
    exit 1
  fi

  major="${BASH_REMATCH[1]}"
  minor="${BASH_REMATCH[2]}"
  patch="${BASH_REMATCH[3]}"

  case "$part" in
    patch)
      patch=$((patch + 1))
      ;;
    minor)
      minor=$((minor + 1))
      patch=0
      ;;
    major)
      major=$((major + 1))
      minor=0
      patch=0
      ;;
    *)
      echo "error: invalid bump part: ${part}" >&2
      exit 1
      ;;
  esac

  echo "${major}.${minor}.${patch}"
}

json_has_string_version() {
  local file="$1"
  [[ -f "$file" ]] || return 1
  BUMP_FILE="$file" node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(process.env.BUMP_FILE, "utf8"));
    process.exit(typeof data.version === "string" ? 0 : 1);
  '
}

COMPOSER_JSON="${ROOT}/composer.json"
PACKAGE_JSON="${ROOT}/package.json"
PACKAGE_LOCK="${ROOT}/package-lock.json"
README_FILE="${ROOT}/README.md"
ENV_FILE="${ROOT}/.env"
ENV_EXAMPLE="${ROOT}/.env.example"

if [[ ! -f "$PACKAGE_JSON" && ! -f "$COMPOSER_JSON" ]]; then
  echo "error: neither package.json nor composer.json found" >&2
  exit 1
fi

if json_has_string_version "$COMPOSER_JSON"; then
  CURRENT="$(read_json_version "$COMPOSER_JSON")"
  CANONICAL="composer.json"
else
  CURRENT="$(read_json_version "$PACKAGE_JSON")"
  CANONICAL="package.json"
fi

if [[ -f "$PACKAGE_JSON" ]] && json_has_string_version "$COMPOSER_JSON"; then
  PACKAGE_CURRENT="$(read_json_version "$PACKAGE_JSON")"
  if [[ "$CURRENT" != "$PACKAGE_CURRENT" ]]; then
    echo "warning: composer.json (${CURRENT}) and package.json (${PACKAGE_CURRENT}) differ; using ${CANONICAL} as source of truth." >&2
  fi
fi

case "$MODE" in
  set)
    if [[ -z "$EXPLICIT" ]]; then
      echo "error: set requires an explicit version (e.g. set 1.4.0)" >&2
      exit 1
    fi
    if ! is_semver "$EXPLICIT"; then
      echo "error: invalid version: ${EXPLICIT}" >&2
      exit 1
    fi
    NEW_VERSION="$EXPLICIT"
    ;;
  patch|minor|major)
    NEW_VERSION="$(bump_semver "$CURRENT" "$MODE")"
    ;;
esac

echo "version: ${CURRENT} -> ${NEW_VERSION} (${MODE})"

if json_has_string_version "$COMPOSER_JSON"; then
  write_json_version "$COMPOSER_JSON" "$NEW_VERSION"
fi
if [[ -f "$PACKAGE_JSON" ]]; then
  write_json_version "$PACKAGE_JSON" "$NEW_VERSION"
fi
write_npm_lock_version "$PACKAGE_LOCK" "$NEW_VERSION"
refresh_composer_lock

README_SYNCED=0
if replace_readme_presets "$README_FILE" "$NEW_VERSION"; then
  README_SYNCED=1
fi

upsert_env_key_if_present "$ENV_FILE" "APP_VERSION" "$NEW_VERSION" 0
upsert_env_key_if_present "$ENV_FILE" "NATIVEPHP_APP_VERSION" "$NEW_VERSION" 0
upsert_env_key_if_present "$ENV_EXAMPLE" "APP_VERSION" "$NEW_VERSION" 1
upsert_env_key_if_present "$ENV_EXAMPLE" "NATIVEPHP_APP_VERSION" "$NEW_VERSION" 1

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "dry-run complete (no files written)."
  exit 0
fi

echo "synced:"
if [[ -f "$COMPOSER_JSON" ]]; then
  echo "  - composer.json"
fi
if [[ -f "${ROOT}/composer.lock" ]]; then
  echo "  - composer.lock (content-hash)"
fi
if [[ -f "$PACKAGE_JSON" ]]; then
  echo "  - package.json"
fi
if [[ -f "$PACKAGE_LOCK" ]]; then
  echo "  - package-lock.json"
fi
if [[ "$README_SYNCED" -eq 1 ]]; then
  echo "  - README.md (Presets heading)"
fi
if [[ -f "$ENV_FILE" ]] && grep -qE '^#?[[:space:]]*(APP_VERSION|NATIVEPHP_APP_VERSION)=' "$ENV_FILE"; then
  echo "  - .env (existing APP_VERSION / NATIVEPHP_APP_VERSION)"
fi
if [[ -f "$ENV_EXAMPLE" ]] && grep -qE '^#?[[:space:]]*(APP_VERSION|NATIVEPHP_APP_VERSION)=' "$ENV_EXAMPLE"; then
  echo "  - .env.example (existing APP_VERSION / NATIVEPHP_APP_VERSION)"
fi
echo "done: ${NEW_VERSION}"
