import express from "express";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import exphbs from "express-handlebars";
import { __dirname } from "./utils/utils.js";
import indexRouter from "./routers/index.router.js";
import sessionsRouter from "./routers/sessions.router.js";
import passport from "passport";
import { init as initPassportConfig } from "./config/passport.config.js";
import config from "./config/envConfig.js";
import cookieParser from "cookie-parser";
import { socketServer } from "./server.js";
import cors from "cors";
import nodemailer from "nodemailer";
import errorHandler from "./middlewares/errorHandler.js";
import { addLogger } from "./config/logger.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();
let mongo = "";
if (config.env === "dev") {
  mongo = config.db.URI_DEV;
} else {
  mongo = config.db.URI;
}
app.use(cookieParser(config.cookieSecret));
app.use(
  expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongo,
      mongoOptions: {},
      ttl: 120,
    }),
  })
);

const PORT = config.port;
app.use(
  cors({
    origin: `http://localhost:${PORT}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  })
);

app.use(addLogger);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "../../public")));

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce API",
      description: "API for the apple shop",
    },
  },
  apis: [`src/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(options);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

initPassportConfig();
app.use(passport.initialize());
app.use(passport.session());

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.nodemailer.email,
    pass: config.nodemailer.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.use(errorHandler);
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

app.use("/", indexRouter);
app.use("/auth", sessionsRouter);
export default app;
