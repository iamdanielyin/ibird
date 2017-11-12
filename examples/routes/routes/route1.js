module.exports = {
    path: '/routes/route1',
    middleware: ctx => ctx.body = `Hello '${ctx.originalUrl}'`
};