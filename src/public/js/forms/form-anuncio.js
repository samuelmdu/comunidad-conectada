//PASO 1:Obtener el html por medio del DOM
const inputs = document.querySelectorAll('#formulario input, #formulario textarea'); //textarea no es un input por eso lo ponemos

const formulario = document.getElementById("formulario");

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{3,45}$/, //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    anuncio: /^[a-zA-ZÀ-ÿ0-9\s]{3,45}$/, //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    descripcion: /^[a-zA-ZÀ-ÿ0-9\s]{3,200}$/, //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
}

const campos = {
    nombre: false,
    anuncio: false,
    descripcion: false,
    fecha: false
}

//PASO 3: CREAR LAS ACCIONES FUNCIONES
// e = <input type="text" class="formulario__input" name="nombre" id="nombre" placeholder="Steph Delgado">
const validarFormulario = (e) => {
    switch (e.target.name) { // --- "nombre" e.target.class --- formulario__input
        case "anuncio":
            //validar funcion
            //       parametro1 = condiciones, parametro2 = e.target, parametro = identificador = ""
            validarCampo(expresiones.anuncio, e.target, "anuncio")
            break;
        case "nombre":
            //funcion
            validarCampo(expresiones.nombre, e.target, "nombre");
            break;
        case "descripcion":
            //funcion
            validarCampo(expresiones.descripcion, e.target, "descripcion");
            break;
        case "fecha":
            validarCampo(expresiones.fecha, e.target, "fecha");
            break;
    }
}

const validarCampo = (expresion, input, campo) => {
    //test() ---  /^[a-zA-Z0-9\_\-]{4,16}$/.test("step4_-#")--- true o false
    ///^[a-zA-ZÀ-ÿ\s]{3,45}$/.test("s")-- false
    if (expresion.test(input.value)) {
        document.getElementById(`grupo-${campo}`).classList.remove("formulario-grupo-incorrecto");
        document.getElementById(`grupo-${campo}`).classList.add("formulario-grupo-correcto");
        document.querySelector(`#grupo-${campo} .formulario-input-error`).classList.remove("formulario-input-error-activo");
        document.querySelector(`#grupo-${campo} i`).classList.remove("bxs-x-circle");
        document.querySelector(`#grupo-${campo} i`).classList.add("bxs-check-circle");
        campos[campo] = true;
    } else {
        //                       grupo__nombre
        document.getElementById(`grupo-${campo}`).classList.add("formulario-grupo-incorrecto");
        document.getElementById(`grupo-${campo}`).classList.remove("formulario-grupo-correcto");
        document.querySelector(`#grupo-${campo} .formulario-input-error`).classList.add("formulario-input-error-activo");
        document.querySelector(`#grupo-${campo} i`).classList.add("bxs-x-circle");
        document.querySelector(`#grupo-${campo} i`).classList.remove("bxs-check-circle");
        campos[campo] = false;
    }
}

//PASO 2: Recorrer y Escuchar los eventos
inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario)//KEYUP EVENTO CUANDO PRESIONAMOS UNA TECLA
    input.addEventListener("blur", validarFormulario)//BLUR CUANDO QUITAMOS EL CURSOR/SELECCION
})

formulario.addEventListener("submit", (e) => {
    //No deja que se recarge la pagina

    const terminos = document.getElementById("terminos");
    if (campos.anuncio && campos.nombre && campos.descripcion && campos.fecha && terminos.checked) {
        document.getElementById("formulario-mensaje").classList.remove("formulario-mensaje-activo");
        document.getElementById("formulario-mensaje-exito").classList.add("formulario-mensaje-exito-activo");

        setTimeout(() => {
            location.reload();
        }, 4000)

    } else {
        document.getElementById("formulario-mensaje").classList.add("formulario-mensaje-activo");
    }

})