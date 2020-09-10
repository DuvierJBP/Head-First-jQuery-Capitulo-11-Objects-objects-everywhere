$(document).ready(function () {

	//Selector para la fecha de avistamiento
	$("#datepicker").datepicker({ changeMonth: true, changeYear: true });

	//Agrupación de los botones para Creature Type
	$("#type_select").buttonset();

	//Estableciendo los parametros de control para distance
	$("#slide_dist").slider({
		value: 0,
		min: 0,
		max: 500,
		step: 10,
		slide: function (event, ui) {
			$("#distance").val(ui.value);
		}
	});
	$("#distance").val($("#slide_dist").slider("value"));

	//Estableciendo los parametros de control para weight
	$("#slide_weight").slider({
		value: 0,
		min: 0,
		max: 5000,
		step: 5,
		slide: function (event, ui) {
			$("#weight").val(ui.value);
		}
	});
	$("#weight").val($("#slide_weight").slider("value"));

	//Estableciendo los parametros de control para height
	$("#slide_height").slider({
		value: 0,
		min: 0,
		max: 20,
		step: 1,
		slide: function (event, ui) {
			$("#height").val(ui.value);
		}
	});
	$("#height").val($("#slide_height").slider("value"));

	//Estableciendo los parametros de control para latitude
	$("#slide_lat").slider({
		value: 0,
		min: -90,
		max: 90,
		step: 0.00001,
		slide: function (event, ui) {
			$("#latitude").val(ui.value);
		}
	});

	//Estableciendo los parametros de control para longitude
	$("#slide_long").slider({
		value: 0,
		min: -180,
		max: 180,
		step: 0.00001,
		slide: function (event, ui) {
			$("#longitude").val(ui.value);
		}
	});

	//Función para almacenar los colores ingresados por el usuario
	function refreshSwatch() {

		var red = $("#red").slider("value");
		var green = $("#green").slider("value");
		var blue = $("#blue").slider("value");
		//concatenación de los colres red, green y blue
		var my_rgb = "rgb(" + red + "," + green + "," + blue + ")";
		//Color de findo de las barras deslizantes
		$("#swatch").css("background-color", my_rgb);
		$("#red_val").val(red);
		$("#blue_val").val(blue);
		$("#green_val").val(green);
		$("#color_val").val(my_rgb);
	}

	//Formato de las propiedades del control deslizante para el color
	$("#red, #green, #blue").slider({
		orientation: "horizontal",
		range: "min",
		max: 255,
		value: 127,
		slide: refreshSwatch,
		change: refreshSwatch
	});

	//Boton submit para enviar los datos
	$("button:submit").button();
	$("#frmAddSighting").submit(function () {
		return false;
	});

	//Funcion para enviar los datos a la base de datos
	$('#btnSave').click(function () {
		var data = $("#frmAddSighting :input").serializeArray();

		$.post($("#frmAddSighting").attr('action'), data, function (json) {

			if (json.status == "fail") {
				alert(json.message);
			} else if (json.status == "success") {
				alert(json.message);
				clearInputs();
			} else { alert("Nothing Happened"); }
		}, "json");

	})

	//Función para limpiar los campos del formulario una vez se envien los datos
	function clearInputs() {
		$("#frmAddSighting :input").each(function () {
			$(this).val('');
			$("input:radio").removeAttr("checked");
			$("#slide_dist").slider("value", 0);
			$("#slide_weight").slider("value", 0);
			$("#slide_height").slider("value", 0);
			$("#red").slider("value", 127);
			$("#green").slider("value", 127);
			$("#blue").slider("value", 127);
			$("#slide_lat").slider("value", 0);
			$("#slide_long").slider("value", 0);

		});;
	}

});
