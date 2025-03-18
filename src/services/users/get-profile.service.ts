import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import type {
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface GetProfileServiceRequest {
  userId: string;
}

interface GetProfileServiceResponse {
  userProfile: UserDTO;
}

export class GetProfileService {
  constructor(private userRepository: IUsersRepository) {}

  async execute(
    data: GetProfileServiceRequest
  ): Promise<GetProfileServiceResponse> {
    const { userId } = data;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { userProfile: user };
  }
}

export const makeWithPrismaGetProfileService = () => {
  const userRepository = new PrismaUsersRepository();
  const getProfileService = new GetProfileService(userRepository);
  return getProfileService;
};
