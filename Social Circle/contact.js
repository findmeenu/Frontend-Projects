export function formSubmission() {
    const submitButton = document.querySelector(".submit-button")
    let confirmInput  = document.getElementById("confirm");


    // -------------------
    // --- NEW: live name validation wired at setup ---
//   const nameInput = document.getElementById("name");
//   const nameErrorTop = document.getElementById("nameError");
//   nameInput.addEventListener("input", function () {
//     const value = nameInput.value.trim(); // current text
//     if (value === "" || !/^[A-Za-z\s'-]+$/.test(value)) {
//       nameErrorTop.innerText = "Please enter a valid name";
//     } else {
//       nameErrorTop.innerText = "";
//     }
//   });
    const nameInput = document.getElementById("name")
    const nameCount = document.getElementById("nameCount");

    nameInput.addEventListener("input", function(){
        const value = document.getElementById("name").value
        let count = value.length;
        console.log(count);
        if(count<50){
        nameCount.style.fontSize = '12px';    
        // nameCount.style.color = 'black';    
        nameCount.textContent = `Characters entered so far : ${count}`
    }else{
        nameCount.style.color = 'red';
        nameCount.style.fontSize = '12px';   
        nameCount.textContent = `Characters entered so far : ${count}`
        
    }

    })
    
    submitButton.disabled = !confirmInput.checked;

    confirmInput .addEventListener("change", function(){
        submitButton.disabled = !confirmInput.checked;
    })


    document.getElementById("contact-form")
    .addEventListener("submit", function(event){
        event.preventDefault();

        // Get input values
        let name = document.getElementById("name").value.trim();
        let email =document.getElementById("email").value.trim();
        let isConfirmed = document.getElementById("confirm").checked;
        
        
        // Get error message elements
        let nameError = document.getElementById("nameError")
        let emailError = document.getElementById("emailError")
        let confirmError = document.getElementById("confirmError")

        // Reset previous error messages
        nameError.innerText = "";
        emailError.innerText = "";
        confirmError.innerText = "";

        let isValid = true;
          
        
        //Name validation
        if (name==="" || !/^[A-Za-z\s'-]+$/.test(name)){
            nameError.innerText= "Please enter a valid name";
            isValid = false;
        }

        //Email validation
        if(email==="" || !email.includes("@") || !email.includes(".")){
            emailError.innerText="Please provide a valid email."
           isValid = false;
        }

    //Confirm to send validation        
    if (!isConfirmed){
    confirmError.innerText="Please confirm to send."
    isValid = false;
    }        

    // Submit form if all fields are valid
        if (isValid) {
            alert("Form submitted successfully!");
            this.submit(); // Only submit if all validations pass
        }
    })
};



