const langPack = {
  'zh': {
    login_successful: '登录成功',
    login_failed: '登录失败：检查您的账号密码是否正确，或者您的帐户可能无权登录',
    logout_failed: '登出失败',
    logout_successful: '登出成功',
    invalid_access_token: '无效的访问令牌',
    api_call_exception: 'API调用异常',
    token_refresh_failed: '令牌刷新失败，请重新登录'
  },
  'zh-TW': {
    login_successful: '登錄成功',
    login_failed: '登錄失敗：檢查您的賬號密碼是否正確，或者您的帳戶可能無權登錄',
    logout_failed: '登出失敗',
    logout_successful: '登出成功',
    invalid_access_token: '無效的訪問令牌',
    api_call_exception: 'API調用異常',
    token_refresh_failed: '令牌刷新失敗，請重新登錄'
  },
  'en': {
    login_successful: 'Login successful',
    login_failed: 'Logging in failed: Check credentials, or your account may not be authorized to log in.',
    logout_failed: 'Logout failed',
    logout_successful: 'Logout successful',
    invalid_access_token: 'Invalid access token',
    api_call_exception: 'API call exception',
    token_refresh_failed: 'Token refresh failed, please log in again'
  }
}

// 获取国际化信息
module.exports = (ctx, dataKey) => {
  if (!dataKey) return null;
  let langType = 'en';
  if (ctx && typeof ctx.acceptsLanguages === 'function') {
    if (ctx.acceptsLanguages('zh') !== false) {
      langType = 'zh';
    } else if (ctx.acceptsLanguages('zh-TW') !== false) {
      langType = 'zh-TW';
    } else if (ctx.acceptsLanguages('en') !== false) {
      langType = 'en';
    }
  } else if (typeof ctx === 'string' && langPack[ctx]) {
    langType = ctx;
  }
  return langPack[langType][dataKey];
}