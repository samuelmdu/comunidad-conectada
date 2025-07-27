//PASO 1:Obtener el html por medio del DOM
const inputs = document.querySelectorAll('#formulario input, #formulario textarea'); //textarea no es un input por eso lo ponemos

const formulario = document.getElementById("formulario");

const expresiones = {
    ruta: /^.+\s-\s.+$/,
    horario: /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM) - (1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/,
    frecuencia: /^\d{1,3}$/,
    precio: /^\d+(\.\d{1,2})?$/,
}

const campos = {
    ruta: false,
    horario: false,
    frecuencia: false,
    precio: false
}

//PASO 3: CREAR LAS ACCIONES FUNCIONES
// e = <input type="text" class="formulario__input" name="nombre" id="nombre" placeholder="Steph Delgado">
const validarFormulario = (e) => {
    switch (e.target.name) { // --- "nombre" e.target.class --- formulario__input
        case "ruta":
            validarCampo(expresiones.ruta, e.target, "ruta");
            break;
        case "horario":
            validarCampo(expresiones.horario, e.target, "horario");
            break;
        case "frecuencia":
            validarCampo(expresiones.frecuencia, e.target, "frecuencia");
            break;
        case "precio":
            validarCampo(expresiones.precio, e.target, "precio");
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
    if (campos.ruta && campos.horario && campos.frecuencia && campos.precio && terminos.checked) {
        document.getElementById("formulario-mensaje").classList.remove("formulario-mensaje-activo");
        document.getElementById("formulario-mensaje-exito").classList.add("formulario-mensaje-exito-activo");

        setTimeout(() => {
            location.reload();
        }, 4000)

    } else {
        document.getElementById("formulario-mensaje").classList.add("formulario-mensaje-activo");
    }

})