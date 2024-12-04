import { PrismaClient } from "@prisma/client";

export class User {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    async createUser() {
        const prisma = new PrismaClient();

        return await prisma.user.create({
            data: {
                email: this.email,
                password: this.password
            }
        });
    }

    static async getUsers() {
        const prisma = new PrismaClient();
        
        return await prisma.user.findMany();
    }
}