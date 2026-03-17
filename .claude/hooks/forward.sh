#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/a965adec-f11a-4d36-baca-6be4f5a44dae/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer f502fe714a8b4f6f0c24b7e076b7d8973a9e6dd8e8bbe3075dfbfff051f4d319" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0