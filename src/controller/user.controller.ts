import{
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpException,
    HttpStatus,
    } from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm'
import{Repository} from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';


@Controller('users')
export class UserController{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
    ){}

    @Get()
    async findAllUsers():Promise<UserEntity[]>{
        return await this.userRepository.find();
    }


    @Get(':id')
    async findUserById(@Param('id') id:any):Promise<UserEntity>{
        const user= await this.userRepository.findOne(id);
        if(!user){
            throw new HttpException('User Not Found',HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Post()
    async createUser(@Body() user:UserEntity):Promise<UserEntity>{
        try {
            const newUser= await this.userRepository.save(user);
            return newUser;
        } catch (error) {
            throw new HttpException('Error Creating User', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async updateUser(@Param('id') id:any,@Body() user:UserEntity):Promise<UserEntity>{
        try {
            await this.userRepository.update(id,user);
            const updatedUser= await this.userRepository.findOne(id);
            if(!updatedUser){
                throw new HttpException('user not found', HttpStatus.NOT_FOUND)
            }
            return updatedUser;
        } catch (error) {
            throw new HttpException('Error Updating User', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id:number):Promise<void>{
        const user=await this.userRepository.findOne(id[id]);
        if(!user){
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.delete(id);
    }


}