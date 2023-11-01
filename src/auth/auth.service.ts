import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: MongoRepository<User>,
  ) {}

  // Create User
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('hashedPassword', hashedPassword);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      console.log(error.code); // 23505 => 這是用戶重複的Error代碼
      if (error.code === '23505') {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
