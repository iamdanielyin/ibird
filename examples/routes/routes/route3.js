module.exports = (router) => {
    router.get('/routes/route3/r1', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
    router.post('/routes/route3/r2', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
    router.put('/routes/route3/r3', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
    router.delete('/routes/route3/r4', ctx => ctx.body = `Hello '${ctx.originalUrl}'`);
};