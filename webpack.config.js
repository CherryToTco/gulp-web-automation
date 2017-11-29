module.exports = {
  entry: __dirname + "/src/views/demo/demo.js",
  output: {
    path: __dirname + "/src/views/demo",
    filename: "bundle.js"
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "es2015"
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test:/\.hbs$/,
        loader: "handlebars-loader"
      }
    ]
  }
};