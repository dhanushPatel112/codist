import { Module } from '@nestjs/common'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'
import { UserModule } from 'src/user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/schemas/user.schema'

@Module({
    imports: [UserModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [LoginController],
    providers: [LoginService]
})
export class LoginModule {}
