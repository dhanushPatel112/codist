import { IsEmail, IsStrongPassword } from 'class-validator'

export class LoginDto {
    @IsEmail({}, { message: 'Email is not valid' })
    email: number

    @IsStrongPassword()
    password: string
}
