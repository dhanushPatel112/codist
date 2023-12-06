import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { LoginService } from './login.service'
import { MongoIdDto } from '../user/dto/mongoId.dto'
import { LoginDto } from './dto/login.dto'

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Post()
    async login(@Body() loginDto: LoginDto) {
        return await this.loginService.login(loginDto)
    }

    @Get(':id')
    async profile(@Param() { id }: MongoIdDto) {
        return this.loginService.profile(id)
    }
}
