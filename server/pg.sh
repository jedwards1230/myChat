if [ -z "$1" ]; then
    host="localhost"
else
    host="$1"
fi

psql -h "$host" -p 5432 -U "admin" -d "ChatDB"
