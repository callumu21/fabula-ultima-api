import buildServer from '../src/server';
import prisma from '../src/lib/prisma';

describe('GET /classes', () => {
  const server = buildServer();

  beforeAll(async () => {
    await server.ready();
  });

  beforeEach(async () => {
    const tableNames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const truncationPromises = tableNames.map(({ tablename }) => {
      if (tablename !== '_prisma_migrations') {
        return prisma
          .$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
          .catch((err) => {
            console.error(err);
          });
      }
      return null;
    });

    await Promise.all(truncationPromises);
  });

  afterAll(async () => {
    await server.close();
    return prisma.$disconnect();
  });

  it('returns a single class from the database in an array', async () => {
    const mockClass = {
      id: 'test-class-id',
      name: 'Test Class',
    };

    await prisma.class.create({
      data: mockClass,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);

    const { classes } = body;

    expect(classes).toHaveLength(1);
    expect(classes[0]).toEqual(mockClass);
  });

  it('returns all skills from the database in an array', async () => {
    const mockClass1 = {
      id: 'test-class-id-1',
      name: 'Test Class 1',
    };

    const mockClass2 = {
      id: 'test-class-id-2',
      name: 'Test Class 2',
    };

    await prisma.class.createMany({
      data: [mockClass1, mockClass2],
    });

    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);

    const { classes } = body;

    expect(classes).toHaveLength(2);
    expect(classes[0]).toEqual(mockClass1);
    expect(classes[1]).toEqual(mockClass2);
  });

  it('returns an empty array if no skills are in the database', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/classes',
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(Array.isArray(body.classes)).toBe(true);
    expect(body.classes).toHaveLength(0);
  });
});
