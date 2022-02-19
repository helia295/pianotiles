const urlParams = new URLSearchParams(window.location.search);
const songname = urlParams.get('songname');

let rhythm = [
]
let rhythmPlayed = [
]

const line = [0, 100, 200, 300, 400]
const DROP_TIME = 20;
let GAME_SPEED = 300;
const CANVAS_BORDER_COLOUR = 'red';
const CANVAS_BACKGROUND_COLOUR = "white";


const RHYTHM_BACKGROUND_COLOUR = "#8aabe3";


function addRytthm() {
    var randomIndex = Math.floor(Math.random() * line.length)
    var x_AxisOfrhythmToAdd = line[randomIndex];
    rhythm.push({
        'x': x_AxisOfrhythmToAdd, 'y': 0, 'width': 100, 'length': 100
    })

    console.log(rhythm)
}

function backgroundMusic() {
    var audio = new Audio(`${songname}.mp3`);
    audio.play();
}
function stopMusic() {
    var audio = new Audio(`${songname}.mp3`);
    audio.pause();
    audio.currentTime = 0;
}

var canvas_main = document.getElementById('main_screen');
var context = canvas_main.getContext('2d');
let score = document.getElementById('score_box');
let gameSpeedIncrease = false;



// Start game
//main();

/**
 * Main function of the game
 * called repeatedly to advance the game
 */

let tick = 0

function start() {
    backgroundMusic(); 
    main();
}

function main() {
    
    setTimeout(function onTick() {
        clearCanvas();
        
        // khi chay het chieu dai cua 1 thanh rhythm, tao them 1 rhythm moi
        if (tick === 100 / DROP_TIME - 1) {
            addRytthm();
            tick = 0
        } else {
            tick++
        }
        drawRythm()
        drawRythmPlayed();


        if (didGameEnd()) return;


        advanceTurn();

        // Call game again
        main();
    }, GAME_SPEED);
    gameOver();

}

function gameOver() {
    stopMusic();
    clearCanvas();
    var canvas = document.getElementById("main_screen");
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER!", 10, 50);
}

function clearCanvas() {
    //  Select the colour to fill the drawing
    context.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    context.strokestyle = CANVAS_BORDER_COLOUR;
    // Draw a "filled" rectangle to cover the entire canvas
    context.fillRect(0, 0, canvas_main.width, canvas_main.height);
    // Draw a "border" around the entire canvas
    context.strokeRect(0, 0, canvas_main.width, canvas_main.height);
}



function drawRythm() {
    //  Select the colour to fill the drawing
    context.fillStyle = "blue";
    //  Select the colour for the border of the canvas
    rhythm.forEach(element => {
        context.fillRect(element['x'], element['y'], element['width'], element['length']);
    });
}

function drawRythmPlayed() {
    //  Select the colour to fill the drawing
    context.fillStyle = RHYTHM_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas

    rhythmPlayed.forEach(element => {
        context.fillRect(element['x'], element['y'], element['width'], element['length']);
    });
}



function advanceTurn() {
    rhythm.forEach(element => {
        element['y'] += DROP_TIME
    });
    rhythmPlayed.forEach(element => {
        element['y'] += DROP_TIME
    });
}


function didGameEnd() {
    for (let i = 0; i < rhythm.length; i++) {
        if (rhythm[i]['y'] + rhythm[i]['length'] >= canvas_main.height) {
            return true
        }
    };
}

canvas_main.addEventListener('click', function (event) {
    var rect = canvas_main.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    // start 
    console.log(rhythm[0].x)
    console.log(rhythm[0].y)
    console.log((rhythm[0].x + rhythm[0].width))
    console.log((rhythm[0].y + rhythm[0].length))
    // end
    if (x > rhythm[0].x && y > rhythm[0].y && x < (rhythm[0].x + rhythm[0].width) && y < (rhythm[0].y + rhythm[0].length)) {
        rhythmPlayed.unshift(rhythm[0])
        rhythm.shift();

        // console.log(score.innerHTML)
        score.innerHTML++
        if (score.innerHTML % 5 == 00 && score.innerHTML != 00) {
            gameSpeedIncrease = true;
        } else {
            gameSpeedIncrease = false;
        }

        if (gameSpeedIncrease) {
            GAME_SPEED -= 30
            console.log('gamespeed:' + GAME_SPEED)
            gameSpeedIncrease = false;
        }

    }

}, false);