require("dotenv").config({path : "../.env"});
const { PrismaPg } = require("@prisma/adapter-pg") 
const { PrismaClient } = require("../generated/prisma/client.js");



const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prismaController = new PrismaClient({ adapter });

module.exports =  {
    prismaController
}