import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default prisma;

// TODO: implement a DB-service layer that sits between the API layer and the DB layer,
// that accepts CRUD parameters and performs the data-operations.
// This is to prevent API layer from directly interacting with the DB layer.
