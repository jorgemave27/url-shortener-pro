#!/usr/bin/env bash
set -euo pipefail
cd apps/api
npm install
npm run build
mkdir -p build
cd dist
zip -r ../build/api.zip .
