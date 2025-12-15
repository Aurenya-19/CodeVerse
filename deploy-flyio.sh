#!/bin/bash

echo "🚀 Installing Fly CLI..."
curl -L https://fly.io/install.sh | sh

# Add fly to PATH for current session
export FLYCTL_INSTALL="/home/runner/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

echo "✅ Fly CLI installed!"
echo ""
echo "📋 Next steps:"
echo "1. Run: fly auth login"
echo "2. Run: fly deploy"
echo "3. Set your environment variables using fly secrets set"
echo ""
echo "For detailed instructions, check FLYIO_DEPLOY.md"
