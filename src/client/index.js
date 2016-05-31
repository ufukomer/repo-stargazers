$(document).ready(function () {

  var count = 0;
  var timer = 0;

  $("#fetchButton").click(function () {
    $("#fetchButton").prop('disabled', true);
    $.post("/api/saveAll", function () {
      $("#fetchButton").text('Fetching...');
      timer = setInterval(getCountIntervally, 10000);
    });
  });

  $("#showButton").click(function () {
    showInTable('turkey');
  });

  function showInTable(location) {
    $.get("/api/getAll", function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].location && data[i].location.toLowerCase().includes(location)) {
          tr = $('<tr/>');
          tr.append("<td>" + data[i].login + "</td>");
          tr.append("<td><a href='" + data[i].html_url + "' target='_blank'>" + data[i].html_url + "</a></td>");
          tr.append("<td>" + data[i].location + "</td>");
          $('table').append(tr);
        }
      }
    });
  }

  function getCountIntervally() {
    $.get("/api/getCount", function (data) {
      if (data[0].$1 == count) {
        $("#fetchButton").text('Save Stargazers');
        $("#fetchButton").prop('disabled', false);
        clearInterval(timer);
        showInTable('turkey');
      }
      count = data[0].$1;
    });
  }
});
