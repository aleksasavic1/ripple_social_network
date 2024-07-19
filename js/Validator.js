class Validator {
	constructor(config, formID) {
		this.elementsConfig = config;
		this.formID = formID;
		this.errors = {};
		
		this.generateErrorsObject();
		this.inputListener();
	}

	generateErrorsObject() {
		for(let field in this.elementsConfig) {
			this.errors[field] = [];
		}
	}

	inputListener() {
		let inputSelector = this.elementsConfig;

		for(let field in inputSelector) {
			let element = document.querySelector(`${this.formID} input[name="${field}"]`);

			element.addEventListener('input', this.validate.bind(this));
		}
	}

	validate(e) {
		let elementFields = this.elementsConfig;

		let field = e.target;
		let fieldName = field.getAttribute('name');
		let fieldValue = field.value;

		this.errors[fieldName] = [];

		if(elementFields[fieldName].required) {
			if(fieldValue === '') {
				this.errors[fieldName].push("Field cannot be empty.");
			}
		}

		if(elementFields[fieldName].email) {
			if(!this.validateEmail(fieldValue)) {
				this.errors[fieldName].push("Invalid email address.");
			}
		}

		if(fieldValue.length < elementFields[fieldName].minlength || fieldValue.length > elementFields[fieldName].maxlength) {
			this.errors[fieldName].push(`Field must have a minimum of ${elementFields[fieldName].minlength} and a maximum of ${elementFields[fieldName].maxlength} characters.`);
		}

		if(elementFields[fieldName].matching) {
			let matchingElement = document.querySelector(`${this.formID} input[name="${elementFields[fieldName].matching}"]`);

			if(fieldValue !== matchingElement.value) {
				this.errors[fieldName].push("Passwords do not match.");
			}

			if(this.errors[fieldName].length === 0) {
				this.errors[fieldName] = [];
				this.errors[elementFields[fieldName].matching] = [];
			}
		}

		this.populateErrors(this.errors);
	}

	validationPassed() {
		for(let key of Object.keys(this.errors)) {
			if(this.errors[key].length > 0) {
				return false;
			}
		}

		return true;
	}

	populateErrors(errors) {
		for(const el of document.querySelectorAll('ul')) {
			el.remove();
		}

		for(let key of Object.keys(errors)) {
			let parentElement = document.querySelector(`${this.formID} input[name="${key}"]`).parentElement;
			let errorsElement = document.createElement('ul');
			parentElement.appendChild(errorsElement);

			errors[key].forEach(error => {
				let li = document.createElement('li');
				li.innerText = error;

				errorsElement.appendChild(li);
			});
		}
	}

	validateEmail(email) {
		// This is the REGEX code for validating an email (you can find it on the internet).
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
	    	return true;
		}
	    
	    return false;
	}
}
