import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { LoginModule } from './login/login.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/codist'),
        UserModule,
        LoginModule
    ]
})
export class AppModule {}
