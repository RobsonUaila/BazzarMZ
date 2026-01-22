{
  "apps": [
    {
      "name": "ecommerce-backend",
      "script": "./server.js",
      "cwd": "./backEnd",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "error_file": "./logs/error.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true,
      "autorestart": true,
      "max_restarts": 10,
      "min_uptime": "10s",
      "max_memory_restart": "500M",
      "watch": false,
      "ignore_watch": ["uploads", "backups", "node_modules", "logs"],
      "merge_logs": true,
      "env_production": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "ecommerce-frontend",
      "script": "npm",
      "args": "run dev",
      "cwd": "./frontEnd",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production",
        "VITE_API_URL": "https://seu-dominio.com/api"
      },
      "error_file": "./logs/frontend-error.log",
      "out_file": "./logs/frontend-out.log",
      "autorestart": true,
      "max_restarts": 5,
      "min_uptime": "10s"
    }
  ]
}
