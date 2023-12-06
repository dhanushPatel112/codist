import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './schemas/user.schema'
import { Request } from 'express'
import { UpdateUserDto } from './dto/update-user.dto'
import { MongoIdDto } from './dto/mongoId.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto)
    }

    @Put()
    async update(@Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(updateUserDto)
    }

    @Get()
    async findAll(@Req() req: Request) {
        return this.userService.findAll(req)
    }

    @Get(':id')
    async findOne(@Param() { id }: MongoIdDto): Promise<User> {
        return this.userService.findOne(id)
    }

    @Delete(':id')
    async delete(@Param() { id }: MongoIdDto) {
        return this.userService.delete(id)
    }
}
