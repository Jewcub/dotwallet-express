import axios from 'axios';
import * as url from 'url';
import { Request, Response, NextFunction } from 'express';
import { IAccessData, IUserData } from './types';

export const handleAuthResponse = (APP_ID: string, SECRET: string) => {
  return async (req: Request, res: Response, next: NextFunction, redirectWithQueries?: string, log?: boolean) => {
    // console.log('req, res', req, res);
    try {
      const code = req.query.code;
      if (log) console.log('==============got code==============\n', code);
      const data = {
        app_id: APP_ID,
        secret: SECRET,
        code: code! as string,
      };
      if (log) console.log('==============submitting token request data==============\n', data);
      const accessTokenRequest = await axios.post('https://www.ddpurse.com/platform/openapi/access_token', data);
      if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
      if (accessTokenRequest.data.code !== 0) throw accessTokenRequest;
      const accessData: IAccessData = accessTokenRequest.data.data;
      if (accessData.access_token) {
        const userInfoRequest = await axios.get(
          'https://www.ddpurse.com/platform/openapi/get_user_info?access_token=' + accessData.access_token,
        );
        if (log) console.log('==============user info result==============\n', userInfoRequest.data);
        if (userInfoRequest.data.code !== 0) throw userInfoRequest;
        const userData: IUserData = userInfoRequest.data.data;
        if (redirectWithQueries)
          res.redirect(
            url.format({
              pathname: redirectWithQueries,
              query: { ...userData },
            }),
          );
        return { userData, accessData };
      } else next(accessTokenRequest);
    } catch (err) {
      console.warn('==============ERROR==============\n', err);
      next(err);
    }
  };
};
export const refreshAccess = (APP_ID: string) => {
  return async (refreshToken: string): Promise<IAccessData | Error | undefined> => {
    try {
      const response = await axios.get(
        `https://www.ddpurse.com/platform/openapi/refresh_access_token?app_id=${APP_ID}&refresh_token=${refreshToken}`,
      );
      console.log('==============refresh response==============\n', response.data.data);
      if (response.data.code !== 0) throw response;
      const accessData: IAccessData = response.data.data;
      return accessData;
    } catch (err) {
      console.warn('==============ERROR==============\n', err);
      return err;
    }
  };
};
