// to use env vars in development,
// you can use dotrnv library like this:

// import dotenv from 'dotenv'
// dotenv.config()

// or add a flag to run script
// node --env-file=.env server.js

export default {
    dbURL: process.env.DB_URL,
    dbName: process.env.DB_NAME
}