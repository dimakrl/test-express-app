#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/test-express-app

cd /home/ec2-user/test-express-app

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

npm install pm2 -g

npm install

# Use AWS Secrets service for setting env variables in prod;
file_location=./.env
cat >$file_location <<EOF
ENDPOINT="*"
USER_NAME=postgres
DB_PORT=5432
PASSWORD=*
TABLE_SCHEMA_AUTOUPDATE=true
DEVELOPMENT=false
PORT=3000
DATABASE_NAME=images
REGION="*"
BUCKET_NAME=dmoneone.simple.images
SLL=true
EOF

npm run build