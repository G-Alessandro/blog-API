// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');

// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username });
//       const match = await bcrypt.compare(password, user.password);

//       if (!user) {
//         return done(null, false, { message: 'Incorrect username' });
//       }
//       if (!match) {
//         return done(null, false, { message: 'Incorrect password' });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }),
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// module.exports = passport;
