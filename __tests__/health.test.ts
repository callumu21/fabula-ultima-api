import { buildServer } from '../src/server';

describe('GET /healthcheck', () => {
  it('should return status ok', async () => {
    const app = buildServer();

    const res = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });
});
