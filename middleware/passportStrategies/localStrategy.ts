import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
        message: "Your login details are not valid. Please try again",
      });
  });

declare module 'express' {
  interface User {
    id: number,
    name: string,
    email: string,
    password: string,
  }
}

// Declaration merging

/*
FIX ME (types) 😭
*/
// Express.User is empty right now
passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  // @ts-ignore- temporary but not final solution.
  done(null, user.id);
});

/*
FIX ME (ID is still any) 😭
*/
passport.deserializeUser(function (id: any, done: (err: any, user?: Express.User | false | null) => void) {
  let user = getUserById(id);
  return user
    ? done(null, user)
    : done({ message: "User not found" }, null)
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
