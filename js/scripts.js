/**
 * 전원 동작 출력 부분
 * Power state
 */
let state = {
    value : 1
}; //임시 선언

//System Stop
if (state.value === 0) {
    $(function (){
        $(".circle").css({
            "border": "17px #DC3545 solid"
        })
    })
}
//System Start
else if (state.value === 1) {
    $(function (){
        $(".circle").css({
            "border": "17px #198754 solid",
        })
    })
}
//System Pause
else{
    $(function (){
        $(".circle").css({
            "border": "17px #F27B25 solid"
        })
    })
}

/**
 * 현재 시간 출력 부분
 * Present Time
 */
function clock(){
    let date = new Date();
    let nowYear = date.getFullYear();
    let month = date.getMonth();
    let clockDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // 오전 or 오후 저장 변수
    let amOrPm = "AM";

    // 12시 이상일 시
    if (hours >= 12) {
        amOrPm = "PM";
        hours -= 12;
    }

    let hours_str = hours < 10 ? "0"+hours : hours;
    let minutes_str = minutes < 10 ? "0"+minutes : minutes;
    let seconds_str = seconds < 10 ? "0"+seconds : seconds;

    if (clockDate < 10) {
        clockDate = "0" + clockDate;
    }

    $(".bn_date").html(nowYear + "-" + (month+1) + "-" + clockDate + " " + //날짜
        amOrPm + hours_str + ":"+minutes_str + ":" + seconds_str);         //시간

}

/**
 * Rack Data
 * API Call / Parsing
 */
const url = "http://121.178.2.4:9000/api?api_key=2a618e17de2f851d74216ddef0256bc1";
function apiCall() {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let rack2 = data.rack2[0]; //배터리실 온ㆍ습도
            let rack3 = data.rack3[0]; //실내 온ㆍ습도 1
            let rack4 = data.rack4[0]; //실내 온ㆍ습도 2
            let rack5 = data.rack5[0]; //실내 온ㆍ습도 3

            $("#battery-tem").html("온도 : " + rack2['sd1'] + "(℃)");
            drawChart2(rack2['sd1'], "batteryTem-chart");

            $("#batteryRoom-tem").html("온도 : " + rack2['sd1'] + " (℃)");
            $("#batteryRoom-hum").html("습도 : " + rack2['sd2'] + " (%)");
            drawChart(rack2['sd1'], rack2['sd2'], "batteryRoom-chart");

            $("#indoor1-tem").html("온도 : " + rack3['sd1'] + " (℃)");
            $("#indoor1-hum").html("습도 : " + rack3['sd2'] + " (%)");
            drawChart(rack3['sd1'], rack3['sd2'], "indoor1-chart");

            $("#indoor2-tem").html("온도 : " + rack4['sd1'] + " (℃)");
            $("#indoor2-hum").html("습도 : " + rack4['sd2'] + " (%)");
            drawChart(rack4['sd1'], rack4['sd2'], "indoor2-chart");

            $("#indoor3-tem").html("온도 : " + rack5['sd1'] + " (℃)");
            $("#indoor3-hum").html("습도 : " + rack5['sd2'] + " (%)");
            drawChart(rack5['sd1'], rack5['sd2'], "indoor3-chart");

        });
}

/**
 * 임시
 * 난수 생성
 * 배터리 온도, 금일 충방전량, 배터리 용량, 배터리(Volt, Ampere)
 */
function randomNumberMaker(){

    const todayCharge = Math.floor(Math.random() * 80) + 30;
    const todayDischarge = Math.floor(Math.random() * 50) + 30;

    const batteryVolume = Math.floor(Math.random() * 50) + 50;

    const batteryVolt = Math.floor(Math.random() * 20) + 40;
    const batteryAmpere = Math.floor(Math.random() * 20) + 40;

    $("#today-charge").html("충전량 : " + todayCharge + " (kWh)");
    $("#today-discharge").html("방전량 : " + todayDischarge + " (kWh)");

    $("#battery-volume").html("용량 : " + batteryVolume + "% (SoC)");
    drawingBatterySocChart(batteryVolume);

    $("#battery-volt").html("전압 : " + batteryVolt + " (V)");
    $("#battery-ampere").html("전류 : " + batteryAmpere + " (A)");

    //차트 크기 반응형 핸들러 -start
    function resizeHandler () {
        drawingBatterySocChart(batteryVolume);
    }
    if (window.addEventListener) {
        window.addEventListener('resize', resizeHandler, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onresize', resizeHandler);
    }
    //차트 크기 반응형 핸들러 -end
}

function init() {
    clock();
    apiCall()
    randomNumberMaker()

    setInterval(clock, 1000);               //현재 시간 1초 루프
    setInterval(apiCall, 10000);            //API 10초 루프
    setInterval(randomNumberMaker, 10000);  //난수 생성 10초 루프

}
//Static Resource 모두 로딩 후 Start
$(window).on('load', function(){
    init();
});

/**
 * Google Chart
 */
google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart, drawChart2);

//인수 3개 짜리 차트
function drawChart(tem, hum, tagName) {
    let data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Temperature', Number(tem)],
        ['Humidity', Number(hum)],
    ]);

    let options = {
        width: "100%", height: "100%",
        yellowFrom:75, yellowTo: 90,
        redFrom: 90, redTo: 100,
        minorTicks: 5,
        legend: "test"
    };

    let chart = new google.visualization.Gauge(document.getElementById(tagName));

    chart.draw(data, options);

    //차트 크기 반응형 핸들러 -start
    function resizeHandler () {
        chart.draw(data, options);
    }
    if (window.addEventListener) {
        window.addEventListener('resize', resizeHandler, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onresize', resizeHandler);
    }
    //차트 크기 반응형 핸들러 -end
}

//인수 2개 짜리 차트
function drawChart2(tem, tagName) {

    let data;
    if (tagName === "batteryTem-chart"){
        data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Temperature', Number(tem)]
        ]);
    }else if(tagName == "batteryVolume-chart"){
        data = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Volume', Number(tem)]
        ]);
    }



    let options = {
        width: "100%", height: "100%",
        yellowFrom:75, yellowTo: 90,
        redFrom: 90, redTo: 100,
        minorTicks: 5,
        legend: "test"
    };

    let chart = new google.visualization.Gauge(document.getElementById(tagName));

    chart.draw(data, options);

    //차트 크기 반응형 핸들러 -start
    function resizeHandler () {
        chart.draw(data, options);
    }
    if (window.addEventListener) {
        window.addEventListener('resize', resizeHandler, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onresize', resizeHandler);
    }
    //차트 크기 반응형 핸들러 -end
}

/**
 * c3.js Chart
 */
function drawingBatterySocChart(batteryVolume) {
    var chart = c3.generate({
        bindto: '#batteryVolume-chart',
        data: {
            columns: [
                ['Volume', batteryVolume]
            ],
            type: 'gauge',
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        }
    });
}




