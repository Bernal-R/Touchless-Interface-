/*
Autor: Bernal Rojas Villalobos. Octubre 2020
Modelo utilizado para reconocimiento de mano "handpose" por ml5
Ejemplo base de uso con ml5 para p5js tomado del Github de  viztopi, disponible en https://github.com/viztopia/hand-pose-tfjs

Proyecto correspondiente a examen parcial del curso Human-Machine Interaction por el profesor Tomás de Camino Beck en Lead University
*/

let video;
let hp;
let poses = [];
let iniciado = false;
let estadoMano = "no detectada";
let umbral_std = 20; //Valor de calibracion para deteccion de cierre de mano
let coordenada_x, coordenada_y;
let menu_principal = true;
let sub_menu1 = false;
let sub_menu2 = false;
let mover_img = false;

function preload() {
    opcion1 = loadSound('https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/op1.mp3');
    opcion2 = loadSound('https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/op2.mp3');
    vaca = loadSound('https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/vaca.mp3');
    oveja = loadSound('https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/oveja.mp3');
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    hp = ml5.handPose(video, modeloListo); //Crear instancia de handPose 

    //Guarda las nuevas posiciones que encuentra, puntos X y Y, probabilidad, entre otros
    hp.on('pose', function(results) {
        poses = results;
    });

    video.hide();

    //Crear y cargar fondo
    fondo = createDiv();
    fondo.position(0, 0);
    fondo.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/fondo(3).png" width="640" height="480">', true);

    //Crear menu 1
    menu1 = createDiv();
    menu1.position(15, 40);
    menu1.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/i1.png" width="200" height="120">', true);
    menu1.hide();

    //Crear menu 2
    menu2 = createDiv();
    menu2.position(225, 40);
    menu2.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/i2.png" width="200" height="120">', true);
    menu2.hide();

    //Crear menu 3
    menu3 = createDiv();
    menu3.position(435, 40);
    menu3.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/i3.png" width="200" height="120">', true);
    menu3.hide();

    //Crear submenu 1
    submenu1 = createDiv();
    submenu1.position(125, 180);
    submenu1.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/1.png" width="200" height="120">', true);
    submenu1.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/2.png" width="200" height="120">', true);
    submenu1.hide();

    //Crear submenu 2
    submenu2 = createDiv();
    submenu2.position(125, 180);
    submenu2.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/o1.png" width="200" height="120">', true);
    submenu2.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/o2.png" width="200" height="120">', true);
    submenu2.hide();

    //Crear div de imagen para mover
    img_movil = createDiv();
    img_movil.position(225, 225);
    img_movil.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/submen%C3%BA2(2).png" width="200" height="120">', true);
    img_movil.hide();

    //Crear boton de atras
    salir = createDiv();
    salir.position(225, 320);
    salir.html('<img style= "opacity: 0.5" src="https://raw.githubusercontent.com/Bernal-R/Touchless-Interface-/master/assets/submen%C3%BA2.png" width="200" height="120">', true);
    salir.hide();

}



function draw() {
    //Este Bloque permite hacer un mirrow de la imagen, esto para que a nivel de usabilidad las personas no se encuentren el problema de cuando muevan su mano a la derecha, en la imagen se vea a la izquierda
    //Rotar imagen de video para visualizar
    translate(video.width, 0);
    scale(-1, 1);
    tint(255, 255);
    image(video, 0, 0, width, height);


    //Dibujar el esqueleto y puntos 
    dibujarPuntos();
    dibujarEsqueleto();

    estadoMano = obetenerEstadoMano();

    //print(coordenada_x, coordenada_y);

    //Boton iniciar
    if (coordenada_y > 257 && coordenada_y < 350 && coordenada_x > 224 && coordenada_x < 440 && estadoMano == "cerrada" && iniciado == false) {
        fondo.hide();
        iniciado = true;
    }


    if (iniciado == true) {

        if (menu_principal) {
            menu1.show();
            menu2.show();
            menu3.show();
            salir.hide();
            submenu1.hide();
            submenu2.hide();
            img_movil.hide();
        }

        //Boton mover imagenes
        if (coordenada_y > 42 && coordenada_y < 145 && coordenada_x > 427 && coordenada_x < 610 && estadoMano == "cerrada") {
            menu1.hide();
            menu2.hide();
            menu3.hide();
            salir.show();
            img_movil.show();
            submenu1.hide();
            submenu2.hide();
            menu_principal = false;
            mover_img = true;
        }

        if (mover_img == true) {
            //x_corregido = map(coordenada_x, 480, 0, 0, 480);
            //y_corregido = map(coordenada_y, 640, 0, 0, 640);

            translate(img_movil, 0);
            scale(-1, 1);

            //print(coordenada_x, coordenada_y);
            img_movil.position(coordenada_x, coordenada_y);
        }

        //Boton menu 1
        if (coordenada_y > 42 && coordenada_y < 145 && coordenada_x > 220 && coordenada_x < 410 && estadoMano == "cerrada") {
            menu1.hide();
            menu2.hide();
            menu3.hide();
            salir.show();
            img_movil.hide();
            submenu1.show();
            submenu2.hide();
            menu_principal = false;
            sub_menu1 = true;
            sub_menu2 = false;
            mover_img = false;
        }

        //Boton menu 2
        if (coordenada_y > 42 && coordenada_y < 145 && coordenada_x > 20 && coordenada_x < 200 && estadoMano == "cerrada") {
            menu1.hide();
            menu2.hide();
            menu3.hide();
            salir.show();
            img_movil.hide();
            submenu1.hide();
            submenu2.show();
            menu_principal = false;
            sub_menu2 = true;
        }


        //Botones submenu 1
        if (coordenada_y > 190 && coordenada_y < 290 && coordenada_x > 315 && coordenada_x < 500 && estadoMano == "cerrada" && sub_menu1 == true && mover_img == false) {
            vaca.play();
        } else if (coordenada_y > 190 && coordenada_y < 290 && coordenada_x > 113 && coordenada_x < 320 && estadoMano == "cerrada" && sub_menu1 == true && mover_img == false) {
            oveja.play();
        }

        //Botones submenu 2 
        if (coordenada_y > 190 && coordenada_y < 290 && coordenada_x > 315 && coordenada_x < 500 && estadoMano == "cerrada" && sub_menu1 == false && mover_img == false) {
            opcion1.play();
        } else if (coordenada_y > 190 && coordenada_y < 290 && coordenada_x > 113 && coordenada_x < 320 && estadoMano == "cerrada" && sub_menu1 == false && mover_img == false) {
            opcion2.play();
        }

        //Boton salir 
        if (coordenada_y > 333 && coordenada_y < 433 && coordenada_x > 220 && coordenada_x < 410 && estadoMano == "cerrada") {
            menu_principal = true;
            sub_menu1 = false;
        }
    }



    /*
    if (estadoMano == "abierta") {
        print("abierta");
    } else if (estadoMano == "cerrada") {
        print("cerrada");
    } else if (estadoMano == "no detectada") {
        print("no detectada");
    }
    */
}







