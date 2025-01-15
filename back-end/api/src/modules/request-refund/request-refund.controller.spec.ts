import { Test, TestingModule } from '@nestjs/testing';
import { RequestRefundController } from './request-refund-customer.controller';
import { RequestRefundService } from './request-refund.service';

describe('RequestRefundController', () => {
  let controller: RequestRefundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestRefundController],
      providers: [RequestRefundService],
    }).compile();

    controller = module.get<RequestRefundController>(RequestRefundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
