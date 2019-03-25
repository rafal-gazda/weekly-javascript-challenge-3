const fieldsetCustomer = document.getElementsByClassName("form__customer")[0];
const fieldsetCompany = document.getElementsByClassName("form__company")[0];
const fieldsetPrice = document.getElementsByClassName("form__price")[0];

const inputsCustomer = fieldsetCustomer.getElementsByClassName("form__input");
const errorMessage = fieldsetCustomer.getElementsByClassName("form__messaggeError");

String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

class InputFieldset{
	constructor(fieldset){
		this.fieldset = fieldset;	
	}
	
	validInputs(){
		this.eventListener();
	}
		
	eventListener(){
		const inputsCustomer = this.fieldset.getElementsByClassName("form__input");

		for(let i = 0; i < inputsCustomer.length; i++){
			inputsCustomer[i].addEventListener("blur",  () =>{
				
				this.validation(inputsCustomer[i], i);
			});
		}  
		
		this.nameUppercase(inputsCustomer);
	}
	
	nameUppercase(inputsCustomer){
		
		for(let i = 0; i < inputsCustomer.length; i++){
			let inputsAttribute = inputsCustomer[i].getAttribute("type-form-input");
			
			if(inputsAttribute == "nameString" || inputsAttribute == "simpleString"){
				inputsCustomer[i].addEventListener("keyup",  () =>{
					inputsCustomer[i].value = inputsCustomer[i].value.capitalize(true);
				});
			}
		}
	}
			
	validation(inputsCustomer, i){
		let inputsAttribute = inputsCustomer.getAttribute("type-form-input");
				
		if(inputsAttribute === "simpleString") {
			this.validationSimpleString(inputsCustomer, i);
		}
		
		else if(inputsAttribute === "nameString"){
			this.validationName(inputsCustomer, i);
		}
		
		else if(inputsAttribute === "price"){
			this.validationPrice(inputsCustomer, i);
		}
		
		else if(inputsAttribute === "nip"){
			this.validationNip(inputsCustomer, i);
		}
	}
	
	validationSimpleString(inputsCustomer, i){
		try{
			if(inputsCustomer.value.length === 0){
				throw "Proszę uzupełnić pole";
			}
			
			else{
				this.clearErrorMessage(i);
			}
		}
		
		catch(err){
			this.messageError(err, i);
		}
	}
	
	validationName(inputsCustomer, i){
		const regexName = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*/g);
		const testRegex = regexName.test(inputsCustomer.value);
		
		try{
			if(inputsCustomer.value.length === 0){
				throw "Proszę uzupełnić pole";
			}
			
			else if(!testRegex){
				throw "Wpisana nazwa nie jest zgodna z Regexem";
			}
			
			else{
				this.clearErrorMessage(i);
			}
		}
		
		catch(err){
			this.messageError(err, i);
		}
	}
	
	validationPrice(inputsCustomer, i){ 
		try{			
			if(inputsCustomer.value.length == 0){
				throw "Proszę uzupełnić pole"	
			}
			
			else if(isNaN(inputsCustomer.value)){
				throw "Wprowadzona wartość nie jest liczbą";
			}
			
			else if(inputsCustomer.value < 0){
				throw "Wprowadzona wartość jest mniejsza od zera";
			}
			
			else{
				this.clearErrorMessage(i);
			}
		}
		
		catch(err){
			this.messageError(err, i);
		}
	}
	
	validationNip(inputsCustomer, i){
		let nip = inputsCustomer.value;
		nip = nip.replace(/\-/g, '');
		
		let sumNip = this.sumNip(nip);
				
		try{
			if (nip.length == 0){
				throw "Proszę uzupełnić pole";
			}
			
			else if(nip.length != 10){
				throw "NIP powinien mieć 10 znaków";
			}
			
			else if (nip[9] != sumNip) {
				throw "Podany NIP nie jest nieprawidłowy";
			}
			
			else{
				this.clearErrorMessage(i);
			}
		}
		catch(err){
			this.messageError(err, i);
		}
	}
	
	sumNip(nip){
		return ((6 * nip[0] + 5 * nip[1] + 7 * nip[2] + 2 * nip[3] + 3 * nip[4] + 4 * nip[5] + 5 * nip[6] + 6 * nip[7] + 7 * nip[8]) % 11);
	}
	
	messageError(error, i){
		const errorMessage = this.fieldset.getElementsByClassName("form__messaggeError");
		
		errorMessage[i].textContent = error;
	}
	
	clearErrorMessage(i){
		const errorMessage = this.fieldset.getElementsByClassName("form__messaggeError");

		errorMessage[i].textContent = "";
	}
}

class localData{
	constructor(inputs){
		this.inputs = inputs;
	}
	
	eventListener(){
		for (let i = 0; i < this.inputs.length; i++) {
			
			["keyup", "click"].map( (e) => {
				this.inputs[i].addEventListener(e, () => {
					localStorage.removeItem("localStorage");
					localStorage.setItem("localStorage", JSON.stringify(this.outputData()));
				});
			});
		}
	}
	
	outputData(){
		let arrayInput = [];
			
		for(let i = 0; i < this.inputs.length; i++){
			if(this.inputs[i].getAttribute("type") == "radio"){
				if(this.inputs[i].checked == true){
					arrayInput[i] = true;
				}
			}
			else{
				arrayInput[i] = this.inputs[i].value;
			}
		}
					
		return arrayInput;
	}
	
	importData(){
		if (localStorage.getItem('localStorage') != null) {
			let local = localStorage.getItem("localStorage");
		
			for(let i = 0; i < this.inputs.length; i++){
				if(this.inputs[i].getAttribute("type") == "radio"){
					if(JSON.parse(local)[i] == true){
						this.inputs[i].checked = true;
					}
				}
				else{
					this.inputs[i].value = JSON.parse(local)[i];	
				}
			}
		}
	}
}


//Walidacja formularza w wybranych polach fieldset
let fieldset1 = new InputFieldset(fieldsetCustomer);
let fieldset2 = new InputFieldset(fieldsetCompany);
let fieldset3 = new InputFieldset(fieldsetPrice);

fieldset1.validInputs();
fieldset2.validInputs();
fieldset3.validInputs();

//Zapisywanie do LocalStorage i wypisywanie z LocalStorage
let allInputs = document.getElementsByTagName("input");
let local = new localData(allInputs);

local.importData();
local.eventListener();






