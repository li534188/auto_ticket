module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://192.168.203.32:5000/',
        changeOrigin: true
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'progress-remaining-color': '#5d656f',
            'radio-dot-color': '#000',
            'radio-size': '13px'
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};