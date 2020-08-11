export interface IUserData {
  pay_status: number;
  pre_amount: number;
  total_amount: number;
  user_address: string;
  user_avatar: string;
  user_name: string;
  user_open_id: string;
}

export interface IAccessData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface IOrderData {
  app_id: string;
  merchant_order_sn: string;
  item_name: string;
  order_amount: number;
  nonce_str: string;
  notice_uri: string;
  redirect_uri: string;
}
