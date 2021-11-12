echo "Creating Config..."
bin/create-config

echo "Initializing the deployment..."
echo "pwd →"
pwd
echo "config.production.json →"
cat "config.production.json"

echo "Connecting and Building Database..."
bin/wait-for-db

npm run migration
