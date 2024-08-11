const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/common.do': {
        target: 'https://www.dhlottery.co.kr',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/common.do': '/common.do' },
      },
    },
  },
})
