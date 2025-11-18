import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { UserEntity } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserDto } from '../dtos/responses/user.dto';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      this.logger.log(`User with email ${email} doest not exist`);
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { email, firstName, lastName } = createUserDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const cleanFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/\s+/g, '');
    const randomNum = Math.floor(Math.random() * 99) + 1;
    const userName = `${cleanFirstName}${cleanLastName}${randomNum}`;

    await this.prismaService.user.create({
      data: {
        ...createUserDto,
        userName,
        password: await this.bcryptPassword(createUserDto.password),
        createdAt: new Date(),
      },
    });

    this.logger.log('User created successfully');
  }

  async update(
    userId: string,
    updateUserInput: UpdateUserDto,
  ): Promise<UserDto> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...updateUserInput },
    });

    this.logger.log(`User updated successfully`);
    return plainToInstance(UserEntity, updatedUser);
  }

  async bcryptPassword(password: string): Promise<string> {
    const salt: string = await genSalt();
    return hash(password, salt);
  }
}
