/**
 * 自动require所有依赖
 * 包括：
 *  publics/css
 *  publics/fonts
 *  publics/js
 * Created by yinfxs on 16-6-20.
 */

'use strict';

require('../publics/lib/bootstrap/css/bootstrap.css');
require('../publics/lib/adminlte/css/AdminLTE.css');
require('../publics/lib/adminlte/css/AdminLTE-skins.css');
require('../publics/lib/font-awesome/font-awesome.css');
require('../publics/lib/bootstrap/js/bootstrap');
require('../publics/lib/adminlte/js/AdminLTE');
require('../publics/css/index.less');
require('../publics/plugins/iCheck/all.css');
require('../publics/plugins/toastr/toastr.css');
require('../publics/plugins/datetimepicker/css/bootstrap-datetimepicker.min.css');
require('../publics/plugins/select2/select2.min.css');

require('whatwg-fetch');
require('jquery-slimscroll');
require('icheck');
require('datetimepicker');
require('../publics/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN');
require('select2');
require('../publics/plugins/select2/i18n/zh-CN.js');
