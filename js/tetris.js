const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);  //increase object size

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
]; //add the middle array one so object will rotate around the center vs flipping up and down
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

const player = {
    pos: {x: 5, y: 5},
    matrix: matrix,
}

drawMatrix(player.matrix, player.pos);
