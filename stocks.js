var margin = {top: 10, right: 20, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseTime = d3.time.format("%Y-%m-%d").parse;
var formatDate = d3.time.format("%Y-%m-%d");

function niceDate(dd) {
  dd = new Date(dd);
  return (dd.getMonth() + 1) + '/' + dd.getDate() + '/' +  dd.getFullYear();
}

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .tickFormat(d3.time.format('%m/%d/%y'))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    if (d.close != undefined) {
      return "<span style='color:black'>" + niceDate(d.date) + "<br>$" + Math.round(d.close*100)/100 + "</span>";
    }
  })

function timeChg(toto) {
  runChart();
}

function tickerChg(tutu) {
  //$("#debug").html(tutu.name);
  $("#activeTicker").html(tutu.name); 
  runChart();
}


function runChart() {

  //var runTime = "1month"
  var runTicker = $("#activeTicker").text();
  var runTime = $('input[name=times]:checked').val();
  //$("#debug").html(runTime)
  $("#charty").html("");
  
  var endDate = new Date().toISOString().substring(0, 10);

  if (runTime === "5days") {var theVar = 5;}
  if (runTime === "1month") {var theVar = 30;}
  if (runTime === "3months") {var theVar = 90;}
  if (runTime === "6months") {var theVar = 180;}
  if (runTime === "1year") {var theVar = 365;}
  
  var startDate = new Date(Date.now() - theVar*24*60*60*1000).toISOString().substring(0, 10);
  


  var svg = d3.select("#charty").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//    $("#debug").html("hi " + width);
  svg.call(tip);


  var url1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20(%22" + runTicker + "%22)%20and%20startDate%3D%22" + startDate + "%22%20and%20endDate%3D%22" + endDate + "%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

  $.getJSON(url1, function(json) {
    
    var data = [];
    var d = [];

    //$("#debug").html(json.query.results.quote[0].Date);
    for (var i = (json.query.results.quote.length-1); i >= 0 ; i--) {
      var dateTemp = +parseTime(json.query.results.quote[i].Date);
      var closeTemp = json.query.results.quote[i].Close;
      data.push({"date": dateTemp, "close": closeTemp});
    }
    //$("#debug").html(dateFormat(data[0].date,"YYYY"));
  
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));
    
   
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line) 
    
svg.selectAll(".circle")
     .data(data)
     .enter()
     .append("svg:circle")
     .attr("class", "circle")
     .attr("cx", function (d) {
        return x(d.date);
     })
     .attr("cy", function (d) {
       return y(d.close);
     })
     .attr("r", 4)
     .attr("fill", "#4682B4")
     .on('mouseover', tip.show)
     .on('mouseout', tip.hide)
  });
  
};

function type(d) {
  d.date = d.date;
  d.close = +d.close;
  return d;
}

