const DynamicPublicPathPlugin = require('./dynamic-public-path');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const {
  shareAll
} = require('@angular-architects/module-federation/webpack');
module.exports = {
  output: {
    publicPath: "/retirement-election-wc/MF/",
    uniqueName: "retirement_election_wc"
  },
  optimization: {
    runtimeChunk: false,
    chunkIds: 'named'
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "retirement_election_wc",
      library: {
        type: "var",
        name: "retirement_election_wc"
      },
      filename: "remoteEntry.js",
      exposes: {
        './web-components': './src/bootstrap.ts',
      },
      shared: {
        ...shareAll({
          singleton: true,
          requiredVersion: 'auto'
        })
      }
    }),
    new DynamicPublicPathPlugin()
  ],
};