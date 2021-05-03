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
    chartContainer.className = sunContainer.className.replace(" hidden","");
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
    sunIcn.className = chartIcn.className.replace(" yellow","");
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
  var mapX = e.latlng["lat"];
  var mapY = e.latlng["lng"];
  while(mapX < -180){
    mapX+=360;
  }
  while(mapY < -180){
    mapY+=360;
  }
  while(mapX > 180){
    mapX-=360;
  }
  while(mapY > 180){
    mapY-=360;
  }
  document.getElementById("lat").value = mapX.toFixed(6);
  document.getElementById("long").value = mapY.toFixed(6);
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

//Meetod leidmaks päevade pikkusi poollõigus[Date startDate, Date stopDate)
function getDayLengths(startDate, stopDate) {
  var dayLenghts = new Array();
  var currentDate = startDate;
  var lat = document.getElementById("lat").value
  var lng = document.getElementById("long").value
  while (currentDate < stopDate) {
    var times = SunCalc.getTimes(currentDate, lat, lng);
    dayLenghts.push(getSunUp(times, currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dayLenghts;
}

//Meetod leidmaks vajalik info graafiku jaoks. Kuupäevad x teljele ning öö ning
//päikselise ja päikseta perioodi pikkused y teljele.
function getData(){
  var returnable=[];
  var startDay = new Date(document.getElementById("date").value);
  var endDay = new Date(moment(document.getElementById("dateEnd").textContent, dateFormat)).addDays(1);
  var dl = getDayLengths(startDay, endDay);

  returnable[0]=getDates(startDay, endDay);
  returnable[1]=dl.map(function(length){return length/60});
  returnable[2]=dl.map(function(length){return 24-length/60});
  return returnable;
}

//Joonistab graafiku.
function plotChart(){
  var data = getData();
  var ctx = document.getElementById("myChart");
  if (chart!=null)chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',

    data: {
      showLine:false,
      labels:data[0],
      datasets:[{
        label: "day",
        fill:true,
        backgroundColor: [
          'rgba(255, 206, 64, 0.5)',
        ],
        data:data[1],
        stack:"dayTotal",
      },
      {
          label:"night",
          fill:true,
          backgroundColor: [
            'rgba(150, 150, 150, 0.4)',
          ],
          data:data[2],
          stack:"dayTotal",
          showLine:false,
        },
        ]
    },
    options: {
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
