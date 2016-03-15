$(function () {

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    height: $(window).innerHeight() + "px"
  };
  var network = new vis.Network(container, data, options);

  function draw() {

    var loadWhoami = $.getJSON("/whoami.json");
    var loadServices = $.getJSON('/list.json');

    $.when(loadWhoami, loadServices).then(function (whoamiResult, servicesResult) {

      nodes.clear();
      edges.clear();


      var whoami = whoamiResult[0];
      var services = servicesResult[0];


      nodes.add({
        id: "9587",
        type: "dot"
      })

      services.forEach(function (item) {
        var host_id = item.addresses.join('，');

        var host = {
          id: host_id,
          label: item.host,
          shape: "dot"
        }

        if (!nodes.get(host.id)) {
          nodes.add(host);

          edges.add({
            from: "9587",
            to: host_id,
            label: item.addresses && item.addresses[1]
          });

        }

        var app_id = item.fqdn;

        var app = {
          id: app_id,
          label: item.type + ":" + item.port,
          shape: "square",
          color: "#ccc"
        }

        if (!nodes.get(app_id)) {
          nodes.add(app);
          edges.add({
            from: host_id,
            to: app_id
          })
        }

      })
    })

  }

  draw();

  var socket = new WebSocket('ws://' + location.host + '/');

  socket.addEventListener("message", function (e) {
    draw();
  })

})