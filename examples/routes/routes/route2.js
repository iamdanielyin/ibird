module.exports = {
    name:'route2',
    method: 'POST',
    path: '/routes/route2',
    middleware: ctx => ctx.body = `Hello '${ctx.originalUrl}'`
};