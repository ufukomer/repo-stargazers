import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import webpack = require('webpack');

/**
 * The Server Interface.
 *
 * @interface IServer
 */
interface IServer {
  config(): void;
  routes(): void;
}

/**
 * The server.
 *
 * @class Server
 */
class Server implements IServer {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  /**
   * Configures application.
   *
   * @class Server
   * @method config
   * @return void
   */
  public config() {
    if (process.env.NODE_ENV !== 'production') {
      const webpack = require('webpack');
      const webpackDevMiddleware = require('webpack-dev-middleware');
      const webpackHotMiddleware = require('webpack-hot-middleware');
      const webpackConfig = require('../../config/webpack/dev.js');
      const compiler = webpack(webpackConfig);

      this.app.use(webpackDevMiddleware(compiler, {
        lazy: false,
        quiet: true,
        inline: true,
        noInfo: true,
        stats: { colors: true },
        historyApiFallback: true,
        publicPath: webpackConfig.output.publicPath
      }));

      this.app.use(webpackHotMiddleware(compiler));
    }

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../../build/public/')));
  }

  /**
   * Configures routes.
   *
   * @class Server
   * @method routes
   * @return void
   */
  public routes() {
    require('./routes/routes.ts')(this.app);
  }
}

const server = Server.bootstrap();
export = server.app;
