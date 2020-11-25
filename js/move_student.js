var curTarget = null; //鼠标拖拽的目标元素 
var curPos = null;
var dropTarget = null; //要放下的目标元素 
var iMouseDown = false; //鼠标是否按下 
var lMouseState = false; //前一个iMouseDown状态 
var dragreplaceCont = [];
var mouseOffset = null;
var callbackFunc = null;
Number.prototype.NaN0 = function() {
    return isNaN(this) ? 0 : this;
}

function setdragreplace(obj, callback) {
    dragreplaceCont.push(obj);
    obj.setAttribute('candrag', '1');
    if (callback != null && typeof(callback) == 'function') {
        callbackFunc = callback;
    }
}

// 修改类名
function usrToUsrBatch(className) {
    if (className.search('batch') != -1) {
        if (className.search('woman') != -1) {
            return 'usr woman';
        } else if (className.search('man') != -1) {
            return 'usr man';
        } else {
            return 'usr';
        }
    } else {
        if (className.search('woman') != -1) {
            return 'usr batch woman';
        } else if (className.search('man') != -1) {
            return 'usr batch man';
        } else {
            return 'usr batch';
        }
    }
}

//鼠标移动
function mouseMove(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    var mousePos = mouseCoords(ev); //如果当前元素可拖拽 
    var dragObj = target.getAttribute('candrag');
    if (dragObj != null) {
        if (iMouseDown && !lMouseState) {
            //刚开始拖拽
            curTarget = target;
            curPos = getPosition(target);
            mouseOffset = getMouseOffset(target, ev); // 清空辅助层 
            for (var i = 0; i < dragHelper.childNodes.length; i++) dragHelper.removeChild(dragHelper.childNodes[i]); //克隆元素到辅助层，并移动到鼠标位置 
            dragHelper.appendChild(curTarget.cloneNode(true));
            dragHelper.style.display = 'block';
            dragHelper.firstChild.removeAttribute('candrag'); //记录拖拽元素的位置信息 
            curTarget.setAttribute('startWidth', parseInt(curTarget.offsetWidth));
            curTarget.setAttribute('startHeight', parseInt(curTarget.offsetHeight));
            curTarget.style.display = 'none'; //记录每个可接纳元素的位置信息，这里一次记录以后多次调用，获取更高性能 
            for (var i = 0; i < dragreplaceCont.length; i++) {
                with(dragreplaceCont[i]) {
                    if (dragreplaceCont[i] == curTarget) continue;
                    var pos = getPosition(dragreplaceCont[i]);
                    setAttribute('startWidth', parseInt(offsetWidth));
                    setAttribute('startHeight', parseInt(offsetHeight));
                    setAttribute('startLeft', pos.x);
                    setAttribute('startTop', pos.y);
                }
            } //记录end 
        } //刚开始拖拽end 
    }

    //正在拖拽
    if (curTarget != null) {
        // move our helper div to wherever the mouse is (adjusted by mouseOffset)
        dragHelper.style.top = mousePos.y - mouseOffset.y + "px";
        dragHelper.style.left = mousePos.x - mouseOffset.x + "px"; //拖拽元素的中点 
        var xPos = mousePos.x - mouseOffset.x + (parseInt(curTarget.getAttribute('startWidth')) / 2);
        var yPos = mousePos.y - mouseOffset.y + (parseInt(curTarget.getAttribute('startHeight')) / 2);
        var havedrop = false;
        for (var i = 0; i < dragreplaceCont.length; i++) {
            with(dragreplaceCont[i]) {
                if (dragreplaceCont[i] == curTarget) continue;
                if ((parseInt(getAttribute('startLeft')) < xPos) && (parseInt(getAttribute('startTop')) < yPos) && ((parseInt(getAttribute('startLeft')) + parseInt(getAttribute('startWidth'))) > xPos) && ((parseInt(getAttribute('startTop')) + parseInt(getAttribute('startHeight'))) > yPos)) {
                    havedrop = true;
                    dropTarget = dragreplaceCont[i];
                    dropTarget.className = usrToUsrBatch(dropTarget.className);
                    break;
                }
            }
        }
        if (!havedrop && dropTarget != null) {
            dropTarget.className = usrToUsrBatch(dropTarget.className);
            dropTarget = null;
        }
    } //正在拖拽end 
    lMouseState = iMouseDown;
    if (curTarget) return false; //阻止其它响应（如：鼠标框选文本） 
}

