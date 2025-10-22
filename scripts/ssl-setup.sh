#!/bin/bash

# ==============================================
# SSL Certificate Setup Script (Let's Encrypt)
# ==============================================

set -e

if [ -z "$1" ]; then
    echo "Usage: ./ssl-setup.sh <your-domain.com>"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}

echo "🔒 Setting up SSL for domain: $DOMAIN"

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Stop nginx container temporarily
echo "⏸️  Stopping nginx container..."
docker-compose stop nginx

# Obtain certificate
echo "📜 Obtaining SSL certificate..."
certbot certonly --standalone \
    -d $DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive

# Copy certificates to nginx directory
echo "📋 Copying certificates..."
mkdir -p ./nginx/ssl
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./nginx/ssl/

# Update nginx configuration
echo "⚙️  Updating nginx configuration..."
sed -i "s/# server {/server {/g" ./nginx/conf.d/default.conf
sed -i "s/your-domain.com/$DOMAIN/g" ./nginx/conf.d/default.conf

# Restart nginx
echo "🔄 Restarting nginx..."
docker-compose up -d nginx

echo "✅ SSL setup completed!"
echo ""
echo "Your site is now accessible at:"
echo "  https://$DOMAIN"
echo ""
echo "Note: Remember to set up auto-renewal with cron:"
echo "  0 0 * * * certbot renew --quiet"
