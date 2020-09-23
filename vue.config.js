module.exports = {
  publicPath:'./',
  productionSourceMap: false,
  devServer: {
    open: false, //是否自动弹出浏览器页面
    host: "localhost", 
    port: '5001',
    https: false,
    hotOnly: false, 
    proxy: {
      '/api': {
        target: 'https://www.yuque.com/api',
        ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  },
}
