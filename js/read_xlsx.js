$(document).ready(function() {
    var wb; //读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串

    function fixdata(data) { //文件流转BinaryString
        var o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    function createSpanValue(data) {
        string = ''
        suffix = '\r\n'
        keyList = ['姓名', '学生姓名', '性别', '语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理', '总成绩', '总分', '班级名次', '级部名次', '综合评价']
        for (var i = 0; i < keyList.length; i++) {
            key = keyList[i];
            if (key in data) {

                string += key + '：' + data[key] + suffix;
            }
        }
        return 'title ="' + string + '"';
    }

    function createInnerHtml(data) { // json 内容转网页 
        data = JSON.parse(data);

        html = '<div class="box"><div class="row">'
        var i;
        for (i = 0; i < data.length; i++) {
            if ('学生姓名' in data[i]) {
                name = data[i]['学生姓名']
            } else {
                name = data[i]['姓名']
            }
            if (data[i]['性别'] == '男') {

                html += '<span>' + '<span class="usr man" ' + createSpanValue(data[i]) + ' id="100' + (i + 1) + '">' + name + '</span></span>'
            } else {
                html += '<span>' + '<span class="usr woman" ' + createSpanValue(data[i]) + ' id="100' + (i + 1) + '">' + name + '</span></span>'
            }

            if ((i + 1) % 9 == 0) {
                html += '</div><div class="row">'
            }

        }
        i += 1;
        for (; i <= 54; i++) {
            html += '<span><span class="usr" id="100' + i + '"></span></span>'
            if (i % 9 == 0) {
                html += '</div><div class="row">'
            }
        }
        html += '</div></div>'
        return html;
    }

    $("#file").change(function() {
        if (!this.files) {
            return;
        }
        var f = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            if (rABS) {
                wb = XLSX.read(btoa(fixdata(data)), {
                    type: 'base64'
                });
            } else {
                wb = XLSX.read(data, {
                    type: 'binary'
                });
            }
            document.getElementById("displayRoom2").innerHTML = createInnerHtml(JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])));

            create_right_canvas();
        };
        if (rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
    })

})