import passport from "passport";
import { Strategy } from "passport-local";
// import { employees } from "./employee/employee.js";

const employees = [
  { id: 1, username: "ralph", password: "ralph123" },
  { id: 2, username: "gadwin", password: "gadwin123" },
  { id: 3, username: "shenron", password: "shenron123" },
];



//we need to to tell that passport use this strategy an instance it
//this usernameField option is if your input is using email not username: you can use that option usernameField: 'email'
export default passport.use(
  new Strategy((username, password, done) => {
    //take 3 argument, username, password and done
    console.log(`username :${username}`);
    console.log(`password :${password}`);

    try {
      const findUser = employees.find((user) => user.username === username);
      if (!findUser) throw new Error("user not found");
      if (findUser.password !== password)
        throw new Error("passwornd not match!");
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



passport.deserializeUser((id, done) => {
  console.log("inisde Deserialize ");
  console.log(`deseriliazing user id: ${id}`);
  try {
    // const findUser = employees.find((user) => user.id === id);
    // if (!findUser) throw new Error("user id not found");
    // done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});
