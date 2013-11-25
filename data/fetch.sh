#!/bin/bash

for i in {1..7}; do curl -vo pulls-open/pulls-page-$i.json https://api.github.com/repositories/460078/pulls?state=open\&page=$i; done
for i in {1..75}; do curl -vo pulls-closed/pulls-page-$i.json https://api.github.com/repositories/460078/pulls?state=closed\&page=$i; done
