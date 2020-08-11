import { Request, Response, NextFunction } from 'express';
import handleAuthResponse from './handleAuthResponse';
import refreshAccess from './refreshAccess';
import { IAccessData, IUserData } from './types';

class DotWallet {
  APP_ID: string;
  SECRET: string;
  handleAuthResponse: (
    req: Request,
    res: Response,
    next: NextFunction,
    redirectWithQueries?: string | undefined,
    log?: boolean | undefined,
  ) => Promise<{ userData: IUserData; accessData: IAccessData } | undefined>;
  refreshAccess: (refreshToken: string) => Promise<IAccessData | Error | undefined>;
  constructor(appId: string, secret: string) {
    this.APP_ID = appId;
    this.SECRET = secret;
    this.handleAuthResponse = handleAuthResponse(this.APP_ID, this.SECRET);
    this.refreshAccess = refreshAccess(this.APP_ID);
  }
}

const caller = (appId: string, secret: string) => new DotWallet(appId, secret);

export = caller;
