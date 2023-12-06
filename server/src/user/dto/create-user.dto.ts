import { IsEmail, IsNumberString, IsString, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
    @IsString({ message: 'Name is not valid' })
    name: string

    @IsEmail({}, { message: 'Email is not valid' })
    email: number

    @IsNumberString({}, { message: 'Mobile number is not valid' })
    mobile: string

    @IsStrongPassword()
    password: string
}
