import express, { request, response } from "express";
import { body, validationResult } from "express-validator"; // this one for validation of inputs " npm install express-validator"
import { employees } from "./employee/employee.js";
import session from "express-session"; // this one for session management and cookies "npm i express-session"
import cookieParser from "cookie-parser"; //this one for parsing cookie if cookie is not parse the value will be the key "ralph=rigor" " npm i cookie-parser"
import passport from "passport"; //npm i passport passport-local
import './src/strategies/local-strategies.mjs'

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser("santolorin")); //for parsing cookies, import cookieParser from "cookie-parser"; if you paass secretkey it will be the value is like secret

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "ralph the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize())// needs to use it after the session middleware "app.use(session)"
app.use(passport.session())


app.get("/", (request, response) => {
  //first param in cookie is the key then value, then the time expires
  // response.cookie('ralph', 'rigor', {maxAge: 60000 * 60, signed: true}) // signed true for signed cookies if this one is signed regular cookies wont work. if signed the value encrypted not regular "rigor value in the cookies tab in vbrowser"
  //  response.send('Home page with a cookie set.')

  console.log(request.session);
  console.log(`this is the session id ${request.sessionID}`);
  request.session.visited = true; //this one is for keeping the same ID and to not generate anymore
  response.send("");
});

app.post(
  "/api/login",
  [
    body("username").trim().notEmpty().withMessage("username is required"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("password must be atleast 6 characters"),
  ],
  (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(404).json({ errors: errors.array() });
    }
    response.send("login succesfully");
  }
);

app.get("/api/employee", (request, response) => {
  // response.send(employees)
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);
  // if(request.cookies.ralph && request.cookies.ralph === 'rigor') return response.send(employees); //this one is for not signed: true in cookies
  if (request.signedCookies.ralph && request.signedCookies.ralph === "rigor")
    return response.send(employees); // this signedCookie if you signed: true in the cookies

  return response
    .status(401)
    .send({ msg: "you need the right cookie to acces the employee list" });
});

app.get("/api/employee/login", (request, response) => {
  // const { body: {username, password}} = request;

  // const findEmployee = employees.find((name) => name.username === username)
  // if(!findEmployee || findEmployee !== password) return response.status(401).send({msg: 'BAD CREDENTIALS'})
  // return response.status(200).send(findEmployee)
  console.log(request.session);
  console.log(request.sessionID);
  request.session.visited = true;
  response.send("");
});
// ================== sample auththentication
app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;
  const findUser = employees.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "wrong credentials!" });

  request.session.user = findUser;
  console.log(request.session);
  console.log(request.sessionID);

  return response.status(200).send(findUser);
});
// =========  here is the status of authentication
app.get("/api/auth/status", (request, response) => {
  return request.session.user
    ? response.status(201).send(request.session.user)
    : response.status(401).send({ msg: "not authenticated!" });
});

// this one id for authentication if the user has a session id he can add item in the cart
app.post('/api/cart', (request,response) => {
if(!request.session.user) return response.sendStatus(401); //thi one checks if the user is authenticated
const { body: item} = request;
const {cart} = request.session;

if(cart) {
  cart.push(item)
} else {
  request.session.cart = [item]
}
return response.status(201).send(item)

})
// route for checking the item added in cart
app.get('/api/cart', (request, response) => {
  if(!request.session.user) return response.status(401).send({msg: 'you are not log in!'}); //this one check if user is authenticated,
  //if authenticated and has sessionId, this is the return
  return response.send(request.session.cart ?? []);
})

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
////////this route is for passport.js, this passport.authenticate('local') here you will pass "facebook", "discord", "google" depends on what strategy you used

app.post('/api/auth/login', passport.authenticate('local'), (request, response) => {
response.sendStatus(200)
})


//this route is for validating the status of the user
app.get('/api/auth/login/status', (request, response) =>{
  console.log('inside /api/auth/login/status')
  console.log(request.user)
  console.log(request.session)
  return request.user? response.send(request.user) : response.sendStatus(401);
})

//this route is for log out
app.post('/api/auth/logout', (request, response) => {
  if(!request.user) return response.sendStatus(401);
  request.logOut((err) => {
    if(err) return response.sendStatus(400)
    return response.send(200)
  })
})

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
