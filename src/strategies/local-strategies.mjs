import passport from "passport";
import { Strategy } from "passport-local";
// import { employees } from "./employee/employee.js";
import { user } from "../mongoose/schemas/user.mjs"; // need to imporrt this for finding the user inside database
import { comparedPassword } from "../utils/helper.mjs";

// const employees = [
//   { id: 1, username: "ralph", password: "ralph123" },
//   { id: 2, username: "gadwin", password: "gadwin123" },
//   { id: 3, username: "shenron", password: "shenron123" },
// ];

//we need to to tell that passport use this strategy an instance it
// also this one called a verified function for veryfying inputs
//this usernameField option is if your input is using email not username: you can use that option usernameField: 'email'
export default passport.use(
  new Strategy(async (username, password, done) => {
    //take 3 argument, username, password and done
    console.log(`username :${username}`);
    console.log(`password :${password}`);

    try {
      // const findUser = employees.find((user) => user.username === username);
      // if (!findUser) throw new Error("user not found");
      // if (findUser.password !== password)
      //   throw new Error("passwornd not match!");

      //thi code block here check the usernamen in the database
      const findUser = await user.findOne({ username }); // this "user" comes from user model in the database
      if (!findUser) throw new Error("user not found!"); // need to use "!" the findOne() method can return a null value so use "1"
      // if (findUser.password !== password) throw Error("Password is incorrect!");

      //now this compared password is comparing password hashed to plaint text password in logging in
      if(!comparedPassword(password, findUser.password)) throw Error("Password is incorrect!");

      //done is if no error, null for no error, and finduser for the user that found
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);

//this function is  taking user object that we just validate it in  passport.use(new stategy(() => {})) and storing it in the session
passport.serializeUser((user, done) => {
  console.log("inisde serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("inisde Deserialize ");
  console.log(`deseriliazing user id: ${id}`);
  try {
    // const findUser = employees.find((user) => user.id === id);
    // if (!findUser) throw new Error("user id not found");
    // done(null, findUser);

    const findUser = await user.findById(id); // this findById() method looks the id in the database
    if (!findUser) throw new Error("user not found!");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});
