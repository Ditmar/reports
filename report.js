
var pdf = require('html-pdf')
var path = require('path')
var fs = require('fs')
var Mustache = require('mustache');
const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
  sourceFile: 'newexcel.xlsx'
});
const studentsdata = excelToJson({
  sourceFile: 'segundasinstancias.xlsx'
});

function getMainTitle(key) {
  return result[key][0]['C'].toUpperCase();
}
function getMainModule(key) {
  return result[key][1]['C'].toUpperCase();
}
function getDocente(key) {
  return result[key][2]['A'].toUpperCase() + " " + result[key][2]['C'].toUpperCase();
}
function getGrupo(key) {
  return result[key][1]['M'].toString().toUpperCase() + " " + result[key][1]['N'].toString().toUpperCase();
}
function getGestion(key) {
  return result[key][2]['M'].toString().toUpperCase() + " " + result[key][2]['N'].toString().toUpperCase();
}
function getColums(key) {
  var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var cad = result[key][2]['T'].match(/\w/g);
  var i = abc.indexOf(cad[0]);
  var j = abc.indexOf(cad[1]);
  return [i, j];
}
function getColumsColor(key) {
  var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var cad = result[key][1]['T'].match(/\w/g);
  var i = abc.indexOf(cad[0]);
  var j = abc.indexOf(cad[1]);
  return [i, j];
}

function convertHeader(result, key) {
  var obj = result[key][3];
  var h = { "header": [] };
  var keys = Object.keys(obj);
  h['header'].push('Nro');

  for (var j = 0; j < keys.length; j++) {
    if (j != 3 && j != 0) {
      h['header'].push(obj[keys[j]]);
    }
    if (j == 0) {
      h['header'].push('ci');
    }
  }
  var aux = h['header'][3];
  h['header'][3] = h['header'][2];
  h['header'][2] = aux;
  return h;
}


function convertDataBody(result, key) {
  var data = [];
  var count = 1;
  var colums = getColumsColor(key);
  var columsRep = getColums(key);
  var stats = {};
  var secondcount = 1;
  var secondinstancereport = [];
  stats['segundainstancia'] = 0;
  stats['aprobados'] = 0;
  stats['reprobados'] = 0;
  stats['abandonos'] = 0;
  stats['total'] = 0;

  for (var i = 4; i < result[key].length; i++) {
    var obj = result[key][i];
    //console.log(obj);
    var keys = Object.keys(obj);
    var h = { "body": [] };
    h['body'].push({ value: count });
    if (i != 0) {

      for (var j = 0; j < keys.length; j++) {
        if (columsRep[0] == j) {
          if (Number(obj[keys[j]]) > 0 && Number(obj[keys[j]]) < 70) {
            stats['segundainstancia']++;
            secondinstancereport.push({ ci: obj['A'], secondcount, name: obj[keys[1]].toString(), lastname: obj[keys[2]].toString(), note: obj[keys[j + 1]].toString(), h1: 1, h2: 2, h3: j + 1 });
            secondcount++;
          }
          if (Number(obj[keys[j]]) >= 70) {
            stats['aprobados']++
          }
          if (Number(obj[keys[j]]) == 0) {
            stats['abandonos']++
          }

        }
        if (j != 3) {
          if (j == 1 || j == 2) {
            h['body'].push({ isname: true, value: obj[keys[j]] });
          } else if (colums[0] == j || colums[1] == j) {
            h['body'].push({ color: true, value: obj[keys[j]] });
          } else if (columsRep[1] == j || columsRep[0] == j) {
            if (Number(obj[keys[j]]) < 70) {
              h['body'].push({ red: true, color: true, value: obj[keys[j]] });
            } else {
              h['body'].push({ color: false, value: obj[keys[j]] });
              //stats['aprobados']++;
            }
          } else {
            h['body'].push({ isname: false, value: obj[keys[j]] });
          }
        }
      }
      var aux = h["body"][3];
      h['body'][3] = h['body'][2];
      h['body'][2] = aux;
      data.push(h);
    }
    count++;
  }
  stats['total'] = count - 1;
  return { data, stats, secondinstancereport };
}
var totaldata = [];
var totalsecond = [];
var pages = Object.keys(result);
//Estadistica detallada de las notas
for (var i = 0; i < pages.length; i++) {
  var data = convertDataBody(result, pages[i]);
  var header = convertHeader(result, pages[i]);
  var title = "EVALUACIÓN ACTIVIDADES DEL PROCESO FORMATIVO EN PLATAFORMA VIRTUAL";
  var titlemaster = getMainTitle(pages[i]);
  var grupo = getGrupo(pages[i]);
  var gestion = getGestion(pages[i]);
  var module = getMainModule(pages[i]);
  var docente = getDocente(pages[i]);
  var image = path.join('file://', __dirname, 'up_logo.jpeg')
  //aqui habia un if
  if (data.secondinstancereport.length > 0) {
    totalsecond.push({ image, gestion, docente, grupo, title, titlemaster, module, body: data.secondinstancereport });
  }
  totaldata.push({ header, data: data.data, titlemaster, module, docente, image, title, stats: data.stats, grupo, gestion });
}
const estadistica1 = {
  title: "Datos Estadísticos"
};
estadistica1["body"] = []
var count = 1;
var totalseginstancia = 0;
var totalaprobados = 0;
var totalreprobados = 0;
var totalabandonos = 0;
var totalmatriculados = 0;
for (var i = 0; i < totaldata.length; i++) {
  totalseginstancia += totaldata[i].stats.segundainstancia;
  totalaprobados += totaldata[i].stats.aprobados;
  totalreprobados += totaldata[i].stats.reprobados;
  totalabandonos += totaldata[i].stats.abandonos;
  totalmatriculados += totaldata[i].stats.total;
}
//console.log(totaldata[0].stats);
for (var i = 0; i < totaldata.length; i++) {
  estadistica1.body.push({
    docente: totaldata[i].docente,
    stats: totaldata[i].stats,
    grupo: totaldata[i].grupo,
    count
  });
  count++;
}
estadistica1["image"] = path.join('file://', __dirname, 'up_logo.jpeg')
estadistica1["titlemaster"] = totaldata[0].titlemaster;
estadistica1["module"] = totaldata[0].module
estadistica1["totalseginstancia"] = totalseginstancia;
estadistica1["totalaprobados"] = totalaprobados;
estadistica1["totalreprobados"] = totalreprobados;
estadistica1["totalabandonos"] = totalabandonos;
estadistica1["totalmatriculados"] = totalmatriculados;

