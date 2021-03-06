import { Request, Response, NextFunction } from 'express';
import { handleAuthResponse, refreshAccess } from './auth';
import { handleOrder, getOrderStatus } from './order';
import {
  IAccessData,
  IUserData,
  IOrderData,
  IOrderStatusInfo,
  IOrderResponseData,
  IAutoPaymentOrder,
  dataType,
  IGetHostedResponse,
  IGetBalanceResponse,
  ISaveDataResponse,
} from './types';
import { autopayment } from './autopayment';
import { saveData, getHostedAccount, hostedAccountBalance } from './saveData';

class DotWallet {
  APP_ID: string;
  SECRET: string;

  /** @param redirectWithQueries If you'd like to have express send the response to redirect to a url, carrying the user data queries with it, than include a redirect URL string here
   * @param log whether to log events
   * @example app.get('/auth', Dotwallet.handleAuthResponse('/frontend-landing-page', true)); app.get('/auth', dotwallet.handleAuthResponse().then(result=>{const userData = result.userData; const accessToken = result.accessData.access_token;}));
   * @returns {object} { userData: {user_open_id, ...}, accessData:{ refresh_token, expires_in, access_token }}
   */
  handleAuthResponse: (
    req: Request,
    res: Response,
    next: NextFunction,
    redirectWithQueries?: string | undefined,
    log?: boolean | undefined,
  ) => Promise<{ userData: IUserData; accessData: IAccessData } | undefined>;
  /**
   * @summary Use your refresh token to get back an access token and a new refresh token
   * @param { string } refreshToken
   * @returns { object|Error } { refresh_token, expires_in, access_token }
   */
  refreshAccess: (refreshToken: string) => Promise<IAccessData | Error | undefined>;
  /**
   * @summary sign an order with your deveoper key, and send it to dotwallet servers to get an order_sn
   * @param { IOrderData } orderData a valid order as a js object (see the docs or this IorderData type)
   * @returns { string } the order_sn
   */
  handleOrder: (orderData: IOrderData, log?: boolean | undefined) => Promise<string | Error | undefined>;
  getOrderStatus: (merchant_order_sn: string) => Promise<IOrderStatusInfo | Error | undefined>;
  /**
   * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
   * @param { IAutoPaymentOrder } orderData a valid order as a js object (see the docs or this IAutoPaymentOrder type)
   * @returns { IOrderResponseData } The order
   */
  autopayment: (
    orderData: IAutoPaymentOrder,
    log?: boolean | undefined,
  ) => Promise<IOrderResponseData | Error | undefined>;
  getHostedAccount: (coinType?: string, log?: boolean | undefined) => Promise<IGetHostedResponse | Error | undefined>;
  hostedAccountBalance: (
    coinType?: string,
    log?: boolean | undefined,
  ) => Promise<IGetBalanceResponse | Error | undefined>;
  /**
   * @param {dataType} dataType 0 for string and 1 for rawhex. If you select 0 (the default) we will JSON.stringify() the data to be saved on chain
   * @param {string|object} data JSON.stringify-able data if default, or rawhex string if rawhex
   */
  saveData: (
    data: any,
    dataType?: dataType,
    log?: boolean | undefined,
  ) => Promise<ISaveDataResponse | Error | undefined>;
  constructor(appId: string, secret: string) {
    this.APP_ID = appId;
    this.SECRET = secret;
    this.handleAuthResponse = handleAuthResponse(this.APP_ID, this.SECRET);
    this.refreshAccess = refreshAccess(this.APP_ID);
    this.handleOrder = handleOrder(this.APP_ID, this.SECRET);
    this.getOrderStatus = getOrderStatus(this.APP_ID, this.SECRET);
    this.autopayment = autopayment(this.SECRET);
    this.getHostedAccount = getHostedAccount(this.APP_ID, this.SECRET);
    this.hostedAccountBalance = hostedAccountBalance(this.APP_ID, this.SECRET);
    this.saveData = saveData(this.APP_ID, this.SECRET);
  }
}

const caller = (appId: string, secret: string) => new DotWallet(appId, secret);

export = caller;
