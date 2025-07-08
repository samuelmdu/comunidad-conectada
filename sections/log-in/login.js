const inputs = document.querySelectorAll('#formulario input');
const formulario = document.getElementById("formulario");

const expresiones ={
    password:/^.{4,12}$/, //Acepta todo Rango de 4 a 12
    correo :/^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]+$/ //Estructura dato1@dato2.dato3 dato1:acepta letras minusculas y mayusculas, numeros, y acepta guion bajo  dato2 y 3 : Aceptan solo letras mayusculas y minusculas
}

const campos={
    password: false,
    correo: false,
}

const validarFormulario = (e)=>{
    switch(e.target.name){ // --- "nombre" e.target.class --- 
        case "password":
            //funcion
            validarCampo(expresiones.password,e.target,"password");
            validarPassword2();
        break;

        case "correo":
            //funcion
            validarCampo(expresiones.correo,e.target,"correo")
        break;
    }
}