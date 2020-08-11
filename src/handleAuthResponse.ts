import axios from 'axios';
import * as url from 'url';
import { Request, Response, NextFunction } from 'express';
import { IAccessData, IUserData } from './types';

export default (APP_ID: string, SECRET: string) => {
  /** @param redirectWithQueries If you'd like to have express send the response to redirect to a url, carrying the user data queries with it, than include a redirect URL string here
   * @param log whether to log events
   * @example app.get('/auth', Dotwallet.handleAuthResponse('/frontend-landing-page', true)); app.get('/auth', dotwallet.handleAuthResponse().then(result=>{const userData = result.userData; const accessToken = result.accessData.access_token;}));
   * @returns {object} { userData: {user_open_id, ...}, accessData:{ refresh_token, expires_in, access_token }}
   */
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
      const accessData: IAccessData = accessTokenRequest.data.data;
      if (accessData.access_token) {
        const userInfoRequest = await axios.get(
          'https://www.ddpurse.com/platform/openapi/get_user_info?access_token=' + accessData.access_token,
        );
        if (log) console.log('==============user info result==============\n', userInfoRequest.data);
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
