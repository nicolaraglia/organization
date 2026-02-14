import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';

describe('OrganizationService', () => {
  let service: OrganizationService;
  // Organization Service depends on OrganizationPrismaService, so we need to mock it
  const mockOrganizationPrismaService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };    

  const mockMapper = {
  toCreateData: jest.fn(),
  toUpdateData: jest.fn(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: 'OrganizationPrismaService',
          useValue: mockOrganizationPrismaService,
        },
        {
          provide: 'OrganizationMapper',
          useValue: mockMapper,
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
