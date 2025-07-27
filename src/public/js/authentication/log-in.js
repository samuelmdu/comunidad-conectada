const inputs = document.querySelectorAll('#formulario input');
const formulario = document.getElementById("formulario");
const btnEntrar = document.querySelector('.formulario__btn');



const expresiones = {
    password: /^.{4,12}$/, //Acepta todo Rango de 4 a 12
    correo: /^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]+$/, //Estructura dato1@dato2.dato3 dato1:acepta letras minusculas y mayusculas, numeros, y acepta guion bajo  dato2 y 3 : Aceptan solo letras mayusculas y minusculas
}
const campos = {
    password: false,
    correo: false,
}


const validarFormulario = (e) => {
    switch (e.target.name) {
        case "password":
            //funcion
            validarCampo(expresiones.password, e.target, "password");

            break;
        case "correo":
            //funcion
            validarCampo(expresiones.correo, e.target, "correo")
            break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove("formulario__input-error-activo");
        document.querySelector(`#grupo__${campo} i`).classList.remove("bxs-x-circle");
        document.querySelector(`#grupo__${campo} i`).classList.add("bxs-check-circle");
        campos[campo] = true;

    } else {
        document.getElementById(`grupo__${campo}`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__${campo}`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add("formulario__input-error-activo");
        document.querySelector(`#grupo__${campo} i`).classList.add("bxs-x-circle");
        document.querySelector(`#grupo__${campo} i`).classList.remove("bxs-check-circle");
        campos[campo] = false;
    }
}


inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario)//KEYUP EVENTO CUANDO PRESIONAMOS UNA TECLA
    input.addEventListener("blur", validarFormulario)//BLUR CUANDO QUITAMOS EL CURSOR/SELECCION
})


formulario.addEventListener("submit", (e) => {


    const terminos = document.getElementById("terminos");
    if (campos.password && campos.correo) {
        document.getElementById("formulario__mensaje").classList.remove("formulario__mensaje-activo");
        document.getElementById("formulario__mensaje-exito").classList.add("formulario__mensaje-exito-activo");



    } else {
        document.getElementById("formulario__mensaje").classList.add("formulario__mensaje-activo");
    }

})

