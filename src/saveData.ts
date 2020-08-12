import axios, { AxiosRequestConfig } from 'axios';

import { dataType } from './types';
export const saveData = (APP_ID: string, SECRET: string) => {
  /**
   * @param {dataType} dataType 0 for string and 1 for rawhex. If you select 0 (the default) we will JSON.stringify() the data to be saved on chain
   * @param {string|object} data JSON.stringify-able data if default, or rawhex string if rawhex
   */
  return async (data: any, dataType: dataType = 0, log?: boolean) => {
    try {
      const saveDataOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          appid: APP_ID,
          appsecret: SECRET,
        },
        method: 'POST',
        data: {
          coin_type: 'BSV',
          data: dataType === 0 ? JSON.stringify(data) : data,
          data_type: dataType,
        },
      };
      const res = await axios('https://www.ddpurse.com/platform/openapi/v2/push_chain_data', saveDataOptions);
      const saveDataResponse = res.data;

      if (log) console.log('==============saveDataResponse==============', saveDataResponse);
      if (saveDataResponse.code !== 0) throw saveDataResponse;
      return saveDataResponse.data;
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
    }
  };
};
