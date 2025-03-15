import { ThrottlerModule } from '@nestjs/throttler';
export const ThrottlerConfig = ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60,
      limit: 10,
    },
  ],
});
