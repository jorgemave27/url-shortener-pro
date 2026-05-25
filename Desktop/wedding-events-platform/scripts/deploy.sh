#!/usr/bin/env bash
set -euo pipefail
./scripts/package-api.sh
cd infra/terraform/envs/${1:-dev}
terraform init
terraform apply
