const inputs = document.querySelectorAll('#formulario input');

const formulario = document.getElementById("formulario");


const expresiones = {
    usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, //Admite letras mayusculas, minusculas, números, guion bajo y guion. Rango caracteres 4 a 16
    nombre: /^[a-zA-ZÀ-ÿ\s]{3,45}$/, //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    password: /^.{4,12}$/, //Acepta todo Rango de 4 a 12
    correo: /^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]+$/, //Estructura dato1@dato2.dato3 dato1:acepta letras minusculas y mayusculas, numeros, y acepta guion bajo  dato2 y 3 : Aceptan solo letras mayusculas y minusculas
    telefono: /^\d{8,11}$/, //Acepta digitos Rango es de 8 a 11
    cedula: /^\d{9}$/,
}
const campos = {
    usuario: false,
    nombre: false,
    password: false,
    correo: false,
    telefono: false,
    cedula: false
}


const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            //funcion
            validarCampo(expresiones.nombre, e.target, "nombre");
            break;
        case "password":
            //funcion
            validarCampo(expresiones.password, e.target, "password");
            validarPassword2();
            break;
        case "password2":
            //funciones
            validarPassword2();
            break;
        case "correo":
            //funcion
            validarCampo(expresiones.correo, e.target, "correo")
            break;
        case "telefono":
            //telefono
            validarCampo(expresiones.telefono, e.target, "telefono")
            break;
        case "cedula":
            //cedula
            validarCampo(expresiones.cedula, e.target, "cedula")
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

const validarPassword2 = () => {
    let inputPassword1 = document.getElementById("password");
    let inputPassword2 = document.getElementById("password2");

    if (inputPassword1.value !== inputPassword2.value) {
        document.getElementById(`grupo__password2`).classList.add("formulario__grupo-incorrecto");
        document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-correcto");
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add("formulario__input-error-activo");
        document.querySelector(`#grupo__password2 i`).classList.add("bxs-x-circle");
        document.querySelector(`#grupo__password2 i`).classList.remove("bxs-check-circle");
        campos[password] = false;
    } else {
        document.getElementById(`grupo__password2`).classList.remove("formulario__grupo-incorrecto");
        document.getElementById(`grupo__password2`).classList.add("formulario__grupo-correcto");
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove("formulario__input-error-activo");
        document.querySelector(`#grupo__password2 i`).classList.remove("bxs-x-circle");
        document.querySelector(`#grupo__password2 i`).classList.add("bxs-check-circle");
        campos[password] = true;
    }

}


inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario)//KEYUP EVENTO CUANDO PRESIONAMOS UNA TECLA
    input.addEventListener("blur", validarFormulario)//BLUR CUANDO QUITAMOS EL CURSOR/SELECCION
})


formulario.addEventListener("submit", (e) => {

    const terminos = document.getElementById("terminos");
    if (campos.cedula && campos.nombre && campos.password && campos.correo && campos.telefono && terminos.checked) {
        document.getElementById("formulario__mensaje").classList.remove("formulario__mensaje-activo");
        document.getElementById("formulario__mensaje-exito").classList.add("formulario__mensaje-exito-activo");

        setTimeout(() => {
            location.reload();
        }, 4000)

    } else {
        document.getElementById("formulario__mensaje").classList.add("formulario__mensaje-activo");
    }

})