import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as bcrypt from 'bcrypt'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    _id: string

    @Prop()
    name: string

    @Prop({ unique: true })
    email: string

    @Prop()
    mobile: string

    @Prop()
    password: string
}

const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ name: 'text', email: 'text', mobile: 'text' })

UserSchema.pre('save', async function (next) {
    const user = this as UserDocument

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)

        user.password = hashedPassword
        next()
    } catch (error) {
        return next(error)
    }
})

export { UserSchema }
