import { Module } from "@nestjs/common";

import { ResourcesModule } from "../resources/resources.module";
import { UsersModule } from "../users/users.module";
import { MeController } from "./me.controller";
import { MeRepository } from "./me.repository";
import { MeService } from "./me.service";

@Module({
  imports: [UsersModule, ResourcesModule],
  controllers: [MeController],
  providers: [MeService, MeRepository],
})
export class MeModule {}
