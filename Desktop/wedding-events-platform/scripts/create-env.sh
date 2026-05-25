#!/usr/bin/env bash
set -euo pipefail
cat > apps/web/.env.local <<ENV
NEXT_PUBLIC_API_URL=http://localhost:3000
ENV
cat > apps/api/.env <<ENV
WEDDING_EVENTS_TABLE=WeddingEvents
ENV
