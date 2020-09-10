$(document).ready(function () {

  var markersArray = []; //Arreglo para guardas los marcadores
  var bounds = new google.maps.LatLngBounds(); //objeto para extender los limites del mapa
  var map;
  var info_window = new google.maps.InfoWindow({ content: '' }); //Ventana emergente de información

  //Función para inicializar el lienzo del mapa 
  function initialize() {
    //coordendas para hubicar el el mapa
    var lat = 4.545673;
    var long = -75.662237;
    //Creando el lienzo para el mapa 
    var coord = { lat: lat, lng: long };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: coord,
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    map = new google.maps.Map(document.getElementById("map"), map);

    if ($('#ddlTypes').length) {
      // Llenado de la lista desplegable
      getAllTypes();
    } else {
      // Llenado de la lista de avistamientos
      getAllSightings();
    }
  }

  //Función para obtener y visualizar todos los criptidos guardados en la base de datos en formato JSON
  function getAllSightings() {
    //llamado al archivo .php
    $.getJSON("service.php?action=getAllSightings", function (json) {
      if (json.sightings.length > 0) {
        $('#sight_list').empty();

        //Formato para visualizar los criptidos en pantalla
        $.each(json.sightings, function () {
          var info = 'Date: ' + this['date'] + ', Type: ' + this['type'];

          var $li = $("<li />");
          $li.html(info);
          $li.addClass("sightings");
          $li.attr('id', this['id']);
          $li.click(function () {
            getSingleSighting(this['id']);
          });
          $li.appendTo("#sight_list");
        });
      }
    });
  }

  //Funcion para fijar en el mapa la ubicación del avistamiento
  function getSingleSighting(id) {
    //llamado al archivo .php
    $.getJSON("service.php?action=getSingleSighting&id=" + id, function (json) {
      if (json.sightings.length > 0) {
        $.each(json.sightings, function () {
          //Coordenasdas del avistamiento
          var lat = this['lat'];
          var long = this['long'];

          alert(lat + "," + long);

        });
      }
    });
  }

  //Función para mostrar en la barra desplegable los tipos de criptidos que hay en la base de datos
  function getAllTypes() {
    //llamado al archivo .php
    $.getJSON("service.php?action=getSightingsTypes", function (json_types) {
      if (json_types.creature_types.length > 0) {

        $.each(json_types.creature_types, function () {
          var info = this['type'];
          var $li = $("<option />");
          $li.html(info);
          $li.appendTo("#ddlTypes");
        });
      }
    });
  }

  // función para obtener los elementos de la base de datos por tipos de criptido
  function getSightingsByType(type) {
    $.getJSON("service.php?action=getSightingsByType&type=" + type, function (json) {
      if (json.sightings.length > 0) {
        $('#sight_list').empty();

        $.each(json.sightings, function () {
          add_sighting(this);
        });
        //fija los limites para el nuevo zoom 
        map.fitBounds(bounds);
      }
    });
  }

  //Función para mostrar los marcadores por tipos de criptidos
  function add_sighting(cryptid) {

    var loc = new google.maps.LatLng(cryptid['lat'], cryptid['long']);

    var info = 'Distance: ' + cryptid['distance'] + '<br>';
    info += ' Height: ' + cryptid['height'] + ', Weight: ' + cryptid['weight'] + ', Color: ' + cryptid['color'] + '<br>';
    info += 'Latitude: ' + cryptid['lat'] + ', Longitude: ' + cryptid['long'];

    var opts = {
      map: map,
      position: loc,
      clickable: true
    };
    //Función para agregar una ventana informativa de los marcadores
    var marker = new google.maps.Marker(opts);
    marker.note = 'Date: ' + cryptid['date'] + ', Type: ' + cryptid['type'];
    markersArray.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
      info_window.content = info;
      info_window.open(map, marker);
    });

    var $li = $("<li />");
    $li.html('Date: ' + cryptid['date'] + ', Type: ' + cryptid['type']);
    $li.addClass("sightings");
    $li.click(function () {
      info_window.content = info;
      info_window.open(map, marker);
    });
    $li.appendTo("#sight_list");
    bounds.extend(loc);
    return marker;
  }

  //oyente para el evento de la lista desplegable
  $('#ddlTypes').change(function () {
    if ($(this).val() != "") {
      clearOverlays();
      getSightingsByType($(this).val());
    }
  });

  //Función para borrar los criptidos anteriores para sellecionar de nuevo segun elt ipo
  function clearOverlays() {
    if (markersArray) {
      for (i in markersArray) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
      bounds = null;
      bounds = new google.maps.LatLngBounds();
    }
  }
  initialize();
});

