#!/bin/bash

if [ $# -lt 2 ]
  then
    echo "Please supply a GitHub client_id and client_secret as arguments"
    echo "For example: ./fetch.sh 12345678 1a2b3c4d5e6f"
    exit 1
fi

client_id=$1
client_secret=$2

for i in {1..7}; do curl -vo pulls-open/pulls-page-$i.json https://api.github.com/repositories/460078/pulls?state=open\&page=$i\&client_id=$client_id\&client_secret=$client_secret; done
for i in {1..75}; do curl -vo pulls-closed/pulls-page-$i.json https://api.github.com/repositories/460078/pulls?state=closed\&page=$i\&client_id=$client_id\&client_secret=$client_secret; done
