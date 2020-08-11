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
