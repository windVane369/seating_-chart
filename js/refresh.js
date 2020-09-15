// 在页面刷新时绑定提示
$(window).bind('beforeunload', function() {
    return '系统将不会保存您所做的更改，是否继续？';
});

// 在页面刷新时想取消绑定提示
// $(window).unbind("beforeunload");