import buildServer from '../server';
import prisma from '../lib/prisma';
import {
  createMockUser,
  createMockCharacter,
  createMockWeapon,
  createMockArmour,
  createMockClass,
  createMockSkill,
  createMockSpell,
} from './fixtures/mockData';
import { createSeedableCharacter, getTestToken, resetDb } from './utils';

describe('GET /characters/:id', () => {
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

  it("returns a single character with no equipment from the database that matches the player's id", async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create character

    const mockCharacter = createMockCharacter();

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: mockUser.id,
    });

    await prisma.character.create({
      data: seedableCharacter,
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('character');

    const { character } = body;

    expect(character).toEqual(mockCharacter);
  });

  it("returns a single character with correct equipment and stats from the database that matches the player's id", async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create equipment

    const mockWeapon = createMockWeapon({ id: 'super-weapon' });

    await prisma.weapon.create({ data: mockWeapon });

    const mockArmour = createMockArmour({
      id: 'super-armour',
      usesDex: false,
      dexBonus: 11,
      usesIns: true,
      insBonus: 1,
      initiativeBonus: -2,
    });

    await prisma.armour.create({ data: mockArmour });

    // create character

    const mockCharacter = createMockCharacter({
      defense: 11,
      magicDefense: 9,
      initiativeModifier: -2,
      equipment: {
        slots: { mainHand: mockWeapon, armour: mockArmour, offHand: null, accessory: null },
        backpack: [],
      },
    });

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: mockUser.id,
    });

    await prisma.character.create({
      data: seedableCharacter,
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('character');

    const { character } = body;

    expect(character).toEqual(mockCharacter);
  });

  it("returns a single character with correct class from the database that matches the player's id", async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create class

    const mockClass = createMockClass();

    await prisma.class.create({ data: mockClass });

    // create character

    const mockCharacter = createMockCharacter({ classes: [{ name: mockClass.name, level: 1 }] });

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: mockUser.id,
    });

    await prisma.character.create({
      data: {
        ...seedableCharacter,
        classLevels: {
          create: {
            level: 1,
            class: {
              connect: {
                id: mockClass.id,
              },
            },
          },
        },
      },
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('character');

    const { character } = body;

    expect(character).toEqual(mockCharacter);
  });

  it("returns a single character with correct skills from the database that matches the player's id", async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create class

    const mockClass = createMockClass();

    await prisma.class.create({ data: mockClass });

    // create skill

    const mockSkill = createMockSkill({ classId: mockClass.id });

    await prisma.skill.create({ data: mockSkill });

    // create character

    const mockCharacter = createMockCharacter({
      classes: [{ name: mockClass.name, level: 1 }],
      skills: [{ ...mockSkill, rank: 1 }],
    });

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: mockUser.id,
    });

    await prisma.character.create({
      data: {
        ...seedableCharacter,
        classLevels: {
          create: {
            level: 1,
            class: {
              connect: {
                id: mockClass.id,
              },
            },
          },
        },
        skills: {
          create: [
            {
              rank: 1,
              skill: {
                connect: {
                  id: mockSkill.id,
                },
              },
            },
          ],
        },
      },
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('character');

    const { character } = body;

    expect(character).toEqual(mockCharacter);
  });

  it("returns a single character with correct spells from the database that matches the player's id", async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create class

    const mockClass = createMockClass();

    await prisma.class.create({ data: mockClass });

    // create spell

    const mockSpell = createMockSpell({ classId: mockClass.id });

    await prisma.spell.create({ data: mockSpell });

    // create character

    const mockCharacter = createMockCharacter({
      classes: [{ name: mockClass.name, level: 1 }],
      spells: [mockSpell],
    });

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: mockUser.id,
    });

    await prisma.character.create({
      data: {
        ...seedableCharacter,
        classLevels: {
          create: {
            level: 1,
            class: {
              connect: {
                id: mockClass.id,
              },
            },
          },
        },
        spells: {
          create: [
            {
              spell: {
                connect: {
                  id: mockSpell.id,
                },
              },
            },
          ],
        },
      },
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('character');

    const { character } = body;

    expect(character).toEqual(mockCharacter);
  });

  it('returns 403 when attempting to retrieve a character whose player id does not match the userId on the request', async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const charactersUser = await prisma.user.create({
      data: createMockUser({ email: 'authentic-user@email.com' }),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    // create character

    const mockCharacter = createMockCharacter();

    const seedableCharacter = createSeedableCharacter({
      character: mockCharacter,
      userId: charactersUser.id,
    });

    await prisma.character.create({
      data: seedableCharacter,
    });

    const res = await server.inject({
      method: 'GET',
      url: `/characters/${mockCharacter.id}`,
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Invalid authorisation.');
  });

  it('returns a 404 when attempting to retrieve a character whose id does not exist', async () => {
    // create user

    const mockUser = await prisma.user.create({
      data: createMockUser(),
    });

    const validToken = getTestToken(server, { userId: mockUser.id });

    const res = await server.inject({
      method: 'GET',
      url: '/characters/1',
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);

    expect(body.msg).toBe('Character not found.');
  });
});
