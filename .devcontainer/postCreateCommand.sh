#!/usr/bin/env bash

## Aliases

# AWS profile tools
echo alias awswho=\'aws sts get-caller-identity\' >> ~/.bashrc
echo alias awsls=\'aws configure list-profiles\' >> ~/.bashrc
# Alias for exa. Pairs with modern-shell-utils devcontainer feature
echo alias l=\'exa\' >> ~/.bashrc 
echo alias la=\'exa -a\' >> ~/.bashrc 
echo alias ll=\'exa -lahg\' >> ~/.bashrc 
echo alias ls=\'exa --color=auto\' >> ~/.bashrc
# Projen
echo alias pj=\'npx projen\' >> ~/.bashrc

## Yarn

# Load packages with no interaction
yarn install --frozen-lockfile
