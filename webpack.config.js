const WebpackPWAManifest = require("webpack-pwa-manifest");
const path = require("path")

const config = {
    entry: {
        app: "./public/assets/index.js",
    },
    output: {
        path: path.resolve(__dirname,"./public/dist"),
        filename: "index.bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }
        ]
    },
    plugins: [
        new WebpackPWAManifest({
            fingerprints: false,
            name: 'Budget Tracker',
            short_name: 'Budget Tracker',
            description: 'An application that allows you to track a budget, with offline support to handle areas where no service exists',
            background_color: '#01579b',
            theme_color: '#ffffff',
            'theme-color': '#ffffff',
            start_url: '/',
            icons: [
              {
                src: path.resolve('public/assets/icons/icon-512x512.png'),
                sizes: [192, 512],
                destination: path.join('assets', 'icons'),
              },
            ],
          }),
    ]
};


module.exports = config