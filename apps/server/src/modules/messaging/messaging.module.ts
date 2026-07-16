import { Module } from "@nestjs/common";

import { MarketplaceModule } from "../marketplace/marketplace.module";
import { MessagingController } from "./messaging.controller";
import { MessagingGateway } from "./messaging.gateway";
import { MessagingRepository } from "./messaging.repository";
import { MessagingService } from "./messaging.service";

@Module({
  imports: [MarketplaceModule],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingRepository, MessagingGateway],
  exports: [MessagingService],
})
export class MessagingModule {}
