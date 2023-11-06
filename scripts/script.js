const API_URL = "https://65427c52ad8044116ed3726f.mockapi.io/users/";
const inputGETbyID = document.getElementById("inputGet1Id");
const btnGetId = document.getElementById("btnGet1");
const display = document.getElementById("results");
const postName = document.getElementById("inputPostNombre");
const postSurname = document.getElementById("inputPostApellido");
const postButton = document.getElementById("btnPost");
const putId = document.getElementById("inputPutId");
const putButton = document.getElementById("btnPut");
const deleteId = document.getElementById("inputDelete");
const deleteButton = document.getElementById("btnDelete");
const defaultAlert = document.getElementById("alert-error");

//Listener de la seccion GET, hace fetch a una url modificada, en caso de que el campo este vacio lo hace a la url por defecto.
btnGetId.addEventListener("click", () => {
	if (!inputGETbyID.value){ 
		fetch(API_URL)
		.then(x => x.json())
		.then(y => displayData(y));
	} else {
	fetch(API_URL + inputGETbyID.value) 
		.then(x => x.json())
		.then(y => displayData(y));
	}
});
//Listener que habilita el boton de la seccion POST
postSurname.addEventListener("input", () =>{
	if(postName.value && postSurname.value){
		postButton.removeAttribute("disabled")
	} else {
		postButton.setAttribute("disabled", "")
	}
});

//Listener al boton de la seccion POST, crea el objeto para enviar a la api.
postButton.addEventListener("click", async() =>{
	object = {};
	object.name = postName.value;
	object.lastname = postSurname.value;
	displayData(await postData(API_URL, object))
});

//Listener que habilita el boton de la seccion PUT
putId.addEventListener("input", () =>{
	if(putId.value){
		putButton.removeAttribute("disabled")
	} else {
		putButton.setAttribute("disabled", "")
	}
});
//Listener que habilita el boton de la seccion DELETE
deleteId.addEventListener("input", () =>{
	if(deleteId.value){
		deleteButton.removeAttribute("disabled")
	} else {
		deleteButton.setAttribute("disabled", "")
	}
});

//Listener al boton de la seccion DELETE, llama a la funcion encargada de borrar el valor solicitado.
deleteButton.addEventListener("click", async() => {
	inputGETbyID.value = ""; // Vacia el campo del GET para que al actualizar traiga todos los datos.
	deleteData(API_URL + deleteId.value)
	let time = setTimeout(() => {
		btnGetId.click();
		clearTimeout(time);
	}, "1000"); // Esperamos un segundo porque nos mostraba el valor borrado.
	
});

// Listener del boton de la seccion PUT, con fetch traemos los datos que estan actualmente en la base de datos.
putButton.addEventListener("click", async() =>{

	await fetch(API_URL + putId.value)
		.then(x => x.json())
		.then(y => modifyModal(y));

	// a los campos del modal le ponemos los datos de la base de datos.	
	function modifyModal(object){
		const modal = document.getElementById("dataModal");
		const putName = document.getElementById("inputPutNombre");
		const putSurname = document.getElementById("inputPutApellido");
		const sendButton = document.getElementById("btnSendChanges");
		if (typeof object == "string"){ // en caso de que la API devuelva un error, ocultamos el modal y mostramos un error.
			bootstrap.Modal.getInstance(modal).hide();
			showError();
		}
		putName.value = object.name;
		putSurname.value = object.lastname;
		
		[putSurname,putName].forEach(field => {
			field.addEventListener("input", () => {
					sendButton.removeAttribute("disabled");
			}); //Agregamos un listener a cada input del modal que habilita el boton de enviar.
		});
		//Listener al boton de la seccion PUT, crea el objeto para enviar a la api.
		sendButton.addEventListener("click", async () => { 
			object = {};
			object.name = putName.value;
			object.lastname = putSurname.value;
			displayData(await putData(API_URL + putId.value, object));
			bootstrap.Modal.getInstance(modal).hide();
		});
		
	}
});

//Funcion que se encarga de mostrar los datos que llegan por parametro en el apartado de la derecha.
function displayData(APIresponse){
	if (typeof APIresponse == "string"){
		showError();
	} else{
	if (!Array.isArray(APIresponse)){
		display.innerHTML = `<li><p> ID: ${APIresponse.id} <br>
			NAME: ${APIresponse.name}<br>
			LASTNAME: ${APIresponse.lastname}</p>
			</li>`
	} else {
		display.innerHTML = "";
		for (let object of APIresponse){
			display.innerHTML += `<li><p> ID: ${object.id} <br>
			NAME: ${object.name}<br>
			LASTNAME: ${object.lastname}</p>
			</li>`
		}
	}
}};
//Funcion para la solicitud POST, en caso de error muestra un cartel.
async function postData(url, data) {
  	const response = await fetch(url, {
		method: "POST", 
		mode: "cors", 
		cache: "no-cache", 
		credentials: "same-origin",
		headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  	if (!response.ok)
		showError();
	return await response.json();
}
//Funcion para la solicitud PUT, en caso de error muestra un cartel.
async function putData(url, data) {
  	const response = await fetch(url, {
		method: "PUT", 
		mode: "cors", 
		cache: "no-cache", 
		credentials: "same-origin",
		headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
	if (!response.ok)
		showError();
	return await response.json();
}
//Funcion para la solicitud DELETE, en caso de error muestra un cartel.
async function deleteData(url) {
	let res = await fetch(url, {
		method: "DELETE", 
	})
	.then(res => {if(!res.ok) showError()});
}
//Funcion encargada de desplegar un cartel para notificar errores.
function showError(){
	defaultAlert.classList.toggle("show");
	defaultAlert.classList.toggle("hide");
	
	let time = setTimeout(() => {
		defaultAlert.classList.toggle("show");
		defaultAlert.classList.toggle("hide");
		clearTimeout(time);
	}, "3000");
}