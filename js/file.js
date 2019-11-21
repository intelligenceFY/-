function upload() {
    $("#x").html("");
    $("#list").html("");
    var cvrp = new FormData();
    cvrp.append("cvrp", $("#myfile")[0].files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            var percent = Math.round(event.loaded * 100 / event.total);
            console.log('%d', percent);
            $("#upprog").text(percent);
        }
    };
    xhr.onloadstart = function(event) {

        $("#stopbtn").one('click', function() {
            xhr.abort();
            $(this).hide();
        });
        loading(true);
    };
    xhr.onload = function(event) { //请求完成
        console.log('5');

        console.log(xhr.responseText);
        var ret = JSON.parse(xhr.responseText);
        var huafei = ret.cost;
        var pointes = ret.pointes;
        console.log(pointes.length);
        pay(huafei);
        way(pointes);
        console.log(ret.cost);
    };
    xhr.error = function(event) { //请求失败
        console.log('2');
        alert("请求失败，请重新上传文件！");
    };
    xhr.onabort = function(event) {
        console.log('3');
        $("#upprog").text('3');
    };
    xhr.onloadend = function(event) {
        loading(false);
    };
    xhr.open('POST', 'http://172.33.23.77:5000/cvrp', true);
    xhr.send(cvrp);
}

function loading(showloading) {
    if (showloading) {
        show();
    } else {
        closeDiv();
    }
}

function show() {
    var Idiv = document.getElementById('popupdiv');
    Idiv.style.display = "block";
    Idiv.style.left = (document.documentElement.clientWidth - Idiv.clientWidth) / 2 + document.documentElement.scrollLeft + "px";
    Idiv.style.top = (document.documentElement.clientHeight - Idiv.clientHeight) / 2 + document.documentElement.scrollTop + "px";

    var procbg = document.createElement("div");
    procbg.setAttribute("id", "mybg");
    procbg.style.background = "#000000";
    procbg.style.width = "100%";
    procbg.style.height = "100%";
    procbg.style.position = "fixed";
    procbg.style.top = "0";
    procbg.style.left = "0";
    procbg.style.zIndex = "500";
    procbg.style.opacity = "0.6";
    procbg.style.filter = "Alpha(opacity=70)";

    document.body.appendChild(procbg);
    document.body.style.overflow = "hidden";

    var posX;
    var posY;
    Idiv.onmousedown = function(e) {
        if (!e) e = window.event;
        posX = e.clientX - parseInt(Idiv.style.left);
        posY = e.clientY - parseInt(Idiv.style.top);
        document.onmousemove = mousemove;
    }
    document.onmouseup = function() {
        document.onmousemove = null;
    }


    function mousemove(ev) {
        if (ev == null) ev = window.event;
        Idiv.style.left = (ev.clientX - posX) + "px";
        Idiv.style.top = (ev.clientY - posY) + "px";
    }
}

function closeDiv() //关闭弹出层
{
    var Idiv = document.getElementById('popupdiv');
    Idiv.style.display = "none";
    document.body.style.overflow = "auto"; //恢复页面滚动条
    var body = document.getElementsByTagName("body");
    var mybg = document.getElementById("mybg");
    body[0].removeChild(mybg);
}

function pay(huafei) {
    var x = document.getElementById("x");
    var display = document.createElement("p");
    x.appendChild(display);
    // pText.innerHTML("");
    var pText = document.createTextNode("该物流运输路径花费需要：" + huafei + "元");
    display.appendChild(pText);
}

function way(pointes) {
    var str = "";
    for (var i = 0; i < pointes.length; i++) {
        str += '<li class="list" style= "margin-top:20px;margin-left:40px;letter-spacing:5px;">' + pointes[i] + '</li>';
    }
    $("#title").text("路径规划如下");
    $("#list").html(str);
}