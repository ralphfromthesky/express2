// import { Router } from "express";
// import { user } from "../mongoose/schemas/user.mjs";

// const route = Router();

// route.post("/api/user", async (request, response) => {
//   const { body } = request;

//   const newUser = new user(body);
//   try {
//     const savedUser = await newUser.save();
//     return response.status(201).send(savedUser)
//   } catch (error) {
//     console.log(`Error: ${error}`);
//     return response.sendStatus(400)
//   }
// });
