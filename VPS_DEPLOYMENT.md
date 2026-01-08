# VPS Deployment Guide (PC Bekas + Cloudflare)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- PM2 or similar process manager
- Cloudflare Tunnel (cloudflared) installed
- PC bekas dengan Ubuntu/Debian atau OS Linux lainnya

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your actual values:

```env
DATABASE_URL="postgresql://username:password@your-db-host:5432/database?schema=public"
JWT_SECRET="your-production-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
NODE_ENV="production"
```

## Database Connection Issues

### Error: "Can't reach database server at base"

This means DATABASE_URL is not properly set or formatted.

**Solutions:**

1. **Check DATABASE_URL format:**

   ```bash
   # Should be:
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

   # Example:
   postgresql://myuser:mypass123@localhost:5432/mywebdb?schema=public
   ```

2. **For Prisma Postgres (Cloud):**

   ```bash
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
   ```

3. **For local PostgreSQL:**

   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
   ```

4. **Verify environment variable is loaded:**

   ```bash
   # In your VPS terminal:
   echo $DATABASE_URL

   # If empty, reload or add to shell profile
   export DATABASE_URL="your-connection-string"
   ```

5. **Test database connection:**
   ```bash
   npx prisma db pull
   # Should show your schema if connection works
   ```

## Common VPS Issues

### Issue: Environment variables not loaded

**Solution:** Add to `.bashrc` or `.zshrc`:

```bash
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
```

### Issue: SSL/TLS connection errors

**Solution:** Ensure your DATABASE_URL has proper SSL parameters:

```bash
# Add sslmode parameter
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&sslmode=require"
```

### Issue: Firewall blocking database port

**Solution:**

```bash
# Allow PostgreSQL port (usually 5432)
sudo ufw allow 5432
```

### Issue: Docker/Cloudflare proxy blocking connections

**Solution untuk Cloudflare Tunnel:**

1. **Gunakan localhost untuk database (jika DB di PC yang sama):**

   ```bash
   DATABASE_URL="postgresql://user:pass@localhost:5432/mydb?schema=public"
   ```

2. **Jika database external, pastikan tidak melalui Cloudflare:**
   - Database connection harus direct, bukan melalui Cloudflare proxy
   - Gunakan IP internal jika dalam network yang sama

3. **Cloudflare Tunnel Configuration:**

   ```yaml
   # config.yml
   tunnel: your-tunnel-id
   credentials-file: /path/to/credentials.json

   ingress:
     - hostname: yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

4. **Pastikan Cloudflare Tunnel tidak proxy database connection:**
   - Cloudflare Tunnel hanya untuk HTTP/HTTPS traffic
   - Database connection bypass Cloudflare
   - Gunakan internal network atau direct IP

## Setup Cloudflare Tunnel

### Install cloudflared

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### Setup Tunnel

1. **Login to Cloudflare:**

   ```bash
   cloudflared tunnel login
   ```

2. **Create tunnel:**

   ```bash
   cloudflared tunnel create myweb-tunnel
   ```

3. **Configure tunnel (`~/.cloudflared/config.yml`):**

   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: /home/your-user/.cloudflared/YOUR_TUNNEL_ID.json

   ingress:
     - hostname: yourdomain.com
       service: http://localhost:3000
     - hostname: www.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

4. **Route DNS:**

   ```bash
   cloudflared tunnel route dns myweb-tunnel yourdomain.com
   cloudflared tunnel route dns myweb-tunnel www.yourdomain.com
   ```

5. **Run tunnel as service:**

   ```bash
   # Install as service
   sudo cloudflared service install

   # Start service
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared

   # Check status
   sudo systemctl status cloudflared
   ```

## Database Setup untuk PC Bekas

### Install PostgreSQL Locally

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE mywebdb;
CREATE USER mywebuser WITH PASSWORD 'strong-password-here';
GRANT ALL PRIVILEGES ON DATABASE mywebdb TO mywebuser;
\q

