#!/bin/bash

set -eux

export REACT_APP_SERVER_BASE_URL=${REACT_APP_SERVER_BASE_URL:="https://${HEROKU_APP_NAME}.herokuapp.com"}
export REACT_APP_GOOGLE_REDIRECT_URI=${REACT_APP_GOOGLE_REDIRECT_URI:="https://${HEROKU_APP_NAME}.herokuapp.com"}
export REACT_APP_GOOGLE_CLIENT_ID=${REACT_APP_GOOGLE_CLIENT_ID:=${GOOGLE_CLIENT_ID}}

npm run build
