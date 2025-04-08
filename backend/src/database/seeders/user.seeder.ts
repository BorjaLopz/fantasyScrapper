import { PrismaClient } from '@prisma/client';
import { Argon2id } from 'oslo/password';

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
    {
      username: 'laliga',
      roleId: 1,
      firstName: 'La Liga',
      lastName: 'EA Sports',
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const user = data[i];
    const birthDate = new Date('1996-01-01 00:00:00');
    const gender = i % 2 === 0 ? GenderEnum.FEMALE : GenderEnum.MALE;

    const password = await new Argon2id().hash(data[i].username + '123');
    const users = await prisma.user.create({
      data: {
        username: user.username,
        password,
        roleId: user.roleId,
        profile: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate,
            gender,
          },
        },
        bank: {
          create: {
            quantity: 100000000000000
          }
        }
      },
    });
    console.log({ users });
  }
};