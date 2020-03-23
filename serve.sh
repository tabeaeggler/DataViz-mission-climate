#this script is called by npm deploy command (see: package.json)
#this script was used for CI
git add --chmod=+x "serve"
serve -l 5000 -s build