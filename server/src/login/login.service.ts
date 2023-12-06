import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { User } from 'src/user/schemas/user.schema'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service'

@Injectable()
export class LoginService {
    constructor(private userService: UserService) {}

    async login(loginDto: LoginDto): Promise<string | HttpException> {
        try {
            const createdLogin = await this.userService.findOneByEmail(loginDto.email)

            if (!createdLogin) {
                return new HttpException('User not found', HttpStatus.NOT_FOUND)
            }

            if (!(await bcrypt.compare(loginDto.password, createdLogin.password))) {
                return new HttpException("Password didn't match", HttpStatus.BAD_REQUEST)
            }

            return 'LoggedIn Successfully'
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException('Email must be unique', HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async profile(id: string): Promise<User | HttpException> {
        try {
            const user = await this.userService.findOne(id)
            if (!user) return new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR)
            return user
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
