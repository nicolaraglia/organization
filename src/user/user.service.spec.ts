import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService; 
  //User Service depends on PrismaService, so we need to mock it
  const mockPrismaService = {
    user: { 

    create: jest.fn(),
    findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //test per signup
    it('should create a new user on signup', async () => {
      const userData = { email: 'test@example.com', password: 'password', role: 'user' };
      const hashedPassword = '$2b$10$qm9a/TVvuYT/ElpM6QIcUunakWJSU8LvL2C6GvD1D1iqy.K5fCN2W'; // example hashed password
      const userWithHashedPassword = { ...userData, password: hashedPassword };
      mockPrismaService.user.create.mockResolvedValue(userWithHashedPassword);
  
      const result = await service.signup(userData);
  
      expect(result.email).toEqual(userData.email);
      expect(result.password).toBeUndefined(); // la password non deve essere restituita
      expect(result.role).toEqual(userData.role);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: userData.email,
          role: userData.role,
        }),
      });
    });
    it('should throw ConflictException if email is already in use on signup', async () => {
      const userData = { email: 'test@example.com', password: 'password', role: 'user' };
      
      // Simulate that the email already exists
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, ...userData, password: 'hashed' });

      await expect(service.signup(userData)).rejects.toThrow('Email already in use');  
    });
});
