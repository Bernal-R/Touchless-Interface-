/*
Autor: Bernal Rojas Villalobos. Octubre 2020
Modelo utilizado para reconocimiento de mano "handpose" por ml5
Ejemplo base de uso con ml5 para p5js tomado del Github de  viztopi, disponible en https://github.com/viztopia/hand-pose-tfjs

Proyecto correspondiente a examen parcial del curso Human-Machine Interaction por el profesor Tomás de Camino Beck en Lead University
*/

let video;
let hp;
let poses = [];
let img;


function setup() {
    createCanvas(720, 400);
    img = loadImage('bopit.png'); // Cargar la imagen
}

/*
function setup() {
    createCanvas(640, 480);
  
    video = createCapture(VIDEO);
    video.size(width, height);

    hp = ml5.handPose(video, modeloListo); //Crear instancia de handPose 

    //Guarda las nuevas posiciones que encuentra, puntos X y Y, probabilidad, entre otros
    hp.on('pose', function(results) {
        poses = results;
        //console.log(poses)
    });

    video.hide();
 
    img = loadImage('bopit.png'); // Cargar la imagen
}
*/

//Arranca cuando carga el modelo
function modeloListo() {
    //select('#status').html('');
    hp.singlePose();
}

function draw() {
    // Muestra la imagen en su tamaño original en la posición (0,0)
    image(img, 0, 0);
    // Muestra la imagen en la posición (0, height/2) a la mitad del tamaño
    image(img, 0, height / 2, img.width / 2, img.height / 2);

    /*
    //Este Bloque permite hacer un mirrow de la imagen, esto para que a nivel de usabilidad las personas no se encuentren el problema de cuando muevan su mano a la derecha, en la imagen se vea a la izquierda
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);

    //Dibujar el esqueleto y puntos 
    dibujarPuntos();
    dibujarEsqueleto();
    */
}


function dibujarPuntos()  {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i];
        for (let j = 0; j < pose.landmarks.length; j++) { //En pose.landmarks se encuentran las corrdenadas de cada punto
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
    }
}