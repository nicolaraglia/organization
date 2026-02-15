import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationPrismaMapper } from './organization-prisma.mapper';

describe('OrganizationService', () => {
  let service: OrganizationService;
  // Organization Service depends on PrismaService and OrganizationPrismaMapper, so we need to mock them
  const mockPrismaService = {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
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
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: OrganizationPrismaMapper,
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
