import { lucia } from '@/config/lucia';
import { findUserByUsername } from '@/repositories/user.repository';
import { Argon2id } from 'oslo/password';

export const validateUserCredentials = async (
  username: string,
  password: string,
) => {
  const existingUser = await findUserByUsername(username);

  if (!existingUser) return null;

  const isPasswordValid = await new Argon2id().verify(
    existingUser.password,
    password,
  );

  if (!isPasswordValid) return null;

  const { password: _, ...userWithoutPassword } = existingUser;

  return userWithoutPassword;
};

export const createUserSession = async (userId: string) => {
  await lucia.invalidateUserSessions(userId);

  const session = await lucia.createSession(userId, {});
  const cookie = lucia.createSessionCookie(session.id).serialize();

  return { token: session.id, cookie };
};

export const getUserSession = async (username: string) => {
  const existingUser = await findUserByUsername(username);

  if (!existingUser) return null;

  const { password: _, ...userWithoutPassword } = existingUser;

  return userWithoutPassword;
};
