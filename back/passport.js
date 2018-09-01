const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const jwtSecret = require('@auth/jwt-secret')

const fieldConfig = { usernameField: 'email', passwordField: 'password' }

passport.use(new LocalStrategy(fieldConfig,
  async (email, password, cb) => {
    let user
    // this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    try {
      user = await getUser({email, password})
    } catch (err) {
      cb(err)
    }
    if (user) return cb(null, user, {message: 'Logged in successfully'})
    return cb(null, false, {message: 'Incorrect email or password'})
  }
))

passport.use(new JWTStrategy({ jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: jwtSecret },
  async (jwtPayload, cb) => {
    // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    let user
    try {
      user = await getUserById(jwtPayload.id)
      cb(null, user)
    } catch (err) {
      cb(err)
    }
  }
))

function getUser (credentials) {
  return new Promise((resolve, reject) => resolve(true))
}

function getUserById (credentials) {
  return new Promise((resolve, reject) => resolve(true))
}
