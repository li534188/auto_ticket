#!/bin/bash

if [ -z "$UPSTREAM_SERVERS" ]
then
  servers=("server:3031")
else
  # server1:3031;server2:3031
  IFS=";" read -a servers <<< "$UPSTREAM_SERVERS"
fi

for server in "${servers[@]}"
do
  echo "server ${server};" >> /etc/nginx/conf.d/upstream_servers.conf
done

nginx -g "daemon off;"
