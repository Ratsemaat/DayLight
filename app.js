//infotahvel = graafik või päikse info.
//Globaalsed muutujad ja konstandid
const marker =  L.marker([0,0]);
var chart;
const dateFormat = "DD/MM/YYYY";//Vajadusel saab siin muuta kuupäeva formaati.

//Liigutab kaardil markerit.
function moveMarker(){
  marker.setLatLng(L.latLng(document.getElementById("lat").value,
  document.getElementById("long").value));
}

//Uuendab vastavalt olekule infotahvlit.
function update(){
  var chartBtn = document.getElementById("chartState");
  if(!chartBtn.className.includes("active")){
    getTimes();
  }else{
  updateChart();
  }
}

//Päiksetõusu/loojangu olekusse minek. Kui ei ole veel selles olekus, siis vahetab
//infotahvlit ja kuvab kasutajale nupu abil õige oleku.
function toSunState(){
  var sunBtn = document.getElementById("sunState");
  if (!sunBtn.className.includes("active")){
    changeInterface();
    changeStateSwitch();
  }
  update();
}

//graafikuga olekusse minek. Kui ei ole veel selles olekus, siis vahetab
//infotahvlit ja kuvab kasutajale nupu abil õige oleku.
function toChartState(){
  var chartBtn = document.getElementById("chartState");
  if (!chartBtn.className.includes("active")){
    changeInterface();
    changeStateSwitch();
  }
  update();
}

//Muudab valiktahvlit.
//Peidab eelmise infotahvli jaoks vajalikud väljad ja teeb uued infotahvli
//nähtavaks.
function changeInterface(){
  var sunContainer = document.getElementById("sunContainer");
  var chartContainer = document.getElementById("chartContainer");
  var dayRange = document.getElementById("dayRange");
  var dateEnd = document.getElementById("dateEnd");

  if (sunContainer.className.includes(" hidden")){
    sunContainer.className = sunContainer.className.replace(" hidden","");
    chartContainer.className+=" hidden";
    dayRange.className += " hidden";
    dateEnd.className += " hidden";
  }else if(chartContainer.className.includes(" hidden")) {
    chartContainer.className = chartContainer.className.replace(" hidden","");
    sunContainer.className+=" hidden";
    dayRange.className= dayRange.className.replace("hidden","");
    dateEnd.className= dateEnd.className.replace("hidden","");
  }
}

//Lülitab oleku nuppu.
//Muudab nuppude välimust ja muudab õige nupu aktiivseks
function changeStateSwitch(){
  var chartBtn = document.getElementById("chartState");
  var chartIcn = document.getElementById("chartStateIcon");
  var sunBtn = document.getElementById("sunState");
  var sunIcn = document.getElementById("sunStateIcon");
  if (chartBtn.className.includes(" active")){
    sunBtn.className +=" active";
    sunIcn.className += " yellow";
    chartBtn.className = chartBtn.className.replace(" active","");
    chartIcn.className = chartIcn.className.replace(" green","");
  } else if(sunBtn.className.includes(" active")){
    sunBtn.className = sunBtn.className.replace(" active","")
    sunIcn.className = sunIcn.className.replace(" yellow","");
    chartBtn.className += " active";
    chartIcn.className += " green";
  }
}

//Võtab uued andmed ja joonistab seejärel uue graafiku.
function updateChart(){
  var dateEnd = document.getElementById("dateEnd");
  var startDate = document.getElementById("date");
  var value = new Date(startDate.value);
  value = value.addDays(parseInt(document.getElementById("dayRange").value));
  dateEnd.textContent = moment(value).format(dateFormat);
  plotChart()
};

