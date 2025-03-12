import { PrismaClient } from '@prisma/client';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

export const userSeeder = async (prisma: PrismaClient) => {
  enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  const data = [
    {
      username: 'admin',
      roleId: 1,
      firstName: 'Super',
      lastName: 'Admin',
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const id = generateId(50);
    const birthDate = new Date('1996-01-01 00:00:00');
    const gender = i % 2 === 0 ? GenderEnum.FEMALE : GenderEnum.MALE;

    const password = await new Argon2id().hash('admin123');
    const users = await prisma.user.upsert({
      where: { id },
      update: {
        username: user.username,
        password,
        roleId: user.roleId,
        profile: {
          update: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate,
            gender,
          },
        },
      },
      create: {
        id,
        username: user.username,
        password,
        roleId: user.roleId,
        profile: {
          create: {
            id: i + 1,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate,
            gender,
          },
        },
      },
    });
    console.log({ users });
  }
};