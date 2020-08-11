import axios from 'axios';
import * as url from 'url';
import { Request, Response } from 'express';
class DotWallet {
  APP_ID: string;
  SECRET: string;
  constructor(appId: string, secret: string) {
    this.APP_ID = appId;
    this.SECRET = secret;
  }

  /** @param redirectWithQueries If you'd like to have express send the response to redirect to a url, carrying the user data queries with it, than include a redirect URL string here
   * @param log whether to log events
   * @example app.get('/auth', Dotwallet.handleAuthResponse('/frontend-landing-page', true)); app.get('/auth', dotwallet.handleAuthResponse().then(result=>{const userData = result.userData; const accessToken = result.accessData.access_token;}));
   * @returns {object} { userData: {user_open_id, ...}, accessData:{ refresh_token, expires_in, access_token }}
   */
  handleAuthResponse = (redirectWithQueries?: string, log?: boolean) => {
    return async (req: Request, res: Response) => {
      // console.log('req, res', req, res);
      try {
        const code = req.query.code;
        if (log) console.log('==============got code==============\n', code);
        const data = {
          app_id: this.APP_ID!,
          secret: this.SECRET!,
          code: code! as string,
        };
        if (log) console.log('==============submitting token request data==============\n', data);

        const accessTokenRequest = await axios.post('https://www.ddpurse.com/platform/openapi/access_token', data);
        if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
        const accessData = accessTokenRequest.data.data;
        if (accessData.access_token) {
          const userInfoRequest = await axios.get(
            'https://www.ddpurse.com/platform/openapi/get_user_info?access_token=' + accessData.access_token,
          );
          if (log) console.log('==============user info result==============\n', userInfoRequest.data);
          const userData = userInfoRequest.data.data;
          if (redirectWithQueries)
            res.redirect(
              url.format({
                pathname: redirectWithQueries,
                query: { ...userData },
              }),
            );
          return { userData, accessData };
        } else throw accessTokenRequest;
      } catch (err) {
        console.warn('==============ERROR==============\n', err);
      }
    };
  };

  /**
   * @summary Use your refresh token to get back an access token and a new refresh token
   * @param { string } refreshToken
   * @returns { object|Error } { refresh_token, expires_in, access_token }
   */
  refreshAccess = async (refreshToken: string) => {
    try {
      const response = await axios.get(
        `https://www.ddpurse.com/platform/openapi/refresh_access_token?app_id=${this.APP_ID}&refresh_token=${refreshToken}`,
      );
      console.log('==============refresh response==============\n', response.data.data);
      return {
        ...response.data.data,
      };
    } catch (err) {
      console.warn('==============ERROR==============\n', err);
      return err;
    }
  };
}

const caller = (appId: string, secret: string) => {
  return new DotWallet(appId, secret);
};
export default caller;
