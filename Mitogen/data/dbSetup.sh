#!/bin/sh
#
# Mitogen update database schema, seed data, and stored procedures script
# Author: Paolo Villanueva
# Copyright: 2019 Sunquest Information System
#
#

DB_MYCNF="/etc/mysql/db.my.cnf"
CUR_DIR=$(cd $(dirname $0) ; pwd -P)
SKIP_BACKUPS=0


print_usage() {
    printf "\n"
    printf "Mitogen script for updating schema, seed data, and stored procedures\n"
    printf "Requirements: db.my.cnf file located in /etc/mysql/\n\n"
    printf "Usage: update.sh -m <setup-mode> -n <db-name>\n"
    printf "    -m <setup-mode> [fresh | update]\n"
    printf "        fresh\n"
    printf "            Executes schema.sql which drops existing tables.\n"
    printf "            Updates schema, seed data, and stored procedures.\n\n"
    printf "        update\n"
    printf "            Updates schema, seed data, and stored procedures.\n\n"
    printf "    -n <db-name>\n"
    printf "    -s skip backups\n"
}

do_err() {
    if [ $1 -ne 0 ]; then
        echo "$2"
        exit 1
    fi
}



prompt_database_name() {
    while [ -z "$DB_NAME" ]; do
        printf "Enter database name: "
        read DB_NAME
        DB_NAME="$DB_NAME"
        printf "\n"
    done
}

run_uniflow_db_script() {
    echo "Installing uniflow schema and seed data"
    if [ -f "${CUR_DIR}/../uniflow/data/dbSetup.sh" ]; then
        sh "${CUR_DIR}/../uniflow/data/dbSetup.sh" -m "$1" -n "$DB_NAME" -s
    fi
    echo "Finished uniflow db updates"
}

install_schema() {
    echo "Installing database schema...."
    mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "${CUR_DIR}/schema.sql"
    do_err $? "Error installing database schema..."
}

update() {
    if [ -f "${CUR_DIR}/schemaupdates.sql" ]; then
        echo "Found schemaupdate.sql"
        mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "${CUR_DIR}/schemaupdates.sql"
	    do_err $? "Error: Failed to run schemaupdates.sql"
    fi

    echo "Running seed script: data.sql"
    mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "${CUR_DIR}/data.sql"
    do_err $? "Error: Failed to run seed script"


    if [ -d "${CUR_DIR}/procs/" ]; then
        echo "Found procs/"
        for file in ${CUR_DIR}/procs/*.sql; do
            echo "$file"
            mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "$file"
        done
    fi

    if [ -d "${CUR_DIR}/views/" ]; then
        echo "Found views/"
        for file in ${CUR_DIR}/views/*.sql; do
            echo "$file"
            mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "$file"
        done
    fi


    if [ -d "${CUR_DIR}/functions/" ]; then
        echo "Found functions/"
        for file in ${CUR_DIR}/functions/*.sql; do
            echo "$file"
            mysql --defaults-extra-file="${DB_MYCNF}" "$DB_NAME" < "$file"
        done
    fi
}

# Get command line args
while getopts m:n:s option; do
    case "${option}" in
        m)
            SETUP_MODE="$OPTARG"
            ;;
	    n)
	        DB_NAME="$OPTARG"
	        ;;
        s)
            SKIP_BACKUPS=1
            ;;
    esac
done

echo "===="
echo "${SETUP_MODE}"

# Check sudo status
if [ $(id -u) -ne 0 ]; then
    echo "You must run this script as root use sudo."
    exit 1
fi

# Check if setup mode is not null
if [ -z "$SETUP_MODE" ]; then
    echo "Please specify a setup mode with the -m option."
    print_usage
    exit 1;
fi


# Prompt database name if database name arg is null
if [ -z $DB_NAME ]; then
	prompt_database_name
fi

CHECK_DB_EXISTS=`mysqlshow --defaults-extra-file="${DB_MYCNF}" | grep -o "${DB_NAME} "`

echo "DB Exists: $CHECK_DB_EXISTS"
echo "==="

# Check if database exists.. If so, attempt to backup.. Otherwise, create a new one
if [ ! -z "${CHECK_DB_EXISTS}" ]; then

    if [ $SKIP_BACKUPS -ne 1 ]; then
        echo "Backing up data"
        BACKUP="./backup_dump.sql"
        mysqldump --defaults-extra-file="${DB_MYCNF}" --triggers --opt "${DB_NAME}" > "${BACKUP}"
        sed -i 's/DEFINER=\([`._a-zA-Z0-9]*\)`@`%`//g' "${BACKUP}"
    fi

else
    mysql --defaults-extra-file="${DB_MYCNF}" -e "CREATE DATABASE ${DB_NAME}"
fi



# Handle setup mode
case "$SETUP_MODE" in
    fresh)
        run_uniflow_db_script "$SETUP_MODE"
        install_schema
        echo "Installing schema complete!"
        update
        echo "Update complete!"
        echo ""
        ;;
    update)
        run_uniflow_db_script "$SETUP_MODE"
        update
        echo "Update complete!"
        echo ""
        ;;
    *)
        print_usage
        exit 1
        ;;
esac







