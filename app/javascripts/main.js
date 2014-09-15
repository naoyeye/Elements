/*global $, jQuery, Device, _, TouchSlide, WeixinJSBridge, _report*/

/*
* @Author: Jiyun
* @Date:   2014-09-12 13:19:21
* @Last Modified by:   Jiyun
* @Last Modified time: 2014-09-12 20:08:51
*/

$(function () {

    var iOS;
    var isP4;
    var isWechat;
    var isAndroid;
    var retina;
    var userType = {};
    var clientWidth = $(window).width();

    // ios
    if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
        iOS = true;
        $('html').addClass('ios');
        userType.iOS = true;
        $('#device h2 span').append('iOS ');
    } else {
        iOS = false;
    }

    // P4
    if (window.campaignPlugin) {
        isP4 = true;
        $('html').addClass('p4');
        userType.isP4 = true;
        $('#device h2 span').append('P4 ');
    } else {
        isP4 = false;
    }

    // android
    if (navigator.userAgent.toLowerCase().match(/(android)/)) {
        isAndroid = true;
        userType.isAndroid = true;
        $('html').addClass('android');
        $('#device h2 span').append('Android ');
    } else {
        isAndroid = false;
    }

    // Wechat
    if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
        isWechat = true;
        userType.isWechat = true;
        $('html').addClass('wechat');
        $('#device h2 span').append('微信 ');
    } else {
        isWechat = false;
    }

    // Retina
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        retina = true;
        $('html').addClass('retina');
        $('#device h2 span').append('Retina ');
    } else {
        retina = false;
    }


    $('.action a').click(function () {
        var $t = $(this);
        var share = $t.closest('.share-section');
        // 分享
        if (share.size() > 0) {
            $t.siblings('a').removeClass('active');
            $t.addClass('active');
            if ($t.data('mode') === 'light') {
                share.find('.share-wrap').addClass('light').removeClass('dark');
            } else if ($t.data('mode') === 'dark') {
                share.find('.share-wrap').addClass('dark').removeClass('light');
            }
        }
    });

    staticShare();

    function staticShare() {
        var url = encodeURI('http://www.wandoujia.com/collection/running/?utm_medium=sns&utm_source=weibo&utm_campaign=running');

        var text = encodeURI('#跑步者的选择# 你所不知道的跑步 App 和视频，来自来自徐蕴芸、于嘉、北黑、程旸等牛人推荐。让跑步变得有迹可循！');

        var pic = encodeURI('http://img.wdjimg.com/static-files/itoa/hps/collection/running/weibo-sns-share.jpg');

        var weiboHref = 'http://service.weibo.com/share/share.php?appkey=1483181040&amp;relateUid=1727978503&amp;url=' + url + '&amp;title=' + text + '&amp;pic=' + pic;

        $('#static-share .share-weibo a').attr('href', weiboHref);

    }
});
