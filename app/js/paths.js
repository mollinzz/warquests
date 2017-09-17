var c = document.getElementById("paths-canvas");
var ctx = c.getContext("2d");

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function calculateKoeffs(x1, y1, x2, y2) {
  var k = null;
  var b = null;

  k = (y2 - y1) / (x2 - x1);
  b = k * x1 - y1;

  var returnObj = {
    k: k,
    b: b
  };
  return returnObj;
};

function getPoint(x1, y1, x2, y2, x3, y3, x4) {
    var koeffs = calculateKoeffs(x1, y1, x2, y2);
    if (x5 >= x3 && x5 <= 4) {
      alert();
    }
    var x5 = (y3 - koeffs.b) / koeffs.k;
    if (x5 < x3) {
        return false;
    }
    if (x5 > x4) {
        return false;
    }
    return x5;
}


function clear() {
  ctx.clearRect(0, 0, c.width, c.height)
};

$("#drawLine").click(
  function(event) {
    var x1 = $("#x1").val();
    var x2 = $("#x2").val();
    var y1 = $("#y1").val();
    var y2 = $("#y2").val();
    var x3 = $("#x3").val();
    var x4 = $("#x4").val();
    var y3 = $("#y3").val();
    event.preventDefault();
    console.log(x1);
    console.log(x2);
    console.log(y1);
    console.log(y2);
    clear();
    drawLine(x1, y1, x2, y2);
    drawLine(x3, y3, x4, y3);
    getPoint(x1, y1, x2, y2, x3, y3, x4);
  }
);

