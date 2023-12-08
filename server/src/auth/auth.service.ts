import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findOneByEmail(email)

            if (!(await bcrypt.compare(pass, user.password))) {
                return new UnauthorizedException()
            }

            const payload = { sub: user._id, email: user.email }
            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUser(req) {
        const user = await this.usersService.findOne(req.user.sub)
        if (!user) {
            return new BadRequestException('User not found')
        }
        user.password = undefined
        return user
    }
}
