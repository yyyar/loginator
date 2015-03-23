#!/usr/bin/env bash

stdbuf -oL redis-cli  --csv psubscribe "ilog:*"  | stdbuf -oL cut -d , -f 3,4 -s  | stdbuf -oL tr -d '"'   | coolor

