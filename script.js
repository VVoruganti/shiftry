var data = $("#data").val();

var database = firebase.database();
var assassinArray = [];


function sort(){
  data = $("#data").val();
  var filter = data.split(/\n/);
  for(var i = 0; i < filter.length; i++) {
  filter[i] = filter[i].split(",");
  }
  for(var i = 0; i <filter.length; i++) {
    assassinArray.push(filter[i][0]);
  }
  //console.log(assassinArray);
  //console.log(filter);
  setDatabase(filter);
  match();
}

function resetDatabase() {
  database.ref("Players").set({name:"name"})
}


function setDatabase(playerInfo) {
  resetDatabase();
  for(var i = 0; i<playerInfo.length;i++) {
    database.ref("Players").update({
      [playerInfo[i][0]]:"1"
    })
  }
  for(var i = 0; i < playerInfo.length; i++) {
    var email = String(playerInfo[i][1]);
    var phone = String(playerInfo[i][2]);
    database.ref('Players/' + playerInfo[i][0]).set({
      Email:email,
      PhoneNumber:phone,
      Status:"Active"
  });
  }
  database.ref("Players").update({name:null});
}

//return Math.floor(Math.random() * (max - min)) + min;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function match() {
  var tempAssassin = shuffleArray(assassinArray);
  console.log(tempAssassin);
  var assassinTarget = [];
  for( var i = 0; i <tempAssassin.length;i++) {
    var j = i + 1;
    if (j < tempAssassin.length) {
      assassinTarget.push([tempAssassin[i],tempAssassin[j]]);
    }
    else {
      assassinTarget.push([tempAssassin[i],tempAssassin[0]]);
    }
  }
  for( var i = 0; i < assassinTarget.length; i++) {
      var target = String(assassinTarget[i][1]);
      database.ref("Players/" + assassinTarget[i][0]).update({
        Target:target
      });
  }
}

function updateDataTable() {
  database.ref("Players").once('value').then(function(dataSnapshot) {
    var playerData = dataSnapshot.val();
    var names = Object.keys(playerData);
    for(var i = 0; i < names.length; i++) {
      var tempTableData = [];
        tempTableData[0] = names[i].replace(/(^\s+|\s+$)/g,'').replace("'","/'/'");
        tempTableData[1] = playerData[names[i]]["Status"];
        tempTableData[2] = playerData[names[i]]["Target"];
        tempTableData[3] = playerData[names[i]]["Email"];
        tempTableData[4] = playerData[names[i]]["PhoneNumber"];
        var tempClass = names[i].split(" ");
        $("tbody").append("<tr class='" + tempClass[0] + i +  "'></tr>")
        $("."+tempClass[0] +i).append("<td>" + names[i] + "</td>");
        $("."+tempClass[0]+i).append("<td>" + tempTableData[1] + "</td>");
        $("."+tempClass[0]+i).append("<td>" + tempTableData[2] + "</td>");
        $("."+tempClass[0]+i).append("<td>" + tempTableData[4] + "</td>");
        $("."+tempClass[0]+i).append("<td>" + tempTableData[3] + "</td>");
    }
    //console.log(Object.keys(playerData));
  });
}

$(document).ready( function () {
    $('#Players').DataTable({
      "scrollY":"500px",
        "scrollCollapse":true,
        "paging":false
    });
} );
