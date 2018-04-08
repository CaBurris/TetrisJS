const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);  //increase object size


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

//create peices
function createPiece(type) {
    if (type === 'T') {
        return [
               [0, 0, 0],
               [1, 1, 1],
               [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
               [1, 1],
               [1, 1],
        ];
    } else if (type === 'L') {
        return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
        ];
    } else if (type === 'J') {
        return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
        ];
    } else if (type === 'I') {
        return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
        ];
    } else if (type === 'S') {
        return [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
        ];
    }
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
        playerReset(); //will create a random new piece
        player.pos.y = 0; //set the player back to the top
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir; // if player collides in arena, player moves back. cannot exit arean now
    }
}

//get random pieces every time
function playerReset() {
    //list all availble pieces in a string
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0; //player at the top
    player.pos.x = (arena[0].length / 2 | 0) -
                            (player.matrix[0].length / 2 | 0); //put player in the middle
    //if new piece reaches top of arena, need to clear arena - game over
    if (collide(arena, player))  {
        arena.forEach(row => row.fill(0));
    }
}

//implement player rotate
function playerRotate(dir) {
    const pos = player.pos.x;
    //initialize an offset variable
    let offset = 1;
    rotate(player.matrix, dir);
    //after rotation, check collision again
    while (collide(arena, player)) {
        player.pos.x += offset; //moves to the right
        offset = -(offset + (offset >  0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return; //ensures piece cannot rotate through the wall
        }
    }
}

//create rotation
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x =  0; x < y; ++x) {
            //create tuple switch
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    //check the direction
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
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
    matrix: createPiece('T'),
}

//allows user input to move pieces using arrow keys
document.addEventListener('keydown' , event => {
    if (event.keyCode === 37) {
        playerMove(-1); //if user presses left arrow key, moves item to the left
    } else if (event.keyCode === 39) {
        playerMove(1); //moves user to the right
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81){
        playerRotate(-1); // if user preses Q, rotates left
    } else if (event.keyCode === 87) {
        playerRotate(1); // if user preses W, rotates right
    }
});

update();
