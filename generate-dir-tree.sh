#!/usr/bin/env bash
set -euo pipefail

OUT="project-tree.txt"

# 1. TREE GENERATION
# ---------------------------------------------------------
echo "Generating project tree..."

generate() {
  local dir="$1"
  local prefix="$2"
  
  # Read files into an array safely
  local items=()
  while IFS= read -r -d $'\0' entry; do
    items+=( "$entry" )
  done < <(find "$dir" -maxdepth 1 -mindepth 1 -print0 | sort -z)

  local total=${#items[@]}
  local i=0
  
  for e in "${items[@]}"; do
    i=$((i+1))
    local name
    name="$(basename "$e")"
    local isdir=0
    [ -d "$e" ] && isdir=1
    
    # Determine connector style
    local connector="├── "
    local newprefix="${prefix}│   "
    if [ "$i" -eq "$total" ]; then
      connector="└── "
      newprefix="${prefix}    "
    fi

    # Print current item
    printf "%s%s%s%s\n" "$prefix" "$connector" "$name" "$( [ $isdir -eq 1 ] && printf "/" )"

    # Recursion logic
    if [ $isdir -eq 1 ]; then
      # IGNORE LIST: Added .next, .vscode, node_modules, etc.
      if [[ "$name" =~ ^(.git|.idea|.next|.vscode|node_modules|build|dist|.DS_Store)$ ]]; then
        continue
      fi
      # Do not recurse into the output file itself if it appears nicely in the list
      if [ "$name" == "$OUT" ]; then
        continue
      fi
      
      generate "$e" "$newprefix"
    fi
  done
}

# Write header and run tree generation
{
  echo "./"
  generate "." ""
} > "$OUT"

echo "Wrote tree to $OUT"


# 2. RUN GENERATE-CONTEXT SCRIPTS
# ---------------------------------------------------------
echo "Searching for context generation scripts in project root..."

# Find 'generate-context.sh' files starting from root (.)
# We use -prune to completely skip searching inside node_modules, .next, and .git
find . -type d \( -name "node_modules" -o -name ".next" -o -name ".git" \) -prune -o -type f -name "generate-context.sh" -print0 | while IFS= read -r -d $'\0' script_path; do

    script_dir=$(dirname "$script_path")
    script_name=$(basename "$script_path")

    echo ""
    echo "Found script: $script_path"
    echo "--------------------------------------------------"

    # Execute in a subshell
    (
        cd "$script_dir" || exit
        echo "Running $script_name in $(pwd)..."

        # Ensure it is executable
        chmod +x "$script_name" 2>/dev/null || true

        # Run using bash explicitly
        bash "$script_name"
    )
    echo "--------------------------------------------------"
done

echo "All operations completed."