# Test connection
psql -U mywebuser -d mywebdb -h localhost
```

### Update DATABASE_URL

```bash
# For local PostgreSQL on same PC
DATABASE_URL="postgresql://mywebuser:strong-password-here@localhost:5432/mywebdb?schema=public"
```

## PC Bekas Configuration

### System Requirements (Minimal)

- CPU: 2 cores (recommended 4 cores)
- RAM: 4GB (recommended 8GB)
- Storage: 50GB available space
- Internet: Stable connection with public IP atau Cloudflare Tunnel

### Network Setup

1. **Jika punya IP Public:**
   - Forward port dari router (optional, karena pakai Cloudflare Tunnel)
   - Setup firewall dengan ufw

2. **Jika tidak punya IP Public (recommended untuk home):**
   - Gunakan Cloudflare Tunnel (gratis)
   - Tidak perlu port forwarding
   - Lebih aman karena tidak expose port ke internet

### Optimize untuk PC Bekas

1. **Disable unnecessary services:**

   ```bash
   sudo systemctl disable bluetooth
   sudo systemctl disable cups
   ```

2. **Setup swap (jika RAM terbatas):**

   ```bash
   # Create 2GB swap
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile

   # Make permanent
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

3. **Enable unattended updates:**

   ```bash
   sudo apt install unattended-upgrades -y
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

4. **Setup automatic restart (optional):**

   ```bash
   # Add to crontab
   crontab -e

   # Restart every Sunday at 3 AM
   0 3 * * 0 /sbin/shutdown -r now
   ```

## Deployment Steps (PC Bekas + Cloudflare)

1. **Setup PC Bekas:**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install dependencies
   sudo apt install git curl build-essential -y
   ```

2. **Install Node.js:**

   ```bash
   # Using NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Verify
   node --version
   npm --version
   ```

3. **Install PostgreSQL (if needed):**

   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   ```

4. **Install PM2:**

   ```bash
   sudo npm install -g pm2
   ```

5. **Install Cloudflare Tunnel:**

   ```bash
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   cloudflared tunnel login
   ```

6. **Clone repository:**
   ```bash
   cd ~
   git clone https://github.com/your-username/myweb.git
   cd myweb
   ```

## Nginx Configuration (Optional)

**Note:** Jika menggunakan Cloudflare Tunnel, Nginx tidak diperlukan karena cloudflared langsung proxy ke aplikasi. Tapi jika ingin tambahan layer:

````nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
## Troubleshooting Commands

```bash
# Check if app is running
pm2 status
pm2 logs myweb

# Restart app
pm2 restart myweb

# Check Cloudflare Tunnel
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f

# Check environment variables in Node
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db pull

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Check disk space
df -h

# Check memory usage
free -m

# Check CPU usage
top

# Check network
ping google.com
curl http://localhost:3000

# Update and redeploy
cd ~/myweb
git pull
npm install
npm run build
pm2 restart myweb
````

## Common Issues untuk PC Bekas

### Issue: PC restart dan app tidak auto-start

**Solution:**

```bash
# Pastikan PM2 startup sudah di-setup
pm2 startup
pm2 save

# Pastikan Cloudflare Tunnel enabled
sudo systemctl enable cloudflared
```

### Issue: PC lambat atau hang

**Solution:**

```bash
# Check memory
free -m

# Add swap jika perlu
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Optimize Node.js memory
pm2 delete myweb
pm2 start npm --name "myweb" --max-memory-restart 1G -- start
```

### Issue: Database connection timeout

**Solution:**

```bash
# Increase PostgreSQL max connections
sudo nano /etc/postgresql/*/main/postgresql.conf

# Change:
# max_connections = 100
# shared_buffers = 256MB

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Issue: Koneksi internet putus-putus

**Solution:**

```bash
# Setup connection monitoring
crontab -e

# Add this line to check every 5 minutes:
*/5 * * * * ping -c 1 8.8.8.8 || sudo systemctl restart network-manager

# Cloudflare Tunnel auto-reconnect (already built-in)
# Just make sure service is enabled
sudo systemctl enable cloudflared
## Database Connection String Examples

### Local PostgreSQL (PC yang sama)
```

DATABASE_URL="postgresql://mywebuser:password@localhost:5432/mywebdb?schema=public"

```

### Remote PostgreSQL (PC lain dalam network)
```

DATABASE_URL="postgresql://user:pass@192.168.1.100:5432/mydb?schema=public"

```

### Prisma Postgres (Cloud - Recommended untuk PC bekas)
```

DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbG..."

```
**Keuntungan:**
- Database di-host di cloud, lebih reliable
- Tidak membebani PC bekas
- Connection pooling otomatis

### Neon (Serverless PostgreSQL - Free tier available)
```

DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"

```
**Keuntungan:**
- Gratis untuk small projects
- Auto-suspend saat tidak dipakai
- Cocok untuk PC bekas dengan resource terbatas

