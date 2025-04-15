import { beforeEach, describe, expect, it } from 'vitest';

import { HashAdapter, type IHashAdapter } from '@/adapters';
import { InMemoryTokensRepository } from '@/repositories/in-memory/tokens.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from './create-account.service';
import { RequestRecoveryPasswordService } from './request-recovery-password.service';

let hashAdapter: IHashAdapter;
let usersRepository: InMemoryUsersRepository;
let tokensRepository: InMemoryTokensRepository;
let createAccountService: CreateAccountService;
let requestRecoveryPasswordService: RequestRecoveryPasswordService;

describe('Request recovery password service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    tokensRepository = new InMemoryTokensRepository();
    hashAdapter = new HashAdapter();
    createAccountService = new CreateAccountService(
      usersRepository,
      hashAdapter
    );
    requestRecoveryPasswordService = new RequestRecoveryPasswordService(
      usersRepository,
      tokensRepository
    );

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });
  });

  it('should be able to request a new recovery password with a valid e-mail', async () => {
    const { user, urlToRecovery } =
      await requestRecoveryPasswordService.execute({
        email: usersRepository.users[0]!.email,
      });

    expect(user!.id).toEqual(expect.any(String));
    expect(urlToRecovery!).toEqual(expect.any(String));
  });

  it('should not be able to request a new recovery password with a invalid e-mail', async () => {
    const { user, urlToRecovery } =
      await requestRecoveryPasswordService.execute({
        email: 'failed.email@finebank.dev',
      });

    expect(user).toEqual(null);
    expect(urlToRecovery).toEqual(null);
  });

  it('should be able to exist in urlToRecovery a searchParams called code', async () => {
    const { urlToRecovery } = await requestRecoveryPasswordService.execute({
      email: usersRepository.users[0]!.email,
    });

    const url = new URL(urlToRecovery!);

    const searchParamCode = url.searchParams.get('code');

    expect(searchParamCode).toEqual(expect.any(String));
  });
});
