import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  console.log(`this is the salt: ${salt}`);
  return bcrypt.hashSync(password, salt);
};

//this function for comparring hashed password
//first parameter is the plain comparring to second parameter hashed
export const comparedPassword = (plain, hashed) =>  bcrypt.compareSync(plain, hashed);


