import { Test, TestingModule } from '@nestjs/testing';
import { RequestRefundService } from './request-refund.service';

describe('RequestRefundService', () => {
  let service: RequestRefundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestRefundService],
    }).compile();

    service = module.get<RequestRefundService>(RequestRefundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
