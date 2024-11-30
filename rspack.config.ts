import type { Configuration } from "@rspack/cli";
import { CssExtractRspackPlugin, HtmlRspackPlugin } from "@rspack/core";

const isDev = process.env.NODE_ENV === "development";

const common: Configuration = {
  mode: isDev ? "development" : "production",
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  externals: ["fsevents"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
            transform: {
              react: {
                runtime: "automatic",
              },
            },
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [CssExtractRspackPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|eot|ttf|woff)$/,
        type: "asset/resource",
      },
    ],
  },
  stats: "summary",
  watch: isDev,
  devtool: isDev ? "source-map" : false,
};

const main: Configuration = {
  ...common,
  target: "electron-main",
  entry: {
    main: "./src/main.ts",
  },
};

const preload: Configuration = {
  ...common,
  target: "electron-preload",
  entry: {
    preload: "./src/preload.ts",
  },
};

const renderer: Configuration = {
  ...common,
  target: "web",
  entry: {
    index: "./src/web/index.tsx",
  },
  plugins: [
    new CssExtractRspackPlugin(),
    new HtmlRspackPlugin({
      inject: "body",
      template: "./src/web/index.html",
    }),
  ],
};

export default [main, preload, renderer];
