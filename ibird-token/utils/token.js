// 令牌工具模块

const TOKENKEY = 'access_token'
const COOKIETOKEN = 'IBIRD_ACCESS_TOKEN'

module.exports = (ctx) => {
  if (!ctx) return null;

  const _query = ctx.query;
  const _cookies = ctx.cookies;
  const _body = ctx.request.body || {};
  let access_token = _query[TOKENKEY] || _body[TOKENKEY];
  if (!access_token) {
    if (ctx.get('Authorization')) {
      const _authorization = ctx.get('Authorization');
      const _split = _authorization.split(' ');
      if (_split.length >= 1) access_token = _split[1];
    } else if (ctx.get(TOKENKEY)) {
      access_token = ctx.get(TOKENKEY);
    } else if (ctx.get(TOKENKEY.toUpperCase())) {
      access_token = ctx.get(TOKENKEY.toUpperCase());
    } else if (ctx.get('token')) {
      access_token = ctx.get('token');
    } else if (ctx.get('TOKEN')) {
      access_token = ctx.get('TOKEN');
    } else if (ctx.get('access-token')) {
      access_token = ctx.get('access-token');
    } else if (ctx.get('ACCESS-TOKEN')) {
      access_token = ctx.get('ACCESS-TOKEN');
    } else {
      access_token = _cookies.get(COOKIETOKEN); // cookie优先级最低
    }
  }
  return access_token;
}