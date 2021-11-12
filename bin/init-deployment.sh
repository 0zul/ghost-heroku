echo "Creating Config..."
node bin/create-config

echo "Initializing the deployment…"
echo "pwd →"
pwd
echo "config.production.json →"
cat "config.production.json"

node bin/wait-for-db

npm run migration
