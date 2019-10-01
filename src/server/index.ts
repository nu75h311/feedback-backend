import express from 'express';
import cors from 'cors';
// import passport from 'passport';
// import session from 'express-session';
// import cookieParser from 'cookie-parser';

// import routes from '../routes';
// import models from '../models';

const host: string = process.env.HOST || 'localhost';
const port: number = parseInt(`${process.env.PORT}`, 10) || 4000;
const app = express();

// Application-Level middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN, // allow to server to accept request from different origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // allow session cookie from browser to pass through
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

// app.use(async (req, res, next) => {
//   req.context = {
//     models,
//   };
//   next();
// });

// Authorization middleware
// app.use(cookieParser());
// app.use(session({
//   secret: 'reviews',
//   resave: true,
//   saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
// app.use('/auth', routes.authRouter);
// app.use('/users', routes.userRouter);
// app.use('/reviews', routes.reviewRouter);

const serve = () => {
  app.listen(port, host, () => {
    console.log(`Running as ${process.env.NAME} environment on ${process.env.HOST}:${process.env.PORT}...`);
  });
};

export { serve };
