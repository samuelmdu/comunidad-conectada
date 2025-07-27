//PASO 1:Obtener el html por medio del DOM
const inputs = document.querySelectorAll('#formulario input, #formulario textarea'); //textarea no es un input por eso lo ponemos

const formulario = document.getElementById("formulario");

const expresiones ={
    nombre : /^[a-zA-ZÀ-ÿ\s]{3,45}$/ , //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    emprendimiento : /^[a-zA-ZÀ-ÿ0-9\s]{3,45}$/ , //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    descripcion : /^[a-zA-ZÀ-ÿ0-9\s]{3,200}$/ , //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    //password:/^.{4,12}$/, //Acepta todo Rango de 4 a 12
    correo :/^[a-zA-Z0-9\_]+@[a-zA-Z]+\.[a-zA-Z]+$/ , //Estructura dato1@dato2.dato3 dato1:acepta letras minusculas y mayusculas, numeros, y acepta guion bajo  dato2 y 3 : Aceptan solo letras mayusculas y minusculas
    ubicacion : /^[a-zA-ZÀ-ÿ0-9\s]{3,45}$/ , //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
    telefono :/^\d{8,11}$/, //Acepta digitos Rango es de 8 a 11
    otro : /^[a-zA-ZÀ-ÿ\s]{3,45}$/  //Admite letras mayusculas, minusculas, acentos y espacio Rango 3 a 45
}

const campos={
    nombre: false,
    correo: false,
    telefono: false, 
    emprendimiento: false, 
    ubicacion: false, 
    otro: false, 
    descripcion: false
}

//PASO 3: CREAR LAS ACCIONES FUNCIONES
// e = <input type="text" class="formulario__input" name="nombre" id="nombre" placeholder="Steph Delgado">
const validarFormulario = (e)=>{
    switch(e.target.name){ // --- "nombre" e.target.class --- formulario__input
        case "emprendimiento":
            //validar funcion
            //       parametro1 = condiciones, parametro2 = e.target, parametro = identificador = ""
            validarCampo(expresiones.emprendimiento,e.target,"emprendimiento")
        break;
        case "nombre":
            //funcion
            validarCampo(expresiones.nombre,e.target,"nombre");
        break;
        case "descripcion":
            //funcion
            validarCampo(expresiones.descripcion,e.target,"descripcion");
        break;
        case "correo":
            //funcion
            validarCampo(expresiones.correo,e.target,"correo")
        break;
        case "telefono":
            //telefono
            validarCampo(expresiones.telefono,e.target,"telefono")
        break;
        case "ubicacion":
            validarCampo(expresiones.ubicacion,e.target,"ubicacion")
        break;
        case "otro":
            validarCampo(expresiones.otro,e.target,"otro")
        break;
    }
}

const validarCampo= (expresion,input,campo)=>{
    //test() ---  /^[a-zA-Z0-9\_\-]{4,16}$/.test("step4_-#")--- true o false
    ///^[a-zA-ZÀ-ÿ\s]{3,45}$/.test("s")-- false
    if(expresion.test(input.value)){
        document.getElementById(`grupo-${campo}`).classList.remove("formulario-grupo-incorrecto");
        document.getElementById(`grupo-${campo}`).classList.add("formulario-grupo-correcto");
        document.querySelector(`#grupo-${campo} .formulario-input-error`).classList.remove("formulario-input-error-activo");
        document.querySelector(`#grupo-${campo} i`).classList.remove("bxs-x-circle");
        document.querySelector(`#grupo-${campo} i`).classList.add("bxs-check-circle");
        campos[campo]=true;
    }else{
        //                       grupo__nombre
        document.getElementById(`grupo-${campo}`).classList.add("formulario-grupo-incorrecto");
        document.getElementById(`grupo-${campo}`).classList.remove("formulario-grupo-correcto");
        document.querySelector(`#grupo-${campo} .formulario-input-error`).classList.add("formulario-input-error-activo");
        document.querySelector(`#grupo-${campo} i`).classList.add("bxs-x-circle");
        document.querySelector(`#grupo-${campo} i`).classList.remove("bxs-check-circle");
        campos[campo]=false;
    }
}

//PASO 2: Recorrer y Escuchar los eventos
inputs.forEach((input)=>{
    input.addEventListener("keyup",validarFormulario)//KEYUP EVENTO CUANDO PRESIONAMOS UNA TECLA
    input.addEventListener("blur",validarFormulario)//BLUR CUANDO QUITAMOS EL CURSOR/SELECCION
})

formulario.addEventListener("submit",(e) =>{
    e.preventDefault();//No deja que se recarge la pagina

    const terminos = document.getElementById("terminos");
    if(campos.emprendimiento && campos.nombre && campos.descripcion && campos.correo && campos.telefono && campos.otro && campos.ubicacion && terminos.checked){
        document.getElementById("formulario-mensaje").classList.remove("formulario-mensaje-activo");
        document.getElementById("formulario-mensaje-exito").classList.add("formulario-mensaje-exito-activo");

        setTimeout(()=>{
           location.reload(); 
        },4000)

    }else{
        document.getElementById("formulario-mensaje").classList.add("formulario-mensaje-activo");
    }

})

// Proceso para cuando el usuario seleccione categoría "Otro"

const radiosCategoria = document.querySelectorAll('input[name="categoria"]'); // Todos los radios
const inputOtro = document.getElementById('otro'); // Este es el input de texto
const grupoOtro = document.getElementById('grupo-otro'); // Todo el grupo visual

radiosCategoria.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.value === 'otro' && radio.checked) {
      grupoOtro.style.display = 'block'; // Mostrar el grupo entero
      validarCampo(expresiones.otro, inputOtro, 'otro');
    } else {
      grupoOtro.style.display = 'none'; // Ocultar grupo
      grupoOtro.classList.remove('formulario-grupo-incorrecto', 'formulario-grupo-correcto');
      campos.otro = true; // Marcar como válido porque no aplica
    }
  });
});