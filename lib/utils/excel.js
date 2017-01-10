/**
 * Excel导入/导出工具模块
 * Created by yinfxs on 16-11-3.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const xlsx = require('node-xlsx');
const urlencode = require('urlencode');
const app = {};

module.exports = app;

/**
 * 导出到excel
 * @param file 导入目标文件路径
 * @param sheets 数据
 * @param json 传入数据的data是否为json，默认false
 * sheets的示例数据为：
 *
 [
 {
   "name": "Sheet1",
   "header": [
     [
       "编码",
       "名称",
       "年龄"
     ],
     [
       "code",
       "name",
       "age"
     ]
   ],
   "json": true,
   "keyRowIndex": 1,
   "data": [
     {
       "code": "1-1",
       "name": "1-2",
       "age": "1-3"
     },
     {
       "code": "2-1",
       "name": "2-2",
       "age": "2-3"
     },
     {
       "code": "3-1",
       "name": "3-2",
       "age": "3-3"
     }
   ]
 },
 {
   "name": "Sheet2",
   "header": [
     [
       "code",
       "name",
       "age"
     ]
   ],
   "json": false,
   "data": [
     [
       "1-1",
       "1-2",
       "1-3"
     ],
     [
       "2-1",
       "2-2",
       "2-3"
     ]
   ]
 },
 {
   "name": "Sheet3",
   "data": [
     [
       "1-1",
       "1-2",
       "1-3"
     ],
     [
       "2-1",
       "2-2",
       "2-3"
     ]
   ]
 }
 ]
 *
 */
app.export = (file, sheets) => {
    if (!_.isArray(sheets)) sheets = [sheets];
    const array = [];
    sheets.forEach((item) => {
        if (!item || !item.name || !_.isArray(item.data)) return;
        //{"name":"Sheet1","header":[["编码","名称","年龄"],["code","name","age"]],"json":true,"keyRowIndex":1,"data":[{"code":"1-1","name":"1-2","age":"1-3"}]}
        item.header = _.isArray(item.header) ? item.header : [];
        item.keyRowIndex = !_.isNaN(_.toNumber(item.keyRowIndex)) ? _.toNumber(item.keyRowIndex) : 0;
        item.keyRowIndex = (item.keyRowIndex >= 0 && item.keyRowIndex < item.header.length) ? item.keyRowIndex : 0;
        let rows = item.header;
        //确保header内的值为数组类型
        item.header.forEach((h, i) => {
            if (!_.isArray(h)) return item.header.splice(i, 1);
        });
        ////处理json数据，为json类型时，header不允许为空，因为要指定JSON的key行
        if (item.json == true && item.header.length > 0 && item.data.length > 0) {
            //获取key的下标值
            const keyRowIndex = item.keyRowIndex;
            item.data.forEach((dataItem) => {
                if (!dataItem || !_.isObject(dataItem)) return;
                if (_.isArray(dataItem)) return rows.push(dataItem);
                //循环key获取值，生成数组模式
                const row = [];
                const keys = item.header[keyRowIndex];
                keys.forEach((key, j) => {
                    let value = dataItem[key];
                    if (value == undefined || value == null) value = '';
                    row.push(value);
                });
                rows.push(row);
            });
        } else {
            //处理数组数据
            rows = rows.concat(item.data);
        }
        const sheet = {name: item.name, data: rows};
        array.push(sheet);
    });
    const data = xlsx.build(array);
    //array = [{name: "SheetName", data: data}]
    if (file) {
        if (!path.isAbsolute(file)) file = path.resolve(process.cwd(), file);
        fs.writeFileSync(file, data, 'binary');
    }
    return data;
};
// json2Array

/**
 * 从excel导入
 * @param file 导入目标文件路径
 * @param options { 'Sheet01':{json:'是否返回json，默认false',keyRowIndex:'JSON数据的key行标识，默认为0，则当返回json时，以第一行的列数据为JSON对象的key'} }
 */
app.import = (file, options) => {
    if (!path.isAbsolute(file)) file = path.resolve(process.cwd(), file);
    const sheets = xlsx.parse(file);
    if (!options || _.keys(options).length == 0) return sheets;
    const data = {};
    sheets.forEach((sheet) => {
        const name = sheet.name;
        const rows = sheet.data;
        const option = options[name];
        if (!option || option.json == undefined || option.json == false) return data[name] = rows;
        if (parseInt(option.keyRowIndex) >= rows.length) return;
        const keys = rows[option.keyRowIndex];
        const dataItems = [];
        for (let i = option.keyRowIndex + 1; i < rows.length; i++) {
            //循环数据行
            const object = {};
            const row = rows[i];
            keys.forEach((key, j) => {
                if (!key) return;
                object[key] = j < row.length && row[j] ? row[j] : '';
            });
            dataItems.push(object);
        }
        data[name] = dataItems;
    });
    return data;
};

/**
 * 请求文件下载
 * @param title 文件标题
 * @param content 文件内容
 * @param res 响应对象
 */
app.resexp = (title, content, res) => {
    if (!title || !content || !res) return;
    title = title.endsWith('.xlsx') ? title : `${title}.xlsx`;
    title = urlencode(title);//URL编码
    const data = app.export(null, content);
    res.set({
        "Content-Type": "application/octet-stream;",
        'Content-disposition': `attachment; filename=${title}`
    });
    res.end(data);
};