module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
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
          },
          javascriptEnabled: true,
        },
      },
    },
  },
};