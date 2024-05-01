#!/bin/bash

# Define project root directory
projectRoot=$(pwd)
platform="web"

# Define CLI command
cliCommand="npx tailwindcss"

# Define input and output directories
input="$projectRoot/src/app/global.css"
outputDir="$projectRoot/node_modules/.cache/nativewind"
output="$outputDir/$(basename $input)"

# Define spawn commands
spawnCommands=(
    $cliCommand
    "--input"
    "$input"
    "--output"
    "$output.$platform.css"
)

export BROWSERSLIST="last 1 version"
export BROWSERSLIST_ENV="native"

# Execute the command
"${spawnCommands[@]}"