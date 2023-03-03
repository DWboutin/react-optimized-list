# If env var DISABLE_SAFE_COMMIT has a length of 0, exit immediatly
if [[ -z "${DISABLE_SAFE_COMMIT}" ]]; then
  bold=$(tput bold)
  normal=$(tput sgr0)
  green=$(tput setaf 2)

  read -p "${bold}${green}Do you want to run lint, and prettier (y/N)?${normal}" CONT
  if [ "$CONT" = "y" ]; then
    npm run safe-commit
  else
    echo "keep going";
  fi
else
  exit 0
fi
