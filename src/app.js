import express from 'express';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import passport from 'passport';

import { __dirname } from './utils/utils.js';
import config from './config/envConfig.js';
import errorHandler from './middlewares/errorHandler.js';
import { init as initPassportConfig } from './config/passport.config.js';
import { socketServer } from './server.js';
import indexRouter from './routers/index.router.js';
import sessionsRouter from './routers/sessions.router.js';

const app = express();

// Middleware
app.use(cookieParser(config.cookieSecret));
app.use(
  expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: config.db.URI,
      mongoOptions: {},
      ttl: 120,
    }),
  })
);

app.use(
  cors({
    origin: `http://localhost:${config.port}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

// Handlebars setup
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

// Passport configuration
initPassportConfig();
app.use(passport.initialize());
app.use(passport.session());

// Nodemailer setup
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailer.email,
    pass: config.nodemailer.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Custom middleware
app.use(errorHandler);
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

// Routers
app.use('/', indexRouter);
app.use('/auth', sessionsRouter);

export default app;
