import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { EnvService } from 'src/shared/env.service';

@Module({
  imports: [ConfigModule],
  providers: [EnvService],
  exports: [EnvService]
})
export class EnvModule { }