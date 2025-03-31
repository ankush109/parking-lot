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
    await request(app.getHttpServer())
      .post('/parking-lot')
      .send({ number_of_slots: 10 })
      .expect(201);
    await request(app.getHttpServer())
      .post("/parking-lot/park")
      .send(
        {
          "car_reg_no": "WB012009",
          "car_color": "red"
        })

  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it("should give all the registered numbers given the color", async () => {
    const response = await request(app.getHttpServer())
      .get("/parking-lot/registration_numbers/red")
      .expect(200)
    expect(response.body).toContain("WB012009");
  })
  it("should park a car given available slots", async () => {
    const response = await request(app.getHttpServer())

      .post("/parking-lot/park")
      .send(
        {
          "car_reg_no": "WB0120010",
          "car_color": "red"
        }
      ).expect(201)


    expect(response.body).toHaveProperty('allocated_slot_number');
  })
  it("should clear a slot given the slot is not free", async () => {
    const response = await request(app.getHttpServer())

      .post("/parking-lot/clear")
      .send(
        {
          "slot_number": 1
        }
      ).expect(201)
   
    expect(response.body).toHaveProperty('freed_slot_number');
    expect(response.body.freed_slot_number).toBe(1);
  })


});
