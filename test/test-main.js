require.config({
    baseUrl: '/base/'
});

require([], function () {
    console.log('Hello testing world! ');
    window.__karma__.start();
});
