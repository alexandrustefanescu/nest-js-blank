import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({
})
export class AuthService {
    constructor(private _prismaService: PrismaService) {}
    
    async signUp(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this._prismaService.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })
            delete user.hash;
    
            return user;
        } catch(err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken.'
                    );
                }
            }
            throw err;
        }
    }

    async signIn(dto: AuthDto) {
        const user = await this._prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect.');
        }

        const passwordMatches = await argon.verify(
            user.hash,
            dto.password
        )

        if (!passwordMatches) {
            throw new ForbiddenException('Credentials incorrect.')
        }

        delete user.hash;

        return user;
    }


}