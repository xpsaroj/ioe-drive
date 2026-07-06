import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { CLERK_CLIENT } from "./clerk.constants";
import { buildClerkClient } from "./clerk-client.factory";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CLERK_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildClerkClient(
          configService.getOrThrow<string>("CLERK_SECRET_KEY"),
          configService.getOrThrow<string>("CLERK_PUBLISHABLE_KEY"),
        ),
    },
  ],
  exports: [CLERK_CLIENT],
})
export class ClerkModule {}
