#!/usr/bin/env bash
# setup-dev.sh
# Unix/macOS — one-time local development setup
set -e

echo "=== Wereda Social Welfare System — Dev Setup ==="

# 1. Copy .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ .env created from .env.example — update passwords before use"
else
  echo "  .env already exists, skipping"
fi

# 2. Install root dependencies
echo -e "\nInstalling root dependencies..."
npm install

# 3. Install server dependencies
echo -e "\nInstalling server dependencies..."
cd server && npm install && cd ..

# 4. Install client dependencies
echo -e "\nInstalling client dependencies..."
cd client && npm install && cd ..

# 5. Start PostgreSQL via Docker
echo -e "\nStarting PostgreSQL container..."
docker-compose up -d db

echo "Waiting for PostgreSQL to be ready..."
sleep 5

# 6. Run migrations
echo -e "\nRunning database migrations..."
cd server
npm run db:migrate

# 7. Run seeds
echo -e "\nSeeding database..."
npm run db:seed
cd ..

echo -e "\n=== Setup complete! ==="
echo "Start the API:    cd server && npm run dev"
echo "Start the client: cd client && npm run dev"
echo ""
echo "Default login credentials (change immediately):"
echo "  Super Admin:  super_admin  / SuperAdmin@123"
echo "  Kebele Admin: kebele_admin / KebeleAdmin@123"
echo "  Facilitator:  facilitator  / Facilitator@123"
