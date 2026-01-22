module.exports = {
  apps: [{
    name: "bazzarmz",
    script: "./backEnd/server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}