function getBoxData(box) {
    resultList = [];
    rowList = box.getElementsByClassName('row');
    for (var i = 0; i < rowList.length; i++) {
        result = []
        rowDataList = rowList[i].getElementsByClassName('usr');
        for (var j = 0; j < rowDataList.length; j++) {
            result.push(rowDataList[j].innerText);
        }
        resultList.unshift(result);
    }
    return resultList;
}

function getBox1Data(box1) {
    box1List = getBoxData(box1);
    // for (var i = 0; i < box1List.length; i++) {
    //     box1List[i].unshift('');
    // }
    return box1List.reverse();
}

function getBox2Data(box2) {
    return getBoxData(box2).reverse();
}

function getBox3Data(box3) {
    box3List = getBoxData(box3);
    // for (var i = 0; i < box3List.length; i++) {
    //     box3List[i].push('');
    //     box3List[i].unshift('');
    // }
    return box3List.reverse();
}

function dataMerge(box1List, box2List, box3List) {
    boxList = box3List.concat(box2List);
    return boxList.concat(box1List);
}

function dataTransfer(boxList) {
    resultList = [];
    for (var i = 0; i < 7; i++) {
        result = [];
        for (var j = 0; j < boxList.length; j++) {
            result.push(boxList[j][i]);
        }
        resultList.push(result);
    }
    return resultList;
}

function data2Csv(dataList) {
    var univeralBOM = '\uFEFF';

    string = '';
    for (var i = 0; i < dataList.length; i++) {
        for (var j = 0; j < dataList[i].length; j++) {
            string += dataList[i][j] + ',';
        }
        string += '\r\n';
    }

    string = "data:application/csv," + encodeURIComponent(univeralBOM + string);
    var x = document.createElement("A");
    x.setAttribute("href", string);
    x.setAttribute("download", "座次表.csv");
    document.body.appendChild(x);
    x.click();
}

function outputExcel() {
    data = document.body.getElementsByClassName('container')[0].getElementsByClassName('content_left')[0];
    box1List = getBox1Data(data.getElementsByClassName('box1')[0]);
    box2List = getBox2Data(data.getElementsByClassName('box2')[0]);
    box3List = getBox3Data(data.getElementsByClassName('box3')[0]);
    boxList = dataMerge(box1List, box2List, box3List);
    boxList = dataTransfer(boxList);
    data2Csv(boxList);
}