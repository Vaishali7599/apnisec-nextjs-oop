import { PrismaFactory } from '../db/prisma';
import { ResponseBuilder } from './response';
import { MemoryRateLimiter } from '../rateLimit/RateLimiter';
import { CryptoUtil } from '../utils/CryptoUtil';
import { JwtService } from '../auth/JwtService';
import { PasswordService } from '../auth/PasswordService';
import { UserRepository } from '../users/UserRepository';
import { RefreshTokenRepository } from '../auth/RefreshTokenRepository';
import { AuthService } from '../auth/AuthService';
import { AuthGuard } from '../auth/AuthGuard';
import { AuthValidator } from '../auth/AuthValidator';
import { ResendEmailService } from '../email/EmailService';
import { ProfileValidator } from '../users/ProfileValidator';
import { ProfileService } from '../users/ProfileService';
import { IssueRepository } from '../issues/IssueRepository';
import { IssueValidator } from '../issues/IssueValidator';
import { IssueService } from '../issues/IssueService';
import { NoteRepository } from '../notes/NoteRepository';
import { NoteValidator } from '../notes/NoteValidator';
import { NoteService } from '../notes/NoteService';

export class Container {
  private static instance: Container;
  public static get(): Container {
    if (!Container.instance) Container.instance = new Container();
    return Container.instance;
  }

  // Singletons
  private _prisma = new PrismaFactory().create();
  private _response = new ResponseBuilder();
  private _rateLimiter = new MemoryRateLimiter();
  private _crypto = new CryptoUtil();
  private _jwt?: JwtService;
  private _passwords?: PasswordService;
  private _email?: ResendEmailService;

  private _userRepo?: UserRepository;
  private _refreshRepo?: RefreshTokenRepository;
  private _issueRepo?: IssueRepository;
  private _noteRepo?: NoteRepository;

  private _authValidator = new AuthValidator();
  private _profileValidator = new ProfileValidator();
  private _issueValidator = new IssueValidator();
  private _noteValidator = new NoteValidator();

  private _authService?: AuthService;
  private _authGuard?: AuthGuard;
  private _profileService?: ProfileService;
  private _issueService?: IssueService;
  private _noteService?: NoteService;

  public get prisma() {
    return this._prisma;
  }
  public get response() {
    return this._response;
  }
  public get rateLimiter() {
    return this._rateLimiter;
  }
  public get crypto() {
    return this._crypto;
  }

  public get jwt() {
    if (!this._jwt) this._jwt = new JwtService();
    return this._jwt;
  }
  public get passwords() {
    if (!this._passwords) this._passwords = new PasswordService();
    return this._passwords;
  }
  public get email() {
    if (!this._email) this._email = new ResendEmailService();
    return this._email;
  }

  public get userRepo() {
    if (!this._userRepo) this._userRepo = new UserRepository(this.prisma);
    return this._userRepo;
  }
  public get refreshRepo() {
    if (!this._refreshRepo) this._refreshRepo = new RefreshTokenRepository(this.prisma);
    return this._refreshRepo;
  }
  public get issueRepo() {
    if (!this._issueRepo) this._issueRepo = new IssueRepository(this.prisma);
    return this._issueRepo;
  }
  public get noteRepo() {
    if (!this._noteRepo) this._noteRepo = new NoteRepository(this.prisma);
    return this._noteRepo;
  }

  public get authValidator() {
    return this._authValidator;
  }
  public get profileValidator() {
    return this._profileValidator;
  }
  public get issueValidator() {
    return this._issueValidator;
  }
  public get noteValidator() {
    return this._noteValidator;
  }

  public get authService() {
    if (!this._authService) {
      this._authService = new AuthService(
        this.userRepo,
        this.passwords,
        this.jwt,
        this.refreshRepo,
        this.crypto,
        this.email
      );
    }
    return this._authService;
  }

  public get authGuard() {
    if (!this._authGuard) this._authGuard = new AuthGuard(this.authService);
    return this._authGuard;
  }

  public get profileService() {
    if (!this._profileService) this._profileService = new ProfileService(this.userRepo, this.email);
    return this._profileService;
  }

  public get issueService() {
    if (!this._issueService) this._issueService = new IssueService(this.issueRepo, this.userRepo, this.email);
    return this._issueService;
  }

  public get noteService() {
    if (!this._noteService) this._noteService = new NoteService(this.noteRepo);
    return this._noteService;
  }
}
