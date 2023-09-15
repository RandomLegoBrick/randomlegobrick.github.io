function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    textFont(loadFont("comfortaa.ttf"));
    textAlign(CENTER, CENTER);
}

var boardCellSize = 200;
var boardSize = 3;
var boardPopup = 0;
var boardPopupScale = 1;
var gameStart = false;
var clicked = false;
var mouse = "";
var shake = 0;
var redFlash = 0;

var grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var animationGrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var turn = false;
var turnX = 0;
var winner = false;
var winBanner = 0;
var winBounce = 100;
var winCounter = 0;

function drawBoard(x, y){
    strokeWeight(10);
    stroke(200);
    for(var i = 1; i < boardSize; i ++){
        line(x + (i*boardCellSize), y + (boardCellSize*boardSize), x + (i*boardCellSize), y);
        line(x, y +  + (i*boardCellSize), x + (boardCellSize*boardSize), y + (i*boardCellSize));
    }

    
    for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid.length; j++){
            var a = animationGrid[i][j];
            if(grid[i][j] === 1){
                stroke(200, 100, 50);
                fill(150, 50, 50);
                rect(boardCellSize/2 + x + j * boardCellSize - a/2, boardCellSize/2 + y + i * boardCellSize - a/2, a, a);
                animationGrid[i][j] = lerp(a, boardCellSize - 60, 0.5);
            }else if(grid[i][j] === 2){
                stroke(50, 150, 230);
                fill(30, 75, 150);
                ellipse(boardCellSize/2 + x + j * boardCellSize, boardCellSize/2 + y + i * boardCellSize, a, a);
                animationGrid[i][j] = lerp(a, boardCellSize - 60, 0.5);
            }
        }
    }
}

function row(r){
    var checked = grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2];
    if(checked && grid[r][0] !== 0){
        return grid[r][0];
    }
    return false;
}
function col(c){
    var checked = grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c];
    if(checked && grid[0][c] !== 0){
        return grid[0][c];
    }
    return false;
}

function checkWin(){
    for(var i = 0; i < boardSize; i++){
        var c = col(i);
        if(c){
            return c;
        }

        var r = row(i);
        if(r){
            return r;
        }
    }

    if((grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) || (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2])){
        return grid[1][1];
    }
    return false;
}

function draw(){
    background(250);

    push();
    translate(width/2 + random(-shake, shake), height/2 + random(-shake, shake));
    scale(boardPopup);
    drawBoard(-boardCellSize*boardSize/2, -boardCellSize*boardSize/2);
    pop();

    shake = max(0, shake-0.5);

    if(gameStart && !winner){
        let topX = width/2 - boardCellSize*boardSize/2;
        let topY = height/2 - boardCellSize*boardSize/2;
        
        if(abs(mouseX - width/2) < boardCellSize*boardSize/2 && abs(mouseY - height/2) < boardCellSize*boardSize/2){
            var mx = ~~map(mouseX, topX, topX + boardCellSize*boardSize, 0, 3);
            var my = ~~map(mouseY, topY, topY + boardCellSize*boardSize, 0, 3);

            mouse = "pointer";
            
            if(clicked){
                if(grid[my][mx] === 0){
                    grid[my][mx] = turn ? 1:2;
                    turn = !turn;
                    
                    winner = checkWin();
                }else{
                    shake = 10;
                    redFlash = 20;
                }
            }
        }
    }

    boardPopup = lerp(boardPopup, 1 + sin(frameCount/5) * boardPopupScale, 0.4);
    boardPopupScale = lerp(boardPopupScale, 0, 0.05);

    if(boardPopupScale <= 0.05){
        gameStart = true;
    }

    fill(150);
    textSize(28);
    push();
    translate(width/2 + turnX, height-50);
    text("Player 1's Turn", 0, 0);

    text("Player 2's Turn", width, 0);
    pop();

    turnX = lerp(turnX, -width*turn, 0.1);

    if(winner){

        fill(255, 150 + winBanner/10);    
        rect(0, 0, width, height);

        push();
        translate(width/2, winBanner - 150);    
        fill(0);
        textSize(64);
        text("Player " + (3-winner) +" wins!", 0, 0);
        textSize(16);
        text("Reload To Play Again", 0, 60);
        pop();

        winBanner = lerp(winBanner, 150 + height/2 + sin(winCounter) * winBounce, 0.2);
        winBounce = lerp(winBounce, 0, 0.01);
        winCounter += 0.1;
    }

    noStroke();
    fill(255, 50, 50, redFlash);
    rect(0, 0, width, height);
    redFlash = max(0, redFlash-5);

    cursor(mouse);
    clicked = false;
    mouse = "";
}

function mouseReleased(){
    clicked = true;
}