module.exports = {
  apps: [{
    script: '{{appName}}/node_modules/lambda-edge-server/server.js --handler {{appName}}/src/app.js',
    error_file : '.devcontainer/error.log',
    out_file : '.devcontainer/debug.log',
    watch: ['{{appName}}/src'],
    watch_delay: 1000
  }]
};
