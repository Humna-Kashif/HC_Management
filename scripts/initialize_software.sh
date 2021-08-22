#-------------------------------------------------------------------------------
# Script for initializing server for Aibers Health Development
#-------------------------------------------------------------------------------
#!/bin/bash

AIBERS=$PWD
IP=$(/usr/sbin/ifconfig | /usr/bin/sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')

function postgres() {
    PSQL=$(/usr/bin/which psql)

    # Install
    /usr/bin/echo 'Checking if PostgreSQL is installed...'
    if [ -z $PSQL ]; then
        /usr/bin/echo 'PostgreSQL not installed.'
        /usr/bin/echo 'Installing PostgreSQL...'
        /usr/bin/apt install -y postgresql postgresql-contrib -y >/dev/null 2>&1
        /usr/bin/echo 'PostgreSQL installed'

    else
        /usr/bin/echo 'PostgreSQL already installed.'
    fi

    /usr/bin/echo

}

function node() {

    NODE=$(/usr/bin/which node)
    PM2=$(/usr/bin/which pm2)

    /usr/bin/echo 'Checking if Node.js is installed...'
    if [ -z $NODE ]; then
        # Install Node.js
        /usr/bin/echo 'Node.js not installed.'
        /usr/bin/echo 'Installing Node.js...'
        /usr/bin/curl -sL https://deb.nodesource.com/setup_15.x | -E bash - >/dev/null 2>&1
        /usr/bin/apt-get install -y nodejs >/dev/null 2>&1
        /usr/bin/echo 'Node.js installed'

    else
        /usr/bin/echo 'Node.js already installed'
    fi

    /usr/bin/echo 'Installing node modules and building...'
    cd /home/aibers/
    /usr/bin/npm install >/dev/null 2>&1
    cd $AIBERS/frontend
    /usr/bin/npm install >/dev/null 2>&1
    /usr/bin/npm rebuild node-sass >/dev/null 2>&1
    /usr/bin/npm run build >/dev/null 2>&1
    cd $AIBERS/scripts
    /usr/bin/echo 'Node modules installed'

    /usr/bin/echo 'Starting Node.js server...'
    /usr/bin/nohup /usr/bin/node /home/aibers/src/index.js >/dev/null 2>&1 &
    /usr/bin/echo 'Node.js server started'

    /usr/bin/echo

}

function nginx() {
    NGINX=$(/usr/bin/which nginx)
    CONFIG_FILE="/etc/nginx/sites-available/app.aibers.health"

    /usr/bin/echo 'Checking if NGINX is installed...'
    if [ -z $NGINX ]; then
        # Install NGINX
        /usr/bin/echo 'NGINX not installed.'
        /usr/bin/echo 'Installing NGINX...'
        /usr/bin/apt install nginx -y >/dev/null 2>&1
        /usr/bin/systemctl enable nginx >/dev/null 2>&1
        /usr/bin/echo 'NGINX installed'

    else
        /usr/bin/echo 'NGINX already installed'
    fi

    /usr/bin/echo 'Checking if NGINX is configured...'
    /usr/bin/find /etc/nginx/sites-available/app.aibers.health >/dev/null 2>&1

    if [ "$?" != 0 ]; then
        /usr/bin/echo 'NGINX not configured...'
        /usr/bin/echo 'Configuring NGINX...'
        /usr/bin/touch $CONFIG_FILE
        /usr/bin/cat <<-EOF >$CONFIG_FILE
server {

        root $AIBERS/frontend/build;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name app.aibers.health $IP;

        location / {
                try_files \$uri /index.html;
        }

        location /doctors {
                proxy_pass http://localhost:8090;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }

        location /patients {
                proxy_pass http://localhost:8090;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }

        location /aibersInfo {
                proxy_pass http://localhost:8090;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }

}

EOF
        # /usr/bin/cp $AIBERS/frontend/etc/nginx/app.aibers.health /etc/nginx/sites-available/
        /usr/bin/ln -s /etc/nginx/sites-available/app.aibers.health /etc/nginx/sites-enabled/

        /usr/bin/systemctl restart nginx
        /usr/bin/echo "Finished configuring NGINX"
    else
        /usr/bin/echo 'NGINX already configured'
    fi

}

function cleanup() {

    /usr/sbin/service nginx stop >/dev/null 2>&1
    /usr/bin/echo -e "\nCleaning NGINX..."
    /usr/bin/apt-get -y --purge remove nginx* >/dev/null 2>&1
    /usr/bin/echo -e "Finished cleaning NGINX"

    /usr/bin/echo -e "\nCleaning Node.js..."
    /usr/bin/apt-get -y --purge remove nodejs >/dev/null 2>&1
    /usr/bin/echo -e "Finished cleaning Node.js\n"

    /usr/sbin/service postgresql stop >/dev/null 2>&1
    /usr/bin/echo "Cleaning PostgreSQL..."
    /usr/bin/apt-get -y --purge remove postgresql*
    # >/dev/null 2>&1
    /usr/bin/echo "Finished cleaning PostgreSQL"

    /usr/sbin/userdel -f -r aibers >/dev/null 2>&1

    /usr/bin/echo

}

function main() {
    if [ "$1" = "-r" ]; then
        /usr/bin/echo "Cleaning before update..."
        cleanup
    elif [ "$1" = "-u" ]; then
        /usr/bin/echo -e "Updating software...\n"
    else
        /usr/bin/echo "Usage: $0 [-r]"
        /usr/bin/echo "Usage: $0 [-u]"
        exit
    fi

    /usr/bin/echo -e "Updating packages...\n"
    #/usr/bin/apt update && /usr/bin/apt upgrade -y
    /usr/sbin/useradd aibers
    /usr/bin/cp -rf /home/$SUDO_USER/aibers_web/api /home/aibers

    postgres
    node
    nginx
}

main "$1"
