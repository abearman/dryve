#!/bin/bash

# Command line build tool to build dryve.me website
# usage: jitsubuild <test1|test2|test3|production>

EXPECTED_ARGS=3
E_BADARGS=65
SUBDOMAIN_NAME=""
BUILD_TARGET=""
DATABASE_USERNAME=""
DATABASE_PASSWORD=""

set -o pipefail     # trace ERR through pipes
set -o errtrace     # trace ERR through 'time command' and other functions

error_handler()
{
  JOB="$0"          # job name
  LASTLINE="$1"     # line of error occurrence
  LASTERR="$2"      # error code
  echo "ERROR in ${JOB} : line ${LASTLINE} with exit code ${LASTERR}"
  exit 1
}

trap 'error_handler ${LINENO} ${$?}' ERR

usage()
{
  echo "jitsubuild - command line tool to build dryve.me website"
  echo "usage: ./jitsubuild.sh <test1|test2|test3|production> <database username> <database password>"
  echo ""
}

createVersionFile()
{
  echo "---"
  echo "Building version.txt file"
  git rev-parse HEAD > ./NodeWebSite/version.txt
}

removeOldBuildTree()
{
  echo "---"
  echo "Removing any existing build tree"
  rm -rf ./build
}

createBuildDirectory()
{
  echo "---"
  echo "Creating build directory"
  mkdir ./build/
  mkdir ./build/NodeWebSite/
  cp -R ./NodeWebSite/config/ ./build/NodeWebSite/config/
  cp -R ./NodeWebSite/controllers/ ./build/NodeWebSite/controllers/
  cp -R ./NodeWebSite/logger/ ./build/NodeWebSite/logger/
  cp -R ./NodeWebSite/public/ ./build/NodeWebSite/public/
  cp -R ./NodeWebSite/routes/ ./build/NodeWebSite/routes/
  cp -R ./NodeWebSite/views/ ./build/NodeWebSite/views/
  cp ./NodeWebSite/*.js ./build/NodeWebSite/
  cp ./NodeWebSite/package.json ./build/NodeWebSite/
  cp ./NodeWebSite/version.txt ./build/NodeWebSite/
  mkdir ./build/NodeWebSite/logfiles/
  cp ./NodeWebSite/logfiles/readme.txt ./build/NodeWebSite/logfiles/
}

runTimeStamper()
{
  echo "---"
  echo "Build timestamp.txt file"
  date +%Y%m%d%H%M%S > ./build/NodeWebSite/timestamp.txt
}

fixPackageJsonForDeployment()
{
  echo "---"
  echo "Updating package.json with deployment subdomain"
  sed -e "s/\"name\": \"dryve\"/\"name\": \"$SUBDOMAIN_NAME\"/g" -e "s/\"subdomain\": \"dryve\"/\"subdomain\": \"$SUBDOMAIN_NAME\"/g" <./build/NodeWebSite/package.json >./build/temp.json
  rm ./build/NodeWebSite/package.json
  mv ./build/temp.json ./build/NodeWebSite/package.json
}

fixConnectionString()
{
  echo "---"
  echo "Updating config.js with database username/password"
  sed -e "s/{{MONGO_USER}}/$DATABASE_USERNAME/g" -e "s/{{MONGO_PASSWORD}}/$DATABASE_PASSWORD/g" <./build/NodeWebSite/config/config.js >./build/temp.json
  rm ./build/NodeWebSite/config/config.js
  mv ./build/temp.json ./build/NodeWebSite/config/config.js
}

#
# Check for expected arguments
#
if [ $# -lt $EXPECTED_ARGS ]
then
  usage
  exit $E_BADARGS
fi

case "$1" in
  'test1')
    SUBDOMAIN_NAME="dryvetest1"
    ;;
  'test2')
    SUBDOMAIN_NAME="dryveest2"
    ;;
  'test3')
    SUBDOMAIN_NAME="dryvetest3"
    ;;
  'production')
    SUBDOMAIN_NAME="dryve"
    ;;
  *)
    usage
    exit $E_BADARGS
esac

BUILD_TARGET=$1
DATABASE_USERNAME=$2
DATABASE_PASSWORD=$3

echo "SUBDOMAIN_NAME is set to $SUBDOMAIN_NAME"
echo "BUILD_TARGET is set to $BUILD_TARGET"
echo "DATABASE_USERNAME is set to $DATABASE_USERNAME"
echo "DATABASE_PASSWORD is set to $DATABASE_PASSWORD"

createVersionFile
removeOldBuildTree
createBuildDirectory
runTimeStamper
fixPackageJsonForDeployment
fixConnectionString
echo "Done!"
exit 0
