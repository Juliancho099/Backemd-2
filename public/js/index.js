
const form = document.querySelector('#form')
const formLogin = document.querySelector('#formLogin')

form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const first_name = document.querySelector('#firstName').value   
    const last_name = document.querySelector('#lastName').value
    const email = document.querySelector('#email').value
    const age = parseInt(document.querySelector('#age').value)
    const password = document.querySelector('#password').value

    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({first_name, last_name, email, password, age }),
      });
    
      const data = await response.json();
    
      console.log(data);
    
      console.log(document.cookie)
})

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email2").value;
    const password = document.getElementById("password2").value;
  
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
  
    console.log(data);

    console.log(document.cookie)
  
  });