const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const resolution = 10;
canvas.width = 800;
canvas.height = 800;


//draw a grid to represent each cell 
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
            .map(() => Math.floor(Math.random() * 2))
        );
}

// plot the grid
let grid = buildGrid();

function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            context.beginPath();
            context.rect(col * resolution, row * resolution, resolution, resolution);
            context.fillStyle = cell ? 'blue' : 'white';
            context.fill();
        }
    }
}

requestAnimationFrame(update);
render(grid);

function update() {
    grid = nextGeneration(grid);
    render(grid);
    requestAnimationFrame(update);
}

function nextGeneration(grid) {
    const nextGeneration = grid.map(arr => [...arr]);

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let nbNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;
                    if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                        const currentNeighbour = grid[col + i][row + j];
                        nbNeighbours += currentNeighbour;
                    }

                }
            }
            //rules :
            //Any live cell with fewer than two live neighbours dies, as if by underpopulation
            //Any live cell with more than three live neighbours dies, as if by overpopulation
            //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction
            //Any live cell with two or three live neighbours lives on to the next generation
            if (cell === 1 && nbNeighbours < 2) {
                nextGeneration[col][row] = 0;
            } else if (cell === 1 && nbNeighbours > 3) {
                nextGeneration[col][row] = 0;
            } else if (cell === 0 && nbNeighbours === 3) {
                nextGeneration[col][row] = 1;
            }
        }
    }
    return nextGeneration;
}