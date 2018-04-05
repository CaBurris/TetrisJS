const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);  //increase object size


const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
]; //add the middle array one so object will rotate around the center vs flipping up and down

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x,
                                          y + offset.y,
                                          1, 1);
            }
        });
    });
}

function playerDrop() {
    player.pos.y++; //moves user down
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time- lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    console.log(time);
    draw();
    requestAnimationFrame(update);
}

const player = {
    pos: {x: 5, y: 5},
    matrix: matrix,
}

//allows user input to move pieces using arrow keys
document.addEventListener('keydown' , event => {
    if (event.keyCode === 37) {
        player.pos.x--; //if user presses left arrow key, moves item to the left
    } else if (event.keyCode === 39) {
        player.pos.x++; //moves user to the right
    } else if (event.keyCode === 40) {
        playerDrop();
    }
});

update();
