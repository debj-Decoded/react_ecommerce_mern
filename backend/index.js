require('dotenv').config();

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const productsRouter = require('./router/Products')
const categoryRouter = require('./router/Category')
const brandRouter = require('./router/Brand')
const userRouter = require('./router/User')
const authRouter = require('./router/Auth')
const cartRouter = require('./router/Cart')
const orderRouter = require('./router/Order')
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

const passport = require('passport');
const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

//jwt strategy
const SecretKey = 'secret_key'
const opts = {}
opts.jwtFromRequest = cookieExtractor;
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SecretKey;


//middleware
const cors = require('cors')

main().catch(err => console.log(err))
async function main() {
  await mongoose.connect(process.env.Mongoose_URL);
}

//passport Authentication
server.use(cookieParser());
server.use(express.static('build'))
server.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
server.use(passport.authenticate('session'));

//user login authent
passport.use('local', new LocalStrategy(
  { usernameField: 'email' },
  async function (email, password, done) {
    try {
      const user = await User.findOne(
        { email: email });
      // console.log(username, password, user)
      // { email: username },).exec();
      if (!user) {
        return done(null, false, { message: 'Have not registered' })
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: 'invalid credentials' })
        }
        const token = jwt.sign(sanitizeUser(user), SecretKey);
        // done(null, { token })
        done(null, { id:user.id, role:user.role })
      })
    } catch (error) {
      res.status(400).json(error);
    }
  }
));

passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log(jwt_payload)
  const user = await User.findById(jwt_payload.id)
  // const user = await User.findOne({ id: jwt_payload.sub })
  try {
    if (user) {
      return done(null, sanitizeUser(user));
    } else {
      return done(null, false);
      // or you could create a new account
    }
  } catch (error) {
    if (err) {
      return done(err, false);
    }
  }

}));



passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, sanitizeUser(user));
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});



server.use(cors({
  exposedHeaders: ['X-Total-Count']
}))
server.use(express.json())//to parse req.body
server.use('/products', isAuth(), productsRouter.router)
server.use('/categories', isAuth(), categoryRouter.router)
server.use('/brands', isAuth(), brandRouter.router)
server.use('/users', isAuth(), userRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart', isAuth(), cartRouter.router)
server.use('/orders', isAuth(), orderRouter.router)
const { User } = require('./model/User');

//payment
//payment Intent

// This is your test secret API key.
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
  // const { items } = req.body;

  try {
    // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100,
  currency: "inr",
  description: "Order #1234 - Electronics purchase",
  automatic_payment_methods: { enabled: true },
  shipping: {
    name: "John Doe",
    address: {
      line1: "123 MG Road",
      city: "Bengaluru",
      state: "KA",
      postal_code: "560001",
      country: "IN",
    },
  },
});

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });

  }
  
});


//payment
//payment intent

server.get('/', (req, res) => {
  res.json({ status: "success" })
})



server.listen(process.env.PORT, () => {
  console.log("server started")
  console.log("recheck server started")
})