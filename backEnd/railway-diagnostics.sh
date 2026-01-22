#!/bin/bash

echo "🔍 RAILWAY DIAGNOSTICS"
echo "----------------------"
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "Current Directory: $(pwd)"
echo "Directory Contents:"
ls -la
echo "----------------------"
echo "Environment Variables:"
env | grep -E "NODE_|PORT|RAILWAY"