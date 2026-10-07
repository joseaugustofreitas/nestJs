import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    data.password = data.password;

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    return this.prisma.users.create({
      data,
    });
  }

  async list() {
    return this.prisma.users.findMany({});
  }

  async show(id: number) {
    await this.exists(id);
    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    { name, email, password, birtAt, role }: UpdatePutUserDTO,
  ) {
    await this.exists(id);
    console.log(name, email, password, birtAt, role);

    password = password;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    if (!birtAt) {
      birtAt = null;
    }
    return this.prisma.users.update({
      data: {
        name,
        email,
        password,
        birthAt: birtAt ? new Date(birtAt) : null,
        role,
      },
      where: {
        id,
      },
    });
  }

  async updatePartial(
    id: number,
    { name, email, password, birtAt, role }: UpdatePatchUserDTO,
  ) {
    await this.exists(id);
    const data: any = {};
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
    }
    if (birtAt) {
      data.birtAt = new Date(birtAt);
    }
    if (role) {
      data.role = new Date(birtAt);
    }
    return this.prisma.users.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.users.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
