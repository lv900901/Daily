// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const path = require('path');

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  chainWebpack(memo: any, { env, webpack, createCSSRule }: any) {
    memo.module.rule('swf').test(/\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/).use('file').loader('url-loader').options({limit: 1024, name: 'file/[path][name].[hash:7].[ext]'});
    memo.resolve.modules.clear().add(path.resolve('node_modules')).add('node_modules');
    // memo.plugin('ProvidePlugin').use(new webpack.ProvidePlugin({ videojs: 'video.js' }));
    console.log(memo.resolve.modules.values());
  },
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Day Day Up',
    locale: true,
    siderWidth: 288,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
