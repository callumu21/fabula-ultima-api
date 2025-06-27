import buildServer from '../server';
import prisma from '../lib/prisma';
import { getTestToken, resetDb } from './utils';
import { createMockUser } from './fixtures/mockData';
import { hashPassword } from '../utils/auth';

describe('POST /auth/register', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('creates a new user when providing a valid email and password with the ADMIN role', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      email: 'valid@email.com',
      password: 'abc123def456',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);

    expect(body.user).toEqual({
      id: expect.any(Number),
      email: newUserPayload.email,
    });
  });

  it('returns 400 if payload is valid but email address is taken', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const mockUser = createMockUser();

    const existingUser = await server.prisma.user.create({ data: mockUser });

    const newUserPayload = {
      email: existingUser.email,
      password: 'abc123def456',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({ msg: 'User already exists.' });
  });

  it('returns 400 and missing email error message if payload has no email and role is ADMIN', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      password: 'abc123def456',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'email'",
      statusCode: 400,
    });
  });

  it('returns 400 and invalid email error message if payload has invalid email and role is ADMIN', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      email: 'asjh',
      password: 'abc123def456',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      // prettier-ignore
      message: "body/email must match format \"email\"",
      statusCode: 400,
    });
  });

  it('returns 400 and missing password error message if payload has no password and role is ADMIN', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      email: 'asjh',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: "body must have required property 'password'",
      statusCode: 400,
    });
  });

  it('returns 400 and invalid password error message if payload has password less than 8 characters and role is ADMIN', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      email: 'user@email.com',
      password: 'abc123',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/password must NOT have fewer than 8 characters',
      statusCode: 400,
    });
  });

  it('returns 400 and invalid password error message if payload has password more than 40 characters and role is ADMIN', async () => {
    const validToken = getTestToken(server, { role: 'ADMIN' });

    const newUserPayload = {
      email: 'user@email.com',
      password: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/password must NOT have more than 40 characters',
      statusCode: 400,
    });
  });

  it('returns 403 and error message if payload is valid but token role is PLAYER', async () => {
    const validToken = getTestToken(server, { role: 'PLAYER' });

    const newUserPayload = {
      email: 'user@email.com',
      password: 'password123',
    };

    const res = await server.inject({
      method: 'POST',
      url: '/auth/register',
      body: newUserPayload,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(403);

    const body = JSON.parse(res.body);

    expect(body).toEqual({
      msg: 'Invalid authorisation.',
    });
  });
});

describe('POST /auth/login', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('logs in an existing user with valid credentials', async () => {
    const mockUser = createMockUser({
      email: 'example@email.com',
      password: await hashPassword('password123'),
    });

    await prisma.user.create({ data: mockUser });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: mockUser.email,
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);

    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  it('returns 401 if email address is invalid', async () => {
    const mockUser = createMockUser({
      email: 'example@email.com',
      password: await hashPassword('password123'),
    });

    await prisma.user.create({ data: mockUser });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: 'not-an-email@email.com',
        password: 'password123',
      },
    });

    expect(res.statusCode).toBe(401);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid credentials.');
  });

  it('returns 401 if password is invalid', async () => {
    const mockUser = createMockUser({
      email: 'example@email.com',
      password: await hashPassword('password123'),
    });

    await prisma.user.create({ data: mockUser });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: mockUser.email,
        password: '123password',
      },
    });

    expect(res.statusCode).toBe(401);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid credentials.');
  });

  it('returns 401 if email address is missing from payload', async () => {
    const mockUser = createMockUser({
      email: 'example@email.com',
      password: await hashPassword('password123'),
    });

    await prisma.user.create({ data: mockUser });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/login',
      body: {
        password: '123password',
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Missing credentials.');
  });

  it('returns 401 if password is missing from payload', async () => {
    const mockUser = createMockUser({
      email: 'example@email.com',
      password: await hashPassword('password123'),
    });

    await prisma.user.create({ data: mockUser });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: mockUser.email,
      },
    });

    expect(res.statusCode).toBe(400);

    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Missing credentials.');
  });
});