//Meetod võtab kastuaja poolt antud kuupäeva ja koordianaadid ning kuvab
//päikese infotahvlile päikesetõusu, päikeseloojangu ning päikselise aja pikkuse.
function getTimes(){
  if( document.getElementById("date").value==""){
    document.getElementById("sunriseTime").innerHTML = "-";
    document.getElementById("sunsetTime").innerHTML = "-";
    document.getElementById("sunTime").innerHTML = "-";
    return;
  }

  var date = document.getElementById("date").value;
  var long = document.getElementById("long").value;
  var lat = document.getElementById("lat").value;
  var times = SunCalc.getTimes(new Date(date),lat, long);

  var sunriseStr = ("0"+times.sunrise.getUTCHours()).slice(-2) +
  ':' + ("0"+times.sunrise.getMinutes()).slice(-2)+" UTC";

  var sunsetStr = ("0"+times.sunset.getUTCHours()).slice(-2) +
  ':' + ("0"+times.sunset.getMinutes()).slice(-2)+" UTC";

  var sunUp = getSunUp(times, new Date(date));
  if (sunUp==1440 || sunUp == 0){
    sunsetStr="-";
    sunriseStr="-";
  }
  var h = ~~(sunUp/60); //Jäägita jagamine.
  var min = sunUp-h*60;
  var sunUpStr=h + "h " + ("0" + min).slice(-2) + "min";

  document.getElementById("sunriseTime").innerHTML = sunriseStr;
  document.getElementById("sunsetTime").innerHTML = sunsetStr;
  document.getElementById("sunTime").innerHTML = sunUpStr;
}

//Arvutab, mitu minutit antud kuupäeva ning päikesetõusu ja -loojangu juures
//päike taevas oli.
function getSunUp(times, date){
  //Polaaröö või päev. suncalc ei osanud nendega toimetada.
  if(times.sunrise=="Invalid Date" && document.getElementById("date").value!=""){
    let move2eq = SunCalc.getTimes(date,
     document.getElementById("lat").value/2,
     document.getElementById("long").value);
    if (parseInt(getSunUp(move2eq,date))>=720){
      return 1440;
    }else {
      return 0;
    }
  }
  //Tavajuht, kus on olmas päisestõusu ja päikesloojangu ajad.
  var min = times.sunset.getMinutes()-times.sunrise.getMinutes();
  var h = times.sunset.getHours()-times.sunrise.getHours();
  if(min<0){
    h-=1;
    min+=60;
  }
  h=(h+24)%24;

  return h*60+min;
}

//Funktsioon, mis kaardile vajutades uuendab koordinaate ja kutsub välja
//markeri liigutamise ja infotahvli värskendamise.
function onMapClick(e) {
  var mapY = e.latlng["lat"];
  var mapX = e.latlng["lng"];
  while(mapX < -180){
    mapX+=360;
  }
  while(mapY < -90){
    mapY+=180;
  }
  while(mapX > 180){
    mapX-=360;
  }
  while(mapY > 90){
    mapY-=180;
  }
  document.getElementById("lat").value = mapY.toFixed(6);
  document.getElementById("long").value = mapX.toFixed(6);
  moveMarker();
  update();
}

//https://stackoverflow.com/questions/6982692/how-to-set-input-type-dates-default-value-to-today
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});


