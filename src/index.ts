import { Request, Response, NextFunction } from 'express';
import { handleAuthResponse, refreshAccess } from './auth';
import { handleOrder, getOrderStatus } from './order';
import { IAccessData, IUserData, IAutoPaymentOrder } from './types';
import { autopayment } from './autopayment';

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
  handleOrder: (orderData: any, log?: boolean | undefined) => Promise<string | Error | undefined>;
  getOrderStatus: (merchant_order_sn: string) => Promise<object | Error | undefined>;
  autopayment: (orderData: IAutoPaymentOrder, log?: boolean | undefined) => Promise<any>;
  constructor(appId: string, secret: string) {
    this.APP_ID = appId;
    this.SECRET = secret;
    this.handleAuthResponse = handleAuthResponse(this.APP_ID, this.SECRET);
    this.refreshAccess = refreshAccess(this.APP_ID);
    this.handleOrder = handleOrder(this.APP_ID, this.SECRET);
    this.getOrderStatus = getOrderStatus(this.APP_ID, this.SECRET);
    this.autopayment = autopayment(this.SECRET);
  }
}

const caller = (appId: string, secret: string) => new DotWallet(appId, secret);

export = caller;
