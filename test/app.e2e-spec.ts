import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello Worl!');
  });
  it('should initialize parking slots', async () => {
    const response = await request(app.getHttpServer())
      .post('/parking-lot')
      .send({ number_of_slots: 10 })
      .expect(201); // Expect HTTP 201 (Created)

    // Ensure response structure is correct
    expect(response.body).toHaveProperty('total_slots');
    expect(response.body.total_slots).toBe(10);
  });
});
