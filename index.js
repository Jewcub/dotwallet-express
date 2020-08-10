/**
 * @param redirectWithQueries supply a pathname to redirect to. User data will be included in the url query params
 * @param logger pass true to see logs of the data recieved/sent
 * @returns an object with the user data and access token
 * { accessToken: 'asdfasdf',
 * userData: {
 *  user_address: '1DAnX...' wallet address,
 *  user_avatar: 'http://...' avatar url,
 *  user_name: 'First LastName' user name,
 *  user_open_id: '4t32fw43...' user id,
 *  pay_status: 1 automatic payments authorized? 1=YES 2=NO ,
 *  pre_amount: 1000000 single payment limit,
 *  total_amount: 10000000 cumulative payment limit ,
 * }
 *}
 */
const handleAuthResponse = (
  APP_ID,
  SECRET,
  redirectWithQueries = undefined,
  log = undefined
) => {
  return async function (req, res, next) {
    // console.log('req, res', req, res);
    try {
      const code = req.query.code;
      if (log) console.log('==============got code==============\n', code);
      const data = {
        app_id: APP_ID,
        secret: SECRET,
        code: code,
      };
      if (log)
        console.log(
          '==============submitting token request data==============\n',
          data
        );

      const accessTokenRequest = await axios.post(
        'https://www.ddpurse.com/platform/openapi/access_token',
        data
      );
      if (log)
        console.log(
          '==============access token result==============\n',
          accessTokenRequest.data
        );
      const accessToken = accessTokenRequest.data.data.access_token;
      if (accessToken) {
        const userInfoRequest = await axios.get(
          'https://www.ddpurse.com/platform/openapi/get_user_info?access_token=' +
            accessToken
        );
        if (log)
          console.log(
            '==============user info result==============\n',
            userInfoRequest.data
          );
        const userData = userInfoRequest.data.data;
        if (redirectWithQueries)
          res.redirect(
            url.format({
              pathname: redirectWithQueries,
              query: { ...userData },
            })
          );
        return { userData, accessToken };
      } else throw accessTokenRequest;
    } catch (err) {
      console.log('==============ERROR==============\n', err);
    }
  };
};

module.exports = { handleAuthResponse };