//----------------------------- FUNCIONES DETECCION DE MANO ---------------------------- 
//Arranca cuando carga el modelo
function modeloListo() {
    hp.singlePose();
}

/* ALGORIMO DETECCION DE CIERRE DE MANO:
El modelo HandPose retorna 42 valores, correspondientes a las coordenadas X y Y de 21 puntos, son 4 puntos por dedo (5 dedos) y uno de la base de la palma de la mano

1- Extraer las coordenadas de los 21 puntos 
2- Calcular la distancia eucilidana entre cada coordenada con respecto a TODAS las coordenadas de los demás puntos
3- Armar un vector de distancias con el calculo anterior
4- Calcular la desviación estandar de ese vector. De este modo podemos ver qué tan juntos están los puntos y así determinar si la mano se encuentra abierta o cerrada
 */
function obetenerEstadoMano()  {
    let matriz = []

    //Extraer X y Y de los 21 puntos
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        for (let j = 0; j < pose.landmarks.length; j++) {
            let punto = pose.landmarks[j];
            matriz.push([punto[0], punto[1]]); //Guardar coordenadas X y Y
        }
    }

    //Armar vector de distancias
    let vector_distancias = []
    for (var i in matriz) {
        for (var j in matriz) {
            let distancia = int(dist(matriz[i][0], matriz[i][1], matriz[j][0], matriz[j][1])); //Calculo de distancias
            vector_distancias.push(distancia)
        }
    }

    //Calcular desviacion estandar
    let std = desviacionEstandar(vector_distancias);

    if (isNaN(std)) {
        return "no detectada";
    } else {
        //print(std); //Revisar valor de std para calibracion
        if (std < umbral_std) {
            return "cerrada";
        } else {
            return "abierta";
        }
    }


}

//----------------------------- FUNCIONES DE CALCULO AUXILIARES ---------------------------- 
function desviacionEstandar(values) {
    var avg = promedio(values);

    var squareDiffs = values.map(function(value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = promedio(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function promedio(data) {
    var sum = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}


//----------------------------- FUNCIONES DIBUJAR MANO ---------------------------- 
function dibujarPuntos()  {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];

        for (let j = 0; j < pose.landmarks.length; j++) { //En pose.landmarks se encuentran las coordenadas de cada punto
            let keypoint = pose.landmarks[j]; //Obtener las coordenadas X y Y

            //Dibujar puntos
            fill(0, 0, 255);
            noStroke();
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}

function dibujarEsqueleto() {
    for (let i = 0; i < poses.length; i++) {
        let annotations = poses[i].annotations;
        //Dibujar puntos
        stroke(0, 0, 255);
        for (let j = 0; j < annotations.thumb.length - 1; j++) { //En pose.thumb se encuentran las corrdenadas de la linea del dedo pulgar
            line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
        }
        for (let j = 0; j < annotations.indexFinger.length - 1; j++) { //En pose.thumb se encuentran las corrdenadas de la linea del dedo indice
            line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.middleFinger.length - 1; j++) { //En pose.thumb se encuentran las corrdenadas de la linea del dedo medio
            line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.ringFinger.length - 1; j++) { //En pose.thumb se encuentran las corrdenadas de la linea del dedo anular
            line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
        }
        for (let j = 0; j < annotations.pinky.length - 1; j++) { //En pose.thumb se encuentran las corrdenadas de la linea del dedo pequño
            line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
        }
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
        line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
        coordenada_x = annotations.palmBase[0][0];
        coordenada_y = annotations.palmBase[0][1];
    }

}