//鼠标松开
function mouseUp(ev) {
    if (curTarget) {
        dragHelper.style.display = 'none'; //隐藏辅助层 
        if (curTarget.style.display == 'none' && dropTarget != null) { //有元素接纳，两者互换 
            var destP = dropTarget.parentNode;
            var sourceP = curTarget.parentNode;
            destP.appendChild(curTarget);
            sourceP.appendChild(dropTarget);
            dropTarget.className = usrToUsrBatch(dropTarget.className);
            dropTarget = null;
            if (callbackFunc != null) {
                callbackFunc(curTarget);
            }
        }
        curTarget.style.display = '';
        curTarget.style.visibility = 'visible';
        curTarget.setAttribute('candrag', '1');
    }
    curTarget = null;
    iMouseDown = false;
}

//鼠标按下
function mouseDown(ev) { //记录变量状态 
    iMouseDown = true; //获取事件属性 
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.onmousedown || target.getAttribute('candrag')) { //阻止其它响应（如：鼠标双击文本） 
        return false;
    }
}

//返回当前item相对页面左上角的坐标
function getPosition(e) {
    var left = 0;
    var top = 0;
    while (e.offsetParent) {
        left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
        top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);
        e = e.offsetParent;
    }
    left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
    top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);
    return {
        x: left,
        y: top
    };
}

//返回鼠标相对页面左上角的坐标
function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY
        };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

//鼠标位置相对于item的偏移量
function getMouseOffset(target, ev) {
    ev = ev || window.event;
    var docPos = getPosition(target);
    var mousePos = mouseCoords(ev);
    return {
        x: mousePos.x - docPos.x,
        y: mousePos.y - docPos.y
    };
}

window.onload = function() {
    document.onmousemove = mouseMove;
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp; //辅助层用来显示拖拽 
    dragHelper = document.createElement('DIV');
    dragHelper.style.cssText = 'position:absolute;display:none;';
    document.body.appendChild(dragHelper);

    setdragreplace(document.getElementById('1'));
    setdragreplace(document.getElementById('2'));
    setdragreplace(document.getElementById('3'));
    setdragreplace(document.getElementById('4'));
    setdragreplace(document.getElementById('5'));
    setdragreplace(document.getElementById('6'));
    setdragreplace(document.getElementById('7'));
    setdragreplace(document.getElementById('8'));
    setdragreplace(document.getElementById('9'));
    setdragreplace(document.getElementById('10'));
    setdragreplace(document.getElementById('11'));
    setdragreplace(document.getElementById('12'));
    setdragreplace(document.getElementById('13'));
    setdragreplace(document.getElementById('14'));
    setdragreplace(document.getElementById('15'));
    setdragreplace(document.getElementById('16'));
    setdragreplace(document.getElementById('17'));
    setdragreplace(document.getElementById('18'));
    setdragreplace(document.getElementById('19'));
    setdragreplace(document.getElementById('20'));
    setdragreplace(document.getElementById('21'));
    setdragreplace(document.getElementById('22'));
    setdragreplace(document.getElementById('23'));
    setdragreplace(document.getElementById('24'));
    setdragreplace(document.getElementById('25'));
    setdragreplace(document.getElementById('26'));
    setdragreplace(document.getElementById('27'));
    setdragreplace(document.getElementById('28'));
    setdragreplace(document.getElementById('29'));
    setdragreplace(document.getElementById('30'));
    setdragreplace(document.getElementById('31'));
    setdragreplace(document.getElementById('32'));
    setdragreplace(document.getElementById('33'));
    setdragreplace(document.getElementById('34'));
    setdragreplace(document.getElementById('35'));
    setdragreplace(document.getElementById('36'));
    setdragreplace(document.getElementById('37'));
    setdragreplace(document.getElementById('38'));
    setdragreplace(document.getElementById('39'));
    setdragreplace(document.getElementById('40'));
    setdragreplace(document.getElementById('41'));
    setdragreplace(document.getElementById('42'));
    setdragreplace(document.getElementById('43'));
    setdragreplace(document.getElementById('44'));
    setdragreplace(document.getElementById('45'));
    setdragreplace(document.getElementById('46'));
    setdragreplace(document.getElementById('47'));
    setdragreplace(document.getElementById('48'));
    setdragreplace(document.getElementById('49'));
    setdragreplace(document.getElementById('50'));
    setdragreplace(document.getElementById('51'));
    setdragreplace(document.getElementById('52'));
    setdragreplace(document.getElementById('53'));
    setdragreplace(document.getElementById('54'));
    setdragreplace(document.getElementById('55'));
    setdragreplace(document.getElementById('56'));
    setdragreplace(document.getElementById('57'));
    setdragreplace(document.getElementById('58'));
    setdragreplace(document.getElementById('59'));
    setdragreplace(document.getElementById('60'));
    setdragreplace(document.getElementById('61'));
    setdragreplace(document.getElementById('62'));
    setdragreplace(document.getElementById('63'));
    setdragreplace(document.getElementById('64'));
};

