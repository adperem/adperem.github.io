#!/usr/bin/env bash
# Generate WebP (and optionally AVIF) siblings next to every PNG/JPG in
# assets/img/. Idempotent: skips outputs that are newer than their source.
#
# Usage:
#   tools/optimize-images.sh            # PNG/JPG -> WebP only
#   tools/optimize-images.sh --avif     # also generate AVIF
#   tools/optimize-images.sh --force    # regenerate even if up to date
#
# Requirements:
#   - cwebp     (apt install webp)
#   - avifenc   (apt install libavif-bin) — only with --avif

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$ROOT/assets/img"
WEBP_QUALITY=82
AVIF_QUALITY=55     # avifenc Q is ~50-65 for visually lossless

DO_AVIF=0
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --avif)  DO_AVIF=1 ;;
    --force) FORCE=1 ;;
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

command -v cwebp >/dev/null 2>&1 || { echo "cwebp missing. apt install webp"; exit 1; }
if [[ $DO_AVIF -eq 1 ]]; then
  command -v avifenc >/dev/null 2>&1 || { echo "avifenc missing. apt install libavif-bin"; exit 1; }
fi

needs_rebuild() {
  local src="$1" dst="$2"
  [[ $FORCE -eq 1 ]] && return 0
  [[ ! -f "$dst" ]] && return 0
  [[ "$src" -nt "$dst" ]] && return 0
  return 1
}

count_done=0
count_skip=0

while IFS= read -r -d '' src; do
  base="${src%.*}"
  webp_dst="${base}.webp"
  if needs_rebuild "$src" "$webp_dst"; then
    cwebp -q "$WEBP_QUALITY" -quiet "$src" -o "$webp_dst"
    count_done=$((count_done + 1))
    echo "webp $src"
  else
    count_skip=$((count_skip + 1))
  fi
  if [[ $DO_AVIF -eq 1 ]]; then
    avif_dst="${base}.avif"
    if needs_rebuild "$src" "$avif_dst"; then
      avifenc --min 0 --max 63 -a end-usage=q -a "cq-level=$AVIF_QUALITY" "$src" "$avif_dst" >/dev/null
      count_done=$((count_done + 1))
      echo "avif $src"
    else
      count_skip=$((count_skip + 1))
    fi
  fi
done < <(find "$IMG_DIR" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

echo "Done. Generated $count_done file(s), skipped $count_skip up-to-date."
