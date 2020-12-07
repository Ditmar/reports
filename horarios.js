var pdf = require("html-pdf");
var path = require("path");
var fs = require("fs");
var Mustache = require("mustache");

var template = path.join(__dirname, "horarios.html");

var templateHtml = fs.readFileSync(template, "utf8");
function sum(date, days) {
  date.setDate(date.getDate() + days);
  return date;
}
function monday(d) {
  var data = [];
  var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  data.push({
    f: format(date),
    time: "10:00 - 10:45",
    materia: "SIS-544 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "10:45 - 11:30",
    materia: "SIS-544 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "11:30 - 12:15",
    materia: "SIS-544 G1",
    rowspan: false,
  });
  return data;
}

function tuesday(d) {
  var data = [];
  var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  data.push({
    f: format(date),
    time: "10:00 - 10:45",
    materia: "SIS-710 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "10:45 - 11:30",
    materia: "SIS-710 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "11:30 - 12:15",
    materia: "SIS-710 G1",
    rowspan: false,
  });
  return data;
}
function wendsday(d) {
  var data = [];
  var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  //console.log(date);
  data.push({
    f: format(date),
    time: "10:00 - 10:45",
    materia: "SIS-211 G2",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "10:45 - 11:30",
    materia: "SIS-211 G2",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "11:30 - 12:15",
    materia: "SIS-211 G2",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "10:00 - 10:45",
    materia: "SIS-544 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "10:45 - 11:30",
    materia: "SIS-544 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "11:30 - 12:15",
    materia: "SIS-544 G1",
    rowspan: false,
  });
  return data;
}
function thursday(d) {
  var data = [];
  var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  data.push({
    f: format(date),
    time: "14:00 - 14:45",
    materia: "SIS-719 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "14:00 - 15:30",
    materia: "SIS-719 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "15:30 - 16:15",
    materia: "SIS-719 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "16:15 - 17:00",
    materia: "SIS-710 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "17:00 - 17:45",
    materia: "SIS-710 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "17:45 - 18:30",
    materia: "SIS-710 G1",
    rowspan: false,
  });
  return data;
}
function friday(d) {
  var data = [];
  var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  data.push({
    f: format(date),
    time: "10:00 - 10:45",
    materia: "SIS-211 G2",
    rowspan: 4,
    isfour: true,
  });
  data.push({
    f: format(date),
    time: "10:45 - 11:30",
    materia: "SIS-211 G2",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "11:30 - 12:15",
    materia: "SIS-211 G2",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "12:15 - 13:00",
    materia: "SIS-211 G2",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "14:00 - 14:45",
    materia: "SIS-719 G1",
    rowspan: 3,
  });
  data.push({
    f: format(date),
    time: "14:45 - 15:30",
    materia: "SIS-719 G1",
    rowspan: false,
  });
  data.push({
    f: format(date),
    time: "15:30 - 16:15",
    materia: "SIS-719 G1",
    rowspan: false,
  });
  return data;
}
function format(date) {
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

function getDayOfTheYear(now) {
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

function generarHorarios(initDate, finishDaate) {
  var i = getDayOfTheYear(initDate);
  var limit = getDayOfTheYear(finishDaate);
  var days = 1;
  var itemstemplate = [];
  var pages = [];
  for (var i; i <= limit; i++) {
    switch (initDate.getDay()) {
      case 1: {
        itemstemplate = itemstemplate.concat(monday(initDate));

        //console.log(itemstemplate);
        break;
      }
      case 2: {
        //itemstemplate.push(tuesday(initDate));
        itemstemplate = itemstemplate.concat(tuesday(initDate));
        break;
      }
      case 3: {
        //itemstemplate.push(wendsday(initDate));
        itemstemplate = itemstemplate.concat(wendsday(initDate));
        break;
      }
      case 4: {
        //itemstemplate.push(thursday(initDate));
        itemstemplate = itemstemplate.concat(thursday(initDate));
        if (getDayOfTheYear(initDate) == getDayOfTheYear(finishDaate)) {
          pages.push({ itemstemplate });
          itemstemplate = [];
        }
        break;
      }
      case 5: {
        //itemstemplate.push(friday(initDate));
        itemstemplate = itemstemplate.concat(friday(initDate));
        pages.push({ itemstemplate });
        itemstemplate = [];
        break;
      }
    }
    initDate = sum(initDate, 1);
    //console.log(initDate);
    //console.log(initDate);
  }
  //console.log(pages[0]);
  templateHtml = templateHtml.toString();
  Mustache.parse(templateHtml);
  console.log(pages);
  var dd = Mustache.render(templateHtml.toString(), { pages: pages });
  var options = {
    format: "Letter",
    orientation: "Portrait",
    border: {
      top: "0.5in", // default is 0, units: mm, cm, in, px
      right: "0.8in",
      bottom: "0.5in",
      left: "0.8in",
    },
  };
  /*var options = {
    format: "Letter",
    orientation: "Portrait",
    border: {
      top: "0.3in", // default is 0, units: mm, cm, in, px
      right: "0.3in",
      bottom: "1.4in",
      left: "0.5in",
    },4
  };*/
  //console.log(dd);
  pdf.create(dd, options).toFile("./horarios.pdf", function (err, pdf) {
    console.log("Reporte Creado!");
  });
}
generarHorarios(new Date(2020, 10, 23), new Date(2020, 10, 27));
//generarHorarios(new Date(2020, 5, 15), new Date(2020, 9, 8));
//31/7/2020
