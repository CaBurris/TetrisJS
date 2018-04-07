const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);  //increase object size


const matrix = [
    [0, 0, 0],
    [1, 1, 1],  //add the middle array one so object will rotate around the center vs flipping up and down
    [0, 1, 0],
];

//collision detection function
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    //iterating over the player
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x){
            //y = row, x = column
            if (m[y][x] !== 0 && //check if player matrix on index y and x is not 0,
                (arena[y + o.y] && //makes sure the arena row exists. not existing shows a collide
                arena[y + o.y][x + o.x]) !== 0) { //access the arena row child
                return true; //yes a collision has occurred
            }
        }
    }
    return false; //if no collision is detected
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw the arena
    drawMatrix(arena, {x: 0, y: 0} );
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

//copy all values from player into the arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}

function playerDrop() {
    player.pos.y++; //moves user down
    //use merge and collide
    //if we drop and collide, then we are touching the ground or another piece
    if (collide(arena, player)) {
        player.pos.y--; //move the player back up
        merge(arena, player);
        player.pos.y = 0; //set the player back to the top
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
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

    //console.log(time);
    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(12, 20); //12 numbers wide, 20 unites high


const player = {
    pos: {x: 5, y: 5},
    matrix: matrix,
}

//allows user input to move pieces using arrow keys
document.addEventListener('keydown' , event => {
    if (event.keyCode === 37) {
        playerMove(-1); //if user presses left arrow key, moves item to the left
    } else if (event.keyCode === 39) {
        playerMove(1); //moves user to the right
    } else if (event.keyCode === 40) {
        playerDrop();
    }
});

update();
