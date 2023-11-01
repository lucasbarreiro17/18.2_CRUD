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

postSurname.addEventListener("input", () =>{
	if(postName.value && postSurname.value){
		postButton.removeAttribute("disabled")
	} else {
		postButton.setAttribute("disabled", "")
	}
});


postButton.addEventListener("click", async() =>{
	object = {};
	object.name = postName.value;
	object.lastname = postSurname.value;
	displayData(await postData(API_URL, object))
});


putId.addEventListener("input", () =>{
	if(putId.value){
		putButton.removeAttribute("disabled")
	} else {
		putButton.setAttribute("disabled", "")
	}
});

deleteId.addEventListener("input", () =>{
	if(deleteId.value){
		deleteButton.removeAttribute("disabled")
	} else {
		deleteButton.setAttribute("disabled", "")
	}
});


deleteButton.addEventListener("click", async() => {
	inputGETbyID.value = "";
	deleteData(API_URL + deleteId.value)
	let time = setTimeout(() => {
		btnGetId.click();
		clearTimeout(time);
	}, "1000");
	
});


putButton.addEventListener("click", async() =>{

	fetch(API_URL + putId.value)
		.then(x => x.json())
		.then(y => modifyModal(y));
		
	function modifyModal(object){
		console.log(object)
		const modal = document.getElementById("dataModal");
		const putName = document.getElementById("inputPutNombre");
		const putSurname = document.getElementById("inputPutApellido");
		const sendButton = document.getElementById("btnSendChanges");
		
		putName.value = object.name;
		putSurname.value = object.lastname;
		
		[putSurname,putName].forEach(field => {
			field.addEventListener("input", () => {
					sendButton.removeAttribute("disabled");
			});
		});
		
		sendButton.addEventListener("click", async () => {
			object = {};
			object.name = putName.value;
			object.lastname = putSurname.value;
			displayData(await putData(API_URL + putId.value, object));
			bootstrap.Modal.getOrCreateInstance(modal).hide();
		});
		
	}
});


function displayData(APIresponse){
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
};

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

async function deleteData(url) {
	let res = await fetch(url, {
		method: "DELETE", 
	})
	.then(res => {if(!res.ok) showError()});
}

function showError(){
	defaultAlert.classList.toggle("show");
	defaultAlert.classList.toggle("hide");
	
	let time = setTimeout(() => {
		defaultAlert.classList.toggle("show");
		defaultAlert.classList.toggle("hide");
		clearTimeout(time);
	}, "3000");
}