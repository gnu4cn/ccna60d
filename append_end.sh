#!/usr/bin/env bash
PWD="$(pwd)"
for f in $(find "src/" -type f -name "*.md" ); do
    if [[ "${f}" == *"SUMMARY"* ]] || [[ "${f}" == *"README"* ]]; then continue; fi
    echo -e "\n\n（End）\n\n" >> "$PWD/$f"
done