//Päevade liitmine.
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//Meetod leidmaks kuupäevi poollõigus[Date startDate, Date stopDate)
function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate < stopDate) {
      dateArray.push(moment(new Date (currentDate).toDateInputValue()).format(dateFormat));
      currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

//Meetod leidmaks, päikeselist ja pimedata aega päevade poollõigus[startDate, stopDate]
function getDayData(startDate, stopDate) {
  var sunRises = new Array();
  var sunSets = new Array();
  var sunUps = new Array();
  var sunUps2 = new Array();
  var currentDate = startDate;
  var lat = document.getElementById("lat").value
  var lng = document.getElementById("long").value

  var sunSet=0;
  var sunRise=0;
  while (currentDate < stopDate) {
    var times = SunCalc.getTimes(currentDate, lat, lng);
    var sunUp = getSunUp(times, currentDate);
    var sunUp2=0;
    if (sunUp == 0){
      sunRise = 1440;//enne päikesetõusu on terve 1440 minutit ehk terve päev.
      sunSet=0;
    } else if (sunUp == 1440) {
      sunRise = 0;
      sunSet = 0;
    }else {
      sunRise = times.sunrise.getHours() * 60 + times.sunrise.getMinutes();
      sunSet = times.sunset.getHours() * 60 + times.sunset.getMinutes();
      if(sunRise>sunSet){//Kui loojang on enne tõusu.
        sunUp2=sunSet;
        sunRise=1440-sunUp; //Ülejäänud osa päevast
        sunSet=0//Märguanne, et üüpäeva graafik algas päevaga.
      }else{
        sunSet=1440-sunRise-sunUp;//Kui algab ööga, siis vaab nii teha.
      }
    }
    sunSets.push(sunSet/60);
    sunRises.push(sunRise/60);
    sunUps.push(sunUp/60);
    sunUps2.push(sunUp2/60);
    currentDate = currentDate.addDays(1);
  }
  return [sunRises, sunUps, sunSets, sunUps2];
}


//Meetod leidmaks vajalik info graafiku jaoks. Kuupäevad x teljele ning öö ning
//päikselise ja päikseta perioodi pikkused y teljele.
function getData(){
  var returnable=[];
  var startDay = new Date(document.getElementById("date").value);
  var endDay = new Date(moment(document.getElementById("dateEnd").textContent, dateFormat)).addDays(1);
  var dd = getDayData(startDay, endDay);

  returnable[0]=getDates(startDay, endDay);
  returnable[1]=dd[0];
  returnable[2]=dd[1];
  returnable[3]=dd[2];
  returnable[4]=dd[3];
  return returnable;
}

//Joonistab graafiku.
function plotChart(){
  var data = getData();
  var ctx = document.getElementById("myChart");
  if (chart!=null)chart.destroy();
  console.log(data);
  chart = new Chart(ctx, {
    type: 'bar',
    data: {

      labels:data[0],
      datasets:[
        {
          label:"Daylight_0",
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          backgroundColor: [
            'rgba(255, 206, 94, 0.3)',
          ],
          data:data[4],
          stack:"dayTotal",
        },
        {
          label:"Dawn",
          backgroundColor: [
            'rgba(150, 150, 150, 0.3)',
          ],
          data:data[1],
          stack:"dayTotal",
          categoryPercentage: 1.0,
          barPercentage: 1.0,
        },
        {
          label:"Daylight",
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          backgroundColor: [
            'rgba(255, 206, 94, 0.3)',
          ],
          data:data[2],
          stack:"dayTotal",
        },
        {
          label:"Dusk",
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          backgroundColor: [
            'rgba(150, 150, 150, 0.3)',
          ],
          data:data[3],
          stack:"dayTotal",

      },
      ]
    },
    options: {
      plugins:{
        legend: {
          display: false,
        },
        tooltip: {
          enabled:true,
          callbacks: {
               label: function(tooltipItem, index) {

                    if(tooltipItem.dataset.label=="Daylight"){
                      var daytime = data[2][tooltipItem.dataIndex]+
                      +data[4][tooltipItem.dataIndex];
                      var h =  ~~(daytime);
                      var mins = Math.round((parseFloat(daytime)-h)*60);
                      return "Daylight: "+h+"h " +mins+ "min";
                    }else if(tooltipItem.dataset.label=="Dusk"){
                      var nighttime = data[1][tooltipItem.dataIndex]+
                      +data[3][tooltipItem.dataIndex];
                      var h =  ~~(nighttime);
                      var mins = Math.round((parseFloat(nighttime)-h)*60);
                        return "Nighttime: "+h+"h " +mins+ "min";
                    }
                    return;
                    if (h==24 || h==0 && mins==0)return tooltipItem.dataset.label+" -"
                    return tooltipItem.dataset.label+" "+("0"+h).slice(-2)+
                    ":"+("0"+mins).slice(-2);
               }
            }
        },
      },
      scales: {
        y: {
          stacked:true,
          max:24,
          min:0,
        },
        x: {
          ticks:{
            maxTicksLimit: 12,
          }
        }
      }
    }
  });
}

$(document).ready(function(){
  //Kuupäevale vaikeväärtusena tänase päeva.
  var date = document.getElementById("date").value
  if(date==""){
    date = new Date().toDateInputValue();
    document.getElementById("date").value  = date;
  }
  //vaikeväärtus graafiku lõpui kuupäeva jaoks.
  document.getElementById("dateEnd").textContent = moment(new Date(date).addDays(
    parseInt(document.getElementById("dayRange").value))).format(dateFormat);
  toSunState();


  var lat = document.getElementById("lat").value;
  var long = document.getElementById("long").value;
  var mymap = L.map('mapid',{
    maxBounds:  [
      [-90, -180],
      [90, 180]
      ],
  }).setView([lat, long], 2);


  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmF0c2VtYWF0IiwiYSI6ImNrbnlkeXowZjFmamUybm9hOXJmaWVodTUifQ.bYSPCgnmaoRaoJ446SwG-w', {
    maxZoom: 18,
    minZoom:1,
    //bounds:L.latLngBounds(L.latLng(90,90), L.latLng(-90,-90)),
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(mymap);

  marker.addTo(mymap);
  moveMarker();


  mymap.on('click', onMapClick);

});