### Supabase (Free tier available)
```

## Security Checklist

- [ ] DATABASE_URL tidak di-commit ke git
- [ ] JWT_SECRET menggunakan random string yang kuat (`openssl rand -base64 32`)
- [ ] NODE_ENV set ke "production"
- [ ] PostgreSQL user memiliki minimal privileges
- [ ] SSL enabled untuk database connection (jika remote)
- [ ] Firewall configured (ufw) untuk port yang diperlukan
- [ ] Regular backup database (`pg_dump`)
- [ ] Cloudflare Tunnel configured dengan credentials yang aman
- [ ] PM2 logs rotation enabled
- [ ] Unattended security updates enabled
- [ ] SSH key-based authentication (disable password login)
- [ ] Non-root user untuk menjalankan aplikasi
- [ ] Monitoring setup (optional: Uptime Kuma, Netdata)

## Monitoring Setup (Optional)

### Setup Uptime Kuma (Self-hosted)

```bash
# Install with Docker
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1

# Access at: http://localhost:3001
# Setup monitoring untuk:
# - http://localhost:3000 (aplikasi)
# - PostgreSQL port check
# - Disk space monitor
```

### Basic Monitoring Script

```bash
# Create monitoring script
nano ~/monitor.sh

# Paste this:
#!/bin/bash
LOG_FILE="/var/log/myweb-monitor.log"

# Check app
if ! pm2 list | grep -q "online"; then
    echo "$(date): App is down, restarting..." >> $LOG_FILE
    pm2 restart myweb
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): Disk usage is ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100}' | cut -d. -f1)
if [ $MEM_USAGE -gt 90 ]; then
    echo "$(date): Memory usage is ${MEM_USAGE}%" >> $LOG_FILE
fi

# Make executable
chmod +x ~/monitor.sh

# Add to crontab (run every 5 minutes)
crontab -e
# Add: */5 * * * * /home/your-user/monitor.sh
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
nano ~/backup-db.sh

# Paste this:
#!/bin/bash
BACKUP_DIR="/home/your-user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="mywebdb"
DB_USER="mywebuser"

mkdir -p $BACKUP_DIR
pg_dump -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Make executable
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/your-user/backup-db.sh
```

### Application Backup

```bash
# Backup uploaded files
tar -czf ~/backups/files_$(date +%Y%m%d).tar.gz ~/myweb/public/images/

# Backup .env
cp ~/myweb/.env ~/backups/.env.$(date +%Y%m%d)
```

## Power Management untuk PC Bekas

````bash
# Disable screen blanking
sudo nano /etc/default/grub
# Add: GRUB_CMDLINE_LINUX="consoleblank=0"
sudo update-grub

# Setup auto-restart after power failure
# (BIOS setting, enable "Restore on AC/Power Loss")

# Setup UPS monitoring (if you have UPS)
sudo apt install nut -y
```n.com
    #     service: http://localhost:3000
    #   - service: http_status:404

    # Route DNS
    cloudflared tunnel route dns myweb-tunnel yourdomain.com

    # Install as service
    sudo cloudflared service install
    sudo systemctl start cloudflared
    sudo systemctl enable cloudflared
    ```

13. **Verify deployment:**
    ```bash
    # Check app is running
    pm2 status

    # Check Cloudflare tunnel
    sudo systemctl status cloudflared

    # Check logs
    pm2 logs myweb
    ```

## Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
````

## Troubleshooting Commands

```bash
# Check if app is running
pm2 status

# View logs
pm2 logs myweb

# Restart app
pm2 restart myweb

# Check environment variables in Node
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db pull

# Check PostgreSQL is running
sudo systemctl status postgresql
```

## Database Connection String Examples

### Local PostgreSQL

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
```

### Remote PostgreSQL

```
DATABASE_URL="postgresql://user:pass@192.168.1.100:5432/mydb?schema=public&sslmode=require"
```

### Prisma Postgres (Accelerate)

```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbG..."
```

### Neon (Serverless PostgreSQL)

```
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Supabase

```
DATABASE_URL="postgresql://postgres:pass@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public"
```

## Security Checklist

- [ ] DATABASE_URL tidak di-commit ke git
- [ ] JWT_SECRET menggunakan random string yang kuat
- [ ] NODE_ENV set ke "production"
- [ ] PostgreSQL user memiliki minimal privileges
- [ ] SSL enabled untuk database connection
- [ ] Firewall configured untuk port yang diperlukan
- [ ] Regular backup database
