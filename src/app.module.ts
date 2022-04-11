import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

import { ClientSocketModule } from './client-socket/client-socket.module';
import { XtbApiService } from './xtb-api/xtb-api.service';

@Module({
   imports: [
      ClientSocketModule,
      ConfigModule.forRoot({ isGlobal: true })
   ],
   controllers: [AppController],
   providers: [XtbApiService],
})
export class AppModule {}
