import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'ID of the post' })
  id: number;

  @Column()
  @ApiProperty({
    example: 'Post title',
    description: 'Title of the post',
  })
  title: string;

  @Column('text')
  @ApiProperty({
    example: 'Post content',
    description: 'Full content of the post',
  })
  content: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2025-03-15T09:00:00.000Z',
    description: 'Creation date of the post',
  })
  createdAt: Date;
}
