import { IsEmail, IsMongoId, IsNumberString, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class UpdateUserDto {
    @IsMongoId({ message: 'Id is not valid' })
    id: string

    @IsOptional()
    @IsString({ message: 'Name is not valid' })
    name: string

    @IsOptional()
    @IsEmail({}, { message: 'Email is not valid' })
    email: string

    @IsOptional()
    @IsNumberString({}, { message: 'Mobile number is not valid' })
    mobile: string

    @IsOptional()
    oldPassword: string

    @IsOptional()
    @IsStrongPassword()
    newPassword: string
}
