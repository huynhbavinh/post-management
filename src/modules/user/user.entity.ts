import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID of the user',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
  })
  email: string;

  @Column()
  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  password: string;

  @OneToMany(() => Post, (post) => post.createdBy)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
