import { Injectable, NotFoundException } from "@nestjs/common";

import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findPublicProfileById(userId: number) {
    const profile = await this.usersRepository.findPublicProfileById(userId);

    if (!profile) {
      throw new NotFoundException("User not found");
    }

    return profile;
  }
}
