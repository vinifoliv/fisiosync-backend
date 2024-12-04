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

        const result = await prisma.user.create({
            data: {
                email: this.email,
                password: this.password
            }
        });

        return 
    }
}