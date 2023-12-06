import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, SortOrder } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './schemas/user.schema'
import { Request } from 'express'
import { FindAllQuery } from './dto/findAllQuery-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const createdUser = await this.userModel.create(createUserDto)
            return createdUser
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException('Email must be unique', HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update(updateUserDto: UpdateUserDto): Promise<User | HttpException> {
        try {
            const foundUser = await this.userModel.findById(updateUserDto.id)
            if (!foundUser) {
                return new HttpException('User not found', HttpStatus.BAD_REQUEST)
            }

            const user = updateUserDto as Partial<UpdateUserDto> & { password: string }
            if (updateUserDto.oldPassword && updateUserDto.newPassword) {
                if (!(await bcrypt.compare(updateUserDto.oldPassword, foundUser.password))) {
                    return new HttpException("Old password didn't match", HttpStatus.BAD_REQUEST)
                }

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, salt)

                user.password = hashedPassword
                delete user.oldPassword
                delete user.newPassword
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(user.id, user, { new: true })

            return updatedUser
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException('Email must be unique', HttpStatus.BAD_REQUEST)
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAll(req: Request) {
        const { limit = '10', page = '1', sortBy = 'name', sortOrder = 'asc', search } = req.query as unknown as FindAllQuery

        // Build query for searching
        const searchQuery: FilterQuery<User> = {}
        searchQuery.$or = [{ name: new RegExp(search) }, { email: new RegExp(search) }, { mobile: new RegExp(search) }]

        // Build query for sorting
        const sortQuery = { [sortBy]: (sortOrder === 'asc' ? 1 : -1) as SortOrder }

        // Calculate skip value for pagination
        const skip = parseInt(page) * parseInt(limit)

        const users = await this.userModel.find(searchQuery).sort(sortQuery).skip(skip).limit(parseInt(limit)).exec()
        const totalCount = await this.userModel.find(searchQuery).sort(sortQuery).countDocuments()

        return { users, totalCount }
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ _id: id })
            if (!user) throw new Error('User not found')
            return user
        } catch (error) {
            throw new HttpException(
                error.message,
                error.message === 'User not found' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ email })
            if (!user) throw new Error('User not found')
            return user
        } catch (error) {
            throw new HttpException(
                error.message,
                error.message === 'User not found' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async delete(id: string) {
        const deletedUser = await this.userModel.deleteOne({ _id: id }).exec()
        if (deletedUser.deletedCount === 0) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        return deletedUser
    }
}
