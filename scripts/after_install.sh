#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/Aaikyam-Express-APP/deploy.log

echo 'cd /home/ec2-user/nodejs-server-cicd' >> /home/ec2-user/Aaikyam-Express-APP/deploy.log
cd /home/ec2-user/Aaikyam-Express-APP >> /home/ec2-user/Aaikyam-Express-APP/deploy.log

echo 'npm install' >> /home/ec2-user/Aaikyam-Express-APP/deploy.log 
npm install >> /home/ec2-user/Aaikyam-Express-APP/deploy.log
