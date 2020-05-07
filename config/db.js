const dotenv=require('dotenv');
dotenv.config();

module.exports = {
    mongoDbUrl:process.env.DATABASE_URL
}