/**
 * 手动require所有依赖
 * 包括：
 *  public/css
 *  public/fonts
 *  public/js
 * Created by yinfxs on 16-6-20.
 */

'use strict';

require('../public/lib/bootstrap/css/bootstrap.css');
require('../public/lib/adminlte/css/AdminLTE.css');
require('../public/lib/adminlte/css/AdminLTE-skins.css');
require('../public/lib/font-awesome/font-awesome.css');
require('../public/css/index.less');
require('../public/plugins/iCheck/all.css');
require('../public/plugins/toastr/toastr.css');
require('../public/plugins/datetimepicker/css/bootstrap-datetimepicker.min.css');
require('../public/plugins/select2/select2.min.css');

require('bootstrap');
require('adminlte');
require('whatwg-fetch');
require('jquery-slimscroll');
require('icheck');
require('datetimepicker');
require('../public/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN');
require('select2');
require('../public/plugins/select2/i18n/zh-CN.js');
require('jquery.ui.widget');
require('jquery.iframe-transport');
require('jquery.fileupload');
