<?php
	date_default_timezone_set('America/Los_Angeles');

	// codigo para entregar los datos ingresados por el usuario a la base de datos 
	if($_POST){
		if ($_POST['action'] == 'addSighting') {
			// filtros para proteger el codigo de datos de entrada maliciosos  
			$date = $_POST['sighting_date'] ;
			$type = htmlspecialchars($_POST['creature_type']);
			$distance = htmlspecialchars($_POST['creature_distance']);
			$weight = htmlspecialchars($_POST['creature_weight']);
			$height = htmlspecialchars($_POST['creature_height']);
			$color = htmlspecialchars($_POST['creature_color_rgb']);
			$lat = htmlspecialchars($_POST['sighting_latitude']);
			$long = htmlspecialchars($_POST['sighting_longitude']);
			
			//Validación de los datos ingresados por el usuario
			$my_date = date('Y-m-d', strtotime($date));
			
			if($type == ''){
				$type = "Other";
			}
			
			//sentensia para ingresar un nuevo criptido a la base de datos
			$query = "INSERT INTO sightings (sighting_date, creature_type, creature_distance, creature_weight, creature_height, creature_color, sighting_latitude, sighting_longitude) ";
			$query .= "VALUES ('$my_date', '$type', '$distance', '$weight', '$height', '$color', '$lat', '$long') ";

			$result = db_connection($query);
			
			//Validación del exito o falla del ingreso de los datos
			if ($result) {
				$msg = "Creature added successfully";
				success($msg);
			} else {
				fail('Insert failed.');
			}
			exit;
		}
	}

 	//Extraccion de la base de datos según la necesidad del usuario
	if($_GET){

		//Consulta a la base de datos por el id, fecha de avistamiento y tipo de criptido
		if($_GET['action'] == 'getAllSightings'){
			$query = "SELECT sighting_id, sighting_date, creature_type FROM sightings order by sighting_date ASC ";
			$result = db_connection($query);
			$sightings = array();
			//Adquisición de la información de todos los criptidos de la base de datos
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($sightings, array('id' => $row['sighting_id'], 'date' => $row['sighting_date'], 
				'type' => $row['creature_type'] ));
			}
			//codificación de los datos en formato JSON
			echo json_encode(array("sightings" => $sightings));
			exit;

		}elseif($_GET['action'] == 'getSingleSighting'){
			$id = htmlspecialchars($_GET['id']);
			$query = "SELECT sighting_date, creature_type, creature_distance, creature_weight, creature_height, 
				creature_color, sighting_latitude, sighting_longitude FROM sightings where sighting_id = '$id'";
			$result = db_connection($query);
			$sightings = array();
			//Adquisición de la información de todos los criptidos de la base de datos
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($sightings, array('date' => $row['sighting_date'], 'type' => $row['creature_type'], 
				'distance' => $row['creature_distance'], 'weight' => $row['creature_weight'], 'height' => $row['creature_height'],
				'color' => $row['creature_color'], 'lat' => $row['sighting_latitude'], 'long' => $row['sighting_longitude']));
			} 

			//codificación de los datos en formato JSON
			echo json_encode(array("sightings" => $sightings));
			exit;
			//Adquisición de los criptidos  por tipos organizado por tipos de criaturas de forma ascendente
		}elseif($_GET['action'] == 'getSightingsTypes'){
			$query = "SELECT distinct(creature_type) FROM sightings order by creature_type ASC ";
			$result = db_connection($query);			
			$types = array();	

			while ($row = mysqli_fetch_assoc($result)) {
				array_push($types, array('type' => $row['creature_type']));
			}
			//codificación de los datos en formato JSON
			echo json_encode(array("creature_types" => $types));
			exit;

		}elseif($_GET['action'] == 'getSightingsByType'){
			$type = htmlspecialchars($_GET['type']);
			$query = "SELECT sighting_id, sighting_date, creature_type, creature_distance, creature_weight, 
				creature_height, creature_color, sighting_latitude, sighting_longitude FROM sightings 
				where creature_type = '$type' order by sighting_date ASC ";
			$result = db_connection($query);			
			$sightings = array();
	       //Adquisición de la informacion de los criptidos del mismo tipo
			while ($row = mysqli_fetch_assoc($result,)) {
				array_push($sightings, array('id' => $row['sighting_id'], 'date' => $row['sighting_date'], 
				'type' => $row['creature_type'], 'distance' => $row['creature_distance'], 
				'weight' => $row['creature_weight'], 'height' => $row['creature_height'], 
				'color' => $row['creature_color'], 'lat' => $row['sighting_latitude'],
				'long' => $row['sighting_longitude']));
			}
			//codificación de los datos en formato JSON
			echo json_encode(array("sightings" => $sightings));
			exit;
		}else{}

	}

	//Funcion para realizar la coneccion entre php y la base de datos
    function db_connection($query) {
    	$con = mysqli_connect('**************','***********','**********','**********')  
    	OR die( 'Could not connect to database.');
    	//Retorna los resultados de la solicitud SELECT de la base de datos.
    	return mysqli_query($con, $query);
    }
	
	//Función para reportar errores en la conversion de la matriz de datos
	function fail($message) {
		die(json_encode(array('status' => 'fail', 'message' => $message)));
	}

	//Función para reportar el exito de la conversion de la matriz de datos
	function success($message) {
		die(json_encode(array('status' => 'success', 'message' => $message)));
	}
?>