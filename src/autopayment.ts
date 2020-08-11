import axios from 'axios';
import { IAutoPaymentOrder, IOrderResponseData } from './types';
export const autopayment = (SECRET: string) => {
  return async (orderData: IAutoPaymentOrder, log?: boolean) => {
    try {
      // could add check here if recieve address is dev's own
      if (log) console.log('==============orderData==============\n', orderData);
      const orderWithSecret = {
        ...orderData,
        secret: SECRET,
      };
      const orderResponse = await axios.post('https://www.ddpurse.com/openapi/pay_small_money', orderWithSecret);
      const orderResponseData = orderResponse.data;
      if (log) console.log('==============orderResponseData==============', orderResponseData);
      if (orderResponseData.data) {
        const returnData: IOrderResponseData = orderResponseData.data;
        return returnData;
      } else {
        throw orderResponseData;
      }
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
    }
  };
};
