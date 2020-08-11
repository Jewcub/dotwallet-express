import axios from 'axios';
import { IAccessData } from './types';

export default (APP_ID: string) => {
  /**
   * @summary Use your refresh token to get back an access token and a new refresh token
   * @param { string } refreshToken
   * @returns { object|Error } { refresh_token, expires_in, access_token }
   */
  return async (refreshToken: string): Promise<IAccessData | Error | undefined> => {
    try {
      const response = await axios.get(
        `https://www.ddpurse.com/platform/openapi/refresh_access_token?app_id=${APP_ID}&refresh_token=${refreshToken}`,
      );
      console.log('==============refresh response==============\n', response.data.data);
      const accessData: IAccessData = response.data.data;
      return accessData;
    } catch (err) {
      console.warn('==============ERROR==============\n', err);
      return err;
    }
  };
};