// 创建右侧边栏的数据集
function create_right_canvas() {
    document.onmousemove = mouseMove;
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp; //辅助层用来显示拖拽 
    dragHelper = document.createElement('DIV');
    dragHelper.style.cssText = 'position:absolute;display:none;';
    document.body.appendChild(dragHelper);

    setdragreplace(document.getElementById('1001'));
    setdragreplace(document.getElementById('1002'));
    setdragreplace(document.getElementById('1003'));
    setdragreplace(document.getElementById('1004'));
    setdragreplace(document.getElementById('1005'));
    setdragreplace(document.getElementById('1006'));
    setdragreplace(document.getElementById('1007'));
    setdragreplace(document.getElementById('1008'));
    setdragreplace(document.getElementById('1009'));
    setdragreplace(document.getElementById('10010'));
    setdragreplace(document.getElementById('10011'));
    setdragreplace(document.getElementById('10012'));
    setdragreplace(document.getElementById('10013'));
    setdragreplace(document.getElementById('10014'));
    setdragreplace(document.getElementById('10015'));
    setdragreplace(document.getElementById('10016'));
    setdragreplace(document.getElementById('10017'));
    setdragreplace(document.getElementById('10018'));
    setdragreplace(document.getElementById('10019'));
    setdragreplace(document.getElementById('10020'));
    setdragreplace(document.getElementById('10021'));
    setdragreplace(document.getElementById('10022'));
    setdragreplace(document.getElementById('10023'));
    setdragreplace(document.getElementById('10024'));
    setdragreplace(document.getElementById('10025'));
    setdragreplace(document.getElementById('10026'));
    setdragreplace(document.getElementById('10027'));
    setdragreplace(document.getElementById('10028'));
    setdragreplace(document.getElementById('10029'));
    setdragreplace(document.getElementById('10030'));
    setdragreplace(document.getElementById('10031'));
    setdragreplace(document.getElementById('10032'));
    setdragreplace(document.getElementById('10033'));
    setdragreplace(document.getElementById('10034'));
    setdragreplace(document.getElementById('10035'));
    setdragreplace(document.getElementById('10036'));
    setdragreplace(document.getElementById('10037'));
    setdragreplace(document.getElementById('10038'));
    setdragreplace(document.getElementById('10039'));
    setdragreplace(document.getElementById('10040'));
    setdragreplace(document.getElementById('10041'));
    setdragreplace(document.getElementById('10042'));
    setdragreplace(document.getElementById('10043'));
    setdragreplace(document.getElementById('10044'));
    setdragreplace(document.getElementById('10045'));
    setdragreplace(document.getElementById('10046'));
    setdragreplace(document.getElementById('10047'));
    setdragreplace(document.getElementById('10048'));
    setdragreplace(document.getElementById('10049'));
    setdragreplace(document.getElementById('10050'));
    setdragreplace(document.getElementById('10051'));
    setdragreplace(document.getElementById('10052'));
    setdragreplace(document.getElementById('10053'));
    setdragreplace(document.getElementById('10054'));
}