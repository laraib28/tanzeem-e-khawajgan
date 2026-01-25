#!/bin/bash

# Tanzeem-e-Khawajgan Website Setup Script
# This script helps configure the application for first-time use

set -e

echo "======================================"
echo "Tanzeem-e-Khawajgan Website Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm found: $(npm --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Configuration check
echo "======================================"
echo "Configuration Checklist"
echo "======================================"
echo ""

CONFIG_FILE="config/site-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}✗${NC} Configuration file not found: $CONFIG_FILE"
    exit 1
fi

echo -e "${GREEN}✓${NC} Configuration file found"
echo ""

# Check for placeholder values
echo "Checking configuration..."
echo ""

# Check API key
if grep -q "RESEND_API_KEY_HERE" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠${NC}  Resend API key is still a placeholder"
    echo "   Update: config/site-config.json -> email.resendApiKey"
    echo "   Get key from: https://resend.com"
fi

# Check coordinates
if grep -q '"lat": 31.5204' "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠${NC}  Map coordinates are example values (Lahore, Pakistan)"
    echo "   Update: config/site-config.json -> contact.coordinates"
    echo "   Find coordinates: https://www.latlong.net"
fi

# Check phone number
if grep -q "+92 300 1234567" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠${NC}  Phone number is an example value"
    echo "   Update: config/site-config.json -> contact.phone"
fi

# Check address
if grep -q "123 Main Street" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠${NC}  Address is an example value"
    echo "   Update: config/site-config.json -> contact.address"
fi

echo ""
echo "======================================"
echo "Next Steps"
echo "======================================"
echo ""
echo "1. Update configuration:"
echo "   Edit: config/site-config.json"
echo ""
echo "2. Update content:"
echo "   Edit files in: config/content/en/"
echo ""
echo "3. Add images:"
echo "   Add your images to: public/images/"
echo ""
echo "4. Start development server:"
echo "   npm run dev"
echo ""
echo "5. Build for production:"
echo "   npm run build"
echo ""
echo "======================================"
echo "Documentation"
echo "======================================"
echo ""
echo "README.md              - Setup guide and documentation"
echo "docs/BUGS.md           - Known issues and bugs"
echo "docs/compliance-checklist.md - Compliance verification"
echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo ""
