const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: '/'
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-project/'
    : '/'
}
