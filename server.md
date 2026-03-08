# OP3 Server Guide — For Project Agents

This document is for Claude Code agents working on projects that deploy to the OP3 server. Read this before making any server changes.

## Access Credentials

### Coolify Dashboard
- **URL:** `http://100.76.178.67:8000` (Tailscale VPN required)
- **Email:** `sbw919@gmail.com`
- **Password:** `CoolifyOP3_2026!`

### SSH
- **Command:** `ssh openclaw@100.76.178.67` (Tailscale only, pubkey auth)
- SSH key must be loaded first: `ssh-add ~/.ssh/id_ed25519`

### PostgreSQL (shared instance on server)
- **Host:** `127.0.0.1` (from host) / `host.docker.internal` or `10.0.0.1` (from Docker containers)
- **Port:** `5432`
- **App user:** `coolify_apps` / password: `coolify_apps_op3_2026` — has `CREATEDB`, can create new databases for your project
- **Do NOT use:** `mem0` user, `n8n_user`, or `postgres` superuser — these are reserved

### Security Rules
- **Never commit these credentials to Git repos** — use Coolify environment variables for app runtime secrets
- **Never log or print credentials** in build output or CI logs
- **Each project gets isolated database access** — you cannot see other projects' data
- **If you need a new dedicated database user, port, or firewall rule** — request it through the OP3 control plane agent (`~/CC - OP3/`). Do NOT attempt to create these yourself on the server.

## Server Overview

| Detail | Value |
|--------|-------|
| **Provider** | Hetzner Cloud VPS |
| **Public IP** | `46.225.73.26` |
| **Tailscale IP** | `100.76.178.67` |
| **OS** | Ubuntu 24.04 |
| **CPU** | 4 cores (AMD EPYC-Rome) |
| **RAM** | 7.6 GB (upgrade to 16GB if needed) |
| **Disk** | 75 GB (45 GB free) |
| **Swap** | 4 GB |

## How to Deploy Your App

All app deployments go through **Coolify** (self-hosted PaaS). Do NOT install anything directly on the server outside of Coolify.

### Deployment Options

Coolify supports:
- **Git repos** (GitHub, GitLab, Bitbucket — push-to-deploy)
- **Docker images** (any public/private registry)
- **Docker Compose** (multi-container apps)
- **Nixpacks** (auto-detect buildpacks, like Heroku)
- **Static sites** (HTML/JS/CSS)
- **One-click services** (PostgreSQL, Redis, MongoDB, etc.)

### Steps to Deploy

1. Log into Coolify dashboard via Tailscale
2. Go to your project (or create a new one)
3. Click "+ Add Resource"
4. Connect your Git repo or paste a Docker image
5. Set your domain under "Domains" (e.g., `app.yourdomain.com`)
6. Coolify auto-provisions Let's Encrypt SSL
7. Deploy

### Domain Setup (Cloudflare)

All public-facing domains must go through Cloudflare:

1. In Cloudflare DNS, add an **A record** pointing to `46.225.73.26`
2. Set proxy status to **Proxied** (orange cloud ON)
3. SSL/TLS mode: **Full (Strict)**
4. In Coolify, add the same domain to your resource's "Domains" field

```
Traffic flow:
User → Cloudflare (CDN/WAF/DDoS) → OP3:443 → Coolify Traefik → Your container
```

Cloudflare hides the origin IP and provides caching + DDoS protection.

## Database Access

The server runs **PostgreSQL 16** (host-level, not in Docker). All projects share this single instance with strict isolation.

### Getting a Database

Ask the OP3 operator (B) or the OP3 control plane agent to create a database for your project:

```sql
-- Run on OP3 as postgres superuser
CREATE USER myapp_user WITH PASSWORD 'strong_unique_password';
CREATE DATABASE myapp_db OWNER myapp_user;

-- Then add to pg_hba.conf:
-- host    myapp_db    myapp_user    127.0.0.1/32    scram-sha-256
```

Alternatively, use the shared `coolify_apps` user (credentials in the Access section above). This user can create new databases but CANNOT access `mem0_db`, `n8n_db`, or any other project's database.

### Connecting from Docker Containers

From inside a Coolify-deployed container, connect to the host PostgreSQL:
- **Host:** `host.docker.internal` or `10.0.0.1`
- **Port:** `5432`

### Database Security Rules

- Each database user can ONLY access its own database (`pg_hba.conf` enforced)
- No cross-database queries are possible
- Do NOT use the `postgres` superuser in your app
- Do NOT modify `pg_hba.conf` yourself — ask the OP3 operator

## Resource Budget

Current server usage:

| Service | RAM |
|---------|-----|
| OpenClaw agent fleet | ~500 MB |
| Mem0 (cross-agent memory) | ~207 MB |
| Ollama (embeddings) | ~363 MB |
| Neo4j (graph memory) | ~504 MB |
| PostgreSQL 16 | ~100 MB |
| n8n (workflow automation) | ~300 MB |
| Coolify (dashboard + containers) | ~500 MB |
| **Total used** | **~2.5 GB** |
| **Available for apps** | **~4.5 GB** |

Keep your containers lean. If you need more RAM, the server can be upgraded.

## What You MUST NOT Do

### Never Touch These Services

The following run as native systemd services and are managed by the OP3 control plane. **Do not restart, modify, or interfere with them:**