//Estadistica detalladas segundo turno
if (totalsecond.length > 0) {
  for (var i = 0; i < totalsecond.length; i++) {
    totalsecond[i]["aprobados"] = 0;
    totalsecond[i]["headers"] = ["Nro"];
    totalsecond[i]["reprobados"] = 0;
    totalsecond[i]["total"] = totalsecond[i].body.length;
    for (var j = 0; j < totalsecond[i].body.length; j++) {
      var ii = j + 1;
      if (checkisProblem(totalsecond[i].body[j]['ci'])) {
        totalsecond[i].body[j].note = "No corresponde";
      }
      if (totalsecond[i].body[j].hasOwnProperty("h" + ii)) {
        var keysdata = Object.keys(result[pages[i]][3]);
        totalsecond[i]["headers"].push(result[pages[i]][3][keysdata[parseInt(totalsecond[i].body[j]["h" + ii])]]);
      }
      if (Number(totalsecond[i].body[j].note) >= 70) {
        totalsecond[i]["aprobados"]++;
      } else {
        totalsecond[i]["reprobados"]++;
      }
    }
    //intercambiamos
    var aux = totalsecond[i]["headers"][2];
    totalsecond[i]["headers"][2] = totalsecond[i]["headers"][1];
    totalsecond[i]["headers"][1] = aux;
  }
}

function checkisProblem(ci) {
  for (var i = 0; i < studentsdata["hoja"].length; i++) {
    if (studentsdata["hoja"][i]['M'].toString() == ci) {
      return true;
    }
  }
  return false;
}


var template = path.join(__dirname, 'businesscard.html')
var filename = template.replace('.html', '.pdf')
var templateHtml = fs.readFileSync(template, 'utf8')

const finalreport = JSON.parse(JSON.stringify(estadistica1));

//set new values
for (var i = 0; i < finalreport.body.length; i++) {
  for (var j = 0; j < totalsecond.length; j++) {
    if (finalreport.body[i].grupo == totalsecond[j].grupo) {
      finalreport.body[i].stats.aprobados += totalsecond[j].aprobados;
      finalreport.body[i].stats.reprobados += totalsecond[j].reprobados;
      finalreport["totalaprobados"] += totalsecond[j].aprobados;
      finalreport["totalreprobados"] += totalsecond[j].reprobados;
      //finalreport.body[i].stats.abandonos += totalsecond[j].abandonos;
    }
  }
  //finalreport.body[i].stats.aprobados += totalsecond[i].aprobados;
  //finalreport.body[i].stats.abandonos =
}
//finalreport["totalseginstancia"] = 0;
//finalreport["totalaprobados"] = 0;
//finalreport["totalreprobados"] = 0;
//finalreport["totalabandonos"] = 0;
//finalreport["totalmatriculados"] = 0;

console.log(finalreport);

Mustache.parse(templateHtml);
var templateHtml = Mustache.render(templateHtml, { pagina: totaldata, estadisticaparcial: estadistica1, secondreport: totalsecond, final: finalreport });

var options = {
  "format": "Letter",
  "orientation": "landscape",
  "border": {
    "top": "0.7in",            // default is 0, units: mm, cm, in, px
    "right": "1in",
    "bottom": "1in",
    "left": "1in"
  }
}
pdf.create(templateHtml, options).toFile(filename, function (err, pdf) {
  console.log("Reporte Creado!");
});
