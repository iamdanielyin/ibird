'use strict';


/**
 * 项目自动打包文件
 * Created by yinfxs on 2017/4/14.
 */


const patch = require('ibird-patch');

patch.config([
    {
        output: 'patches/pro',
        compress: true,
        sources: {
            'cert': 'cert',
            'clients/admin/dist': 'clients/admin/dist',
            'clients/corp/dist': 'clients/corp/dist',
            'modules': 'modules',
            'utils': 'utils',
            'index-pro.js': 'index.js',
            'package-pro.json': 'package.json'
        }
    },
    {
        output: 'patches/test',
        compress: true,
        filename: '../k11-todo-wosoft.zip',
        format: 'tar',
        options: {
            gzip: true,
            gzipOptions: {
                level: -1
            }
        },
        sources: {
            'cert': 'cert',
            'clients/admin/dist': 'admin/dist',
            'clients/corp/dist': 'clients/corp/dist',
            'modules': 'modules',
            'utils': 'utils',
            'index-test.js': 'index.js',
            'package-test.json': 'package.json'
        }
    }
]);

patch.output();