| Service | Purpose | Why It's Off Limits |
|---------|---------|-------------------|
| `openclaw-gateway` | AI agent fleet (14 agents) | Breaking this takes down all agents |
| `mem0` | Cross-agent shared memory | Agents lose memory context |
| `ollama` | Embedding model server | Memory search breaks |
| `neo4j` | Graph memory database | Entity relationships lost |
| `postgresql` | Shared database | Your DB AND agent memory both live here |
| `n8n` | Workflow automation | Active automations depend on it |

### Never Do These Things

- **Do NOT install packages globally** (`apt install`, `npm -g`) — use Docker containers via Coolify
- **Do NOT modify firewall rules** (UFW, iptables, Hetzner cloud firewall)
- **Do NOT change SSH config** (`/etc/ssh/sshd_config*`)
- **Do NOT modify Docker daemon config** (`/etc/docker/daemon.json`)
- **Do NOT run `docker` commands directly** — use Coolify's UI/API
- **Do NOT bind to ports 5000, 5001, 8000, 8100, 11434, 7474, 7687, 18789, 18790, 18792, 5678, 6001, 6002** — these are reserved
- **Do NOT write to `/home/openclaw/.openclaw/`** — this is the agent fleet workspace
- **Do NOT access or read agent session files, configs, or memory databases**
- **Do NOT use the `mem0`, `n8n_user`, or `postgres` database users** — use `coolify_apps` or get a dedicated user created

### Reserved Ports

| Port | Service | Exposure |
|------|---------|----------|
| 22 | SSH | Tailscale only |
| 80 | Coolify Traefik (HTTP) | Public (Cloudflare) |
| 443 | Coolify Traefik (HTTPS) | Public (Cloudflare) |
| 5000 | Tradesite SMS Agent | Loopback (Cloudflare Tunnel) |
| 5001 | Patch SMS Agent | Loopback (Cloudflare Tunnel) |
| 5432 | PostgreSQL | Loopback only |
| 5678 | n8n | Tailscale only |
| 6001-6002 | Coolify Realtime | Tailscale only |
| 7474 | Neo4j Browser | Loopback only |
| 7687 | Neo4j Bolt | Loopback only |
| 8000 | Coolify Dashboard | Tailscale only |
| 8100 | Mem0 API | Loopback only |
| 11434 | Ollama | Loopback only |
| 18789 | OpenClaw Gateway | Loopback only |
| 18790 | Tailscale Serve (Gateway TLS) | Tailnet only |
| 18792 | Browser Relay | Loopback only |

Your app containers get dynamic ports assigned by Coolify's Traefik — you don't need to manage ports manually.

## SSH Access

Most projects won't need SSH — use Coolify instead. If you do need it, see credentials in the Access section above.

- No password authentication — pubkey only
- No root login (except from localhost for Coolify)
- fail2ban active: 3 failed attempts = 24-hour ban

## Architecture Diagram

```
Internet
  │
  ├── Cloudflare (CDN/WAF/DDoS protection)
  │     │
  │     └── A record → 46.225.73.26
  │
OP3 Server (46.225.73.26 / 100.76.178.67 Tailscale)
  │
  ├── Port 80/443 ─── Coolify Traefik ─── Your App Containers (Docker)
  │                                         ├── app-1.yourdomain.com
  │                                         ├── app-2.yourdomain.com
  │                                         └── ...
  │
  ├── Port 8000 ───── Coolify Dashboard (Tailscale-only)
  │
  ├── Port 5432 ───── PostgreSQL 16 (loopback)
  │                    ├── mem0_db (agent memory — DO NOT TOUCH)
  │                    ├── n8n_db (automations — DO NOT TOUCH)
  │                    └── your_app_db (your project)
  │
  ├── Native Services (DO NOT TOUCH)
  │    ├── OpenClaw Gateway (18789)
  │    ├── Mem0 API (8100)
  │    ├── Ollama (11434)
  │    ├── Neo4j (7474/7687)
  │    └── n8n (5678)
  │
  └── Tailscale VPN (private network)
       └── Admin access to dashboard, SSH, monitoring
```

## Environment Variables

Set environment variables for your app in Coolify's UI:
1. Go to your resource → "Environment" tab
2. Add key-value pairs
3. Coolify injects them into your container at runtime

For database connections using the shared `coolify_apps` user:
```
DATABASE_URL=postgresql://coolify_apps:coolify_apps_op3_2026@host.docker.internal:5432/your_db_name
```
Set this in Coolify's environment variables UI — don't hardcode it in your source code.

## Logs and Debugging

- **Your app logs:** Coolify dashboard → your resource → "Logs" tab
- **Build logs:** Coolify dashboard → your resource → "Deployments" tab
- **Server-level Docker logs:** `sudo docker logs <container-name>` (SSH required)

## Getting Help

If you need something that requires server-level changes (new database user, firewall rule, port opening, package installation), don't do it yourself. Instead:

1. Ask B (the human operator) to handle it
2. Or request it through the OP3 control plane agent (Claude Code session in `~/CC - OP3/`)

The OP3 control plane manages all server infrastructure. Your project agent manages your app code and Coolify deployments.

## Quick Reference

| Task | How |
|------|-----|
| Deploy an app | Coolify dashboard → Add Resource → Connect repo |
| Get a database | Use `coolify_apps` user or ask OP3 operator |
| Set up a domain | Cloudflare A record + Coolify domain config |
| View app logs | Coolify dashboard → Resource → Logs |
| Redeploy | Coolify dashboard → Resource → Redeploy |
| SSH into server | `ssh openclaw@100.76.178.67` (Tailscale required) |
| Check server health | `ssh openclaw@100.76.178.67 'openclaw gateway status'` |
