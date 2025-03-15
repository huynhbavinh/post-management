import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('likes')
export class LikeEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'ID of the like' })
  id: number;

  @Column()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID of the post',
  })
  postId: string;

  @Column()
  @ApiProperty({
    example: 'u1v2w3x4-y5z6-7a8b-9c0d-e1f2g3h4i5j6',
    description: 'ID of the user',
  })
  userId: string;
}
