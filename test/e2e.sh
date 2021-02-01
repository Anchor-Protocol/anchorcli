#!/bin/bash

# VARIABLES
# ==================================================----------------------------------
ROOT=$(pwd);
VERDACCIO_PORT=4874;
LOCAL_REGISTRY_URL="http://localhost:$VERDACCIO_PORT/";

echo "ROOT=$ROOT";
echo "LOCAL_REGISTRY_URL=$LOCAL_REGISTRY_URL";


# SETUP LOCAL REGISTRY
# ==================================================----------------------------------
function stopLocalRegistry {
  PID=$(lsof -t -i:$VERDACCIO_PORT); # kill verdaccio
  if [[ $PID =~ ^[0-9]+$ ]] ; then
    kill -9 "$PID";
  fi
  rm -rf "$ROOT/test/storage"; # clean verdaccio storage
}

function cleanup {
  stopLocalRegistry;
  npm logout --registry "$LOCAL_REGISTRY_URL"
}

function handleError {
  echo "$(basename "$0"): ERROR! An error was encountered executing line $1." 1>&2;
  echo 'Exiting with error.' 1>&2;
  cleanup;
  exit 1;
}

function handleExit {
  echo 'Exiting without error.' 1>&2;
  cleanup;
  exit;
}

trap 'handleError $LINE0 $BASH_COMMAND' ERR;
trap 'handleExit' SIGQUIT SIGTERM SIGINT SIGHUP;

if [[ -d "$ROOT/test/storage" ]]; then
  tree "$ROOT/test/storage";
  rm -rf "$ROOT/test/storage";
fi;

VERDACCIO_REGISTRY_LOG=$(mktemp);
echo "VERDACCIO_REGISTRY_LOG=$VERDACCIO_REGISTRY_LOG";

(npx verdaccio@latest --config "$ROOT/test/verdaccio.yaml" --listen $VERDACCIO_PORT &>"$VERDACCIO_REGISTRY_LOG" &); # start verdaccio with log
grep -q 'http address' <(tail -f "$VERDACCIO_REGISTRY_LOG"); # wating verdaccio


## LOCAL PUBLISH
## ==================================================----------------------------------
# TODO find how to local publish in monorepo
cd "$ROOT/anchor.js";
npm publish --tag e2e --registry "$LOCAL_REGISTRY_URL";

cd "$ROOT/cli";
npm publish --tag e2e --registry "$LOCAL_REGISTRY_URL";

cd "$ROOT";

# TEST
# ==================================================----------------------------------
# TODO write test scenario

# EXIT
# ==================================================----------------------------------
cleanup;