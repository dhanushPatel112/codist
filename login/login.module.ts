import { Module } from '@nestjs/common'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'

@Module({
    imports: [UserModule],
    controllers: [LoginController],
    providers: [LoginService, UserService]
})
export class LoginModule {}
