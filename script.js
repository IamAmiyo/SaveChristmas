var canvas, context;
//Load Images
var bacgroundImg = document.createElement('img');
var tile_general_img = document.createElement('img');
var tile_left_snow_img = document.createElement('img');
var tile_middle_snow_img = document.createElement('img');
var tile_right_snow_img = document.createElement('img');
var tree_top_img = document.createElement('img');
var tree_bottom_img = document.createElement('img');
var gift_player_img = document.createElement('img');

function loadMapImages(){
    bacgroundImg.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/background.png';    
    tile_general_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/Tiles/Tile_General.png';
    tile_left_snow_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/Tiles/Tile_Left_Snow.png';
    tile_middle_snow_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/Tiles/Tile_Middle_Snow.png';
    tile_right_snow_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/Tiles/Tile_Right_Snow.png';     
    tree_top_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/tree/tree_top.png';
    tree_bottom_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/tree/tree_bottom.png';
    gift_player_img.src = 'https://raw.githubusercontent.com/LantareCode/assets_for_codepen/master/SavingChristmas/images/gift.png';
}

//Player
var PLAYER_STARTING_LIVES = 5;
var playerLives = PLAYER_STARTING_LIVES;
var giftsSaved = 0;
var GIFTS_TO_SAVE = 0;
var GIFT_SIZE = 20;
var MOVESPEED = 15;
var GIFT_BUFFER = 30;
var gift_buffer_x = gift_buffer_y = 0;
var gift_x = gift_y = 0;

//Map
var BLOCK_SIZE = 30;
var BLOCK_COL = 30;
var BLOCK_ROW = 20;
var block_x = block_y = 0;
var mapArr = [];
var currentMap = 0;
var SELECTED_MAP;

var gameTimer;

window.onload = function(){
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');    
    canvas.width = 900;
    canvas.height = 600;   
    
    addSnow();
    
    addMaps();   
    SELECTED_MAP = mapArr[currentMap]; 
    GIFTS_TO_SAVE = mapArr.length;
        
    document.getElementById('playerlives').innerHTML = playerLives;    
    document.getElementById('giftssaved').innerHTML = giftsSaved + ' / ' + GIFTS_TO_SAVE;
    
    resetPlayer();    
    loadMapImages();
    
    gameTimer = setInterval(draw, 1000/30);        
    window.addEventListener('keydown', buttonPressed, false);
    window.addEventListener('keyup', buttonUp, false);
};

function draw(){
    drawBlock(0, 0, canvas.width, canvas.height, 'grey');    
    drawMap(SELECTED_MAP.MAP);
    drawPlayer();
    
    moveSnow();
    addSnowFromTop();
}

function drawBlock(x,y, width,height, colour){  
    canvasContext.fillStyle = colour;
    canvasContext.fillRect(x,y, width,height);         
}
function findIndex(col, row){    
    var index = col + BLOCK_COL * row;    
    return index;
}
function displayText(text, type){
    if(type === 'GOOD')
        $('#alerts').css('color', 'greenyellow');
    else if (type === 'BAD')
        $('#alerts').css('color', 'red');
	
    document.getElementById('alerts').innerHTML = text;   
}

function drawMap(map){      
    block_x = block_y = 0;
    var colour = '';
    
    var tempCounter = 0;
    for(var i = 0; i < map.length; i++){          
        if(tempCounter === BLOCK_COL){
            block_x = 0;
            tempCounter = 0;
            block_y += BLOCK_SIZE;            
        }              
        switch(map[i]){
            case 0://background/path                     
                canvasContext.drawImage(bacgroundImg, block_x, block_y);
                break;
            case 1://Tile_General                    
                canvasContext.drawImage(tile_general_img, block_x, block_y);   
                break;
            case 2://Tile_Left_Snow                    
                canvasContext.drawImage(tile_left_snow_img, block_x, block_y);                
                break;
            case 3://Tile_Middle_Snow                    
                canvasContext.drawImage(tile_middle_snow_img, block_x, block_y);                
                break;
            case 4://Tile_Right_Snow                    
                canvasContext.drawImage(tile_right_snow_img, block_x, block_y);
                break;
            case 8://tree top                    
                canvasContext.drawImage(tree_top_img, block_x, block_y);
                break;
            case 9://tree bottom                    
                canvasContext.drawImage(tree_bottom_img, block_x, block_y);
                break;
            default:
                drawBlock(block_x, block_y, BLOCK_SIZE,BLOCK_SIZE, 'pink');                
        }
        block_x += BLOCK_SIZE;
        tempCounter++;
    }    
}

function drawPlayer(){        
    drawBlock(gift_buffer_x, gift_buffer_y, GIFT_BUFFER,GIFT_BUFFER, 'rgba(225,225,225,0)');
    canvasContext.drawImage(gift_player_img, gift_x, gift_y);
}
function movePlayer(direction){
    var giftCol = 0; var giftCol2 = 0;    
    var giftRow = 0; var giftRow2 =0;
    var giftIndex = 0; var giftIndex2 = 0; 
    
    if(direction === 'LEFT'){
            giftCol = Math.floor((gift_buffer_x-1) / BLOCK_SIZE);
            giftRow = Math.floor(gift_buffer_y / BLOCK_SIZE);
            giftIndex = findIndex(giftCol, giftRow);  
            giftCol2 = Math.floor((gift_buffer_x-1) / BLOCK_SIZE);
            giftRow2 = Math.floor((gift_buffer_y+28) / BLOCK_SIZE);
            giftIndex2 = findIndex(giftCol2, giftRow2);            
        
        gift_x -= MOVESPEED;
        if(testMove(giftIndex) && testMove(giftIndex2)){                        
            gift_buffer_x -= MOVESPEED;
        }
    }        
    else if (direction === 'RIGHT'){
            giftCol = Math.floor((gift_buffer_x+30) / BLOCK_SIZE);
            giftRow = Math.floor(gift_buffer_y / BLOCK_SIZE);
            giftIndex = findIndex(giftCol, giftRow);
            giftCol2 = Math.floor((gift_buffer_x+30) / BLOCK_SIZE);
            giftRow2 = Math.floor((gift_buffer_y+28) / BLOCK_SIZE);
            giftIndex2 = findIndex(giftCol2, giftRow2);        
        
        gift_x += MOVESPEED;
        if(testMove(giftIndex) && testMove(giftIndex2)){                           
            gift_buffer_x += MOVESPEED;            
        }
    }
    else if (direction === 'UP'){
            giftCol = Math.floor(gift_buffer_x / BLOCK_SIZE);
            giftRow = Math.floor((gift_buffer_y-1) / BLOCK_SIZE);
            giftIndex = findIndex(giftCol, giftRow);
            giftCol2 = Math.floor((gift_buffer_x+28) / BLOCK_SIZE);
            giftRow2 = Math.floor((gift_buffer_y-1) / BLOCK_SIZE);
            giftIndex2 = findIndex(giftCol2, giftRow2);
        
        gift_y -= MOVESPEED;
        if(testMove(giftIndex) && testMove(giftIndex2)){                        
            gift_buffer_y -= MOVESPEED;
        }
    }        
    else if (direction === 'DOWN'){
            giftCol = Math.floor((gift_buffer_x) / BLOCK_SIZE);
            giftRow = Math.floor((gift_buffer_y+30) / BLOCK_SIZE);
            giftIndex = findIndex(giftCol, giftRow);
            giftCol2 = Math.floor((gift_buffer_x+28) / BLOCK_SIZE);
            giftRow2 = Math.floor((gift_buffer_y+30) / BLOCK_SIZE); 
            giftIndex2 = findIndex(giftCol2, giftRow2);
        
        gift_y += MOVESPEED;
        if(testMove(giftIndex) && testMove(giftIndex2)){                        
            gift_buffer_y += MOVESPEED;            
        }
    }          
    drawPlayer();
}

function testMove(index){ 
    if(SELECTED_MAP.MAP[index] === 1 || SELECTED_MAP.MAP[index] === 2 || SELECTED_MAP.MAP[index] === 3 || SELECTED_MAP.MAP[index] === 4){       
        gift_buffer_y += MOVESPEED;  
        setTimeout(touchedSide, 50);
    }
    else if(SELECTED_MAP.MAP[index] === 8 || SELECTED_MAP.MAP[index] === 9)
        setTimeout(reachedTree, 50);
    else
        return true;
}
var touched = false;
function touchedSide(){
    playerLives--;   
    document.getElementById('playerlives').innerHTML = playerLives;
    
    if(playerLives===0){        
        setTimeout(gameover, 50);
    }
    else{         
        displayText('Oh oh! You touched a side! Life -1', 'BAD');   
        resetPlayer();                     
    }
}
function reachedTree(){
    giftsSaved++;
    
    document.getElementById('giftssaved').innerHTML = giftsSaved + ' / ' + GIFTS_TO_SAVE;
    console.log('giftsSaved: ' + giftsSaved);

    if(giftsSaved === GIFTS_TO_SAVE){   
        setTimeout(gameWon, 50);
    }else{
        displayText('Ho ho! You saved a Gift! Life +1', 'GOOD');
        playerLives++; 
        document.getElementById('playerlives').innerHTML = playerLives;        
        
        currentMap++;
        SELECTED_MAP = mapArr[currentMap];        
        loadMapImages();
        
        resetPlayer();    
        draw(); 
    }  
}


function resetPlayer(){
    if(playerLives === 0){
        playerLives = PLAYER_STARTING_LIVES;   
        document.getElementById('playerlives').innerHTML = playerLives;
    }    
    gift_x = SELECTED_MAP.gift_x;
    gift_y = SELECTED_MAP.gift_y;
    gift_buffer_x = SELECTED_MAP.gift_buffer_x;
    gift_buffer_y = SELECTED_MAP.gift_buffer_y;
}
function resetMap(){    
    if(playerLives === 0 || giftsSaved === GIFTS_TO_SAVE){
        currentMap = 0;
        giftsSaved = 0;
        document.getElementById('giftssaved').innerHTML = giftsSaved + ' / ' + GIFTS_TO_SAVE;
    }
    else
        currentMap++;
        
    SELECTED_MAP = mapArr[currentMap];        
    loadMapImages();    
}
function restartGame(){
    resetMap();
    setTimeout(1);
    resetPlayer();    
}
function gameWon(){
    displayText('Ho ho ho Merry Christmas! You saved Christmas!!!', 'GOOD');    
    restartGame();  
}
function gameover(){
    displayText('Oh no... Christmas was canceled! Try again.', 'BAD');    
    restartGame();    
}

//-- Arrow functions start --
function leftArrow(){    
    movePlayer('LEFT');
}
function rightArrow(){      
    movePlayer('RIGHT');
}
function upArrow(){    
    movePlayer('UP');
}
function downArrow(){    
    movePlayer('DOWN');
}
var buttonpressed = false;
function buttonPressed(pressed){
    switch(pressed.keyCode){
        case 37:  
            if(!buttonpressed){
                leftArrow();
                buttonpressed = true;
            }
            break;
        case 39:
            if(!buttonpressed){
                rightArrow();            
                buttonpressed = true;
            }
            break;
        case 38:
            if(!buttonpressed){
                upArrow();
                buttonpressed = true;
            }
            break;
        case 40:
            if(!buttonpressed){
                downArrow();
                buttonpressed = true;
            }
            break;            
    }
}
function buttonUp(released){
    buttonpressed = false;
}
//-- Arrow functions end --

function maps(){
    this.MAP = [];
    this.gift_x = 0;
    this.gift_y = 0;
    this.gift_buffer_x = 0;
    this.gift_buffer_y = 0;
}
function addMaps(){
    var tempMap;
		//MAP 0 (Anica)
    tempMap = new maps();
        tempMap.gift_x = 95;
        tempMap.gift_y = 125; 
        tempMap.gift_buffer_x = tempMap.gift_x-5;
        tempMap.gift_buffer_y = tempMap.gift_y-5;
        tempMap.MAP = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                       1, 0, 0, 0, 0, 0, 2, 3, 0, 3, 0, 4, 0, 2, 3, 3, 3, 3, 0, 4, 0, 0, 3, 0, 0, 0, 3, 3, 0, 1,
                       1, 0, 3, 3, 3, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 4, 0, 0, 0, 1,
                       1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 3, 3, 3, 3, 0, 3, 0, 1, 8, 0, 3, 0, 1, 0, 3, 0, 1,
                       1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 3, 0, 0, 0, 0, 3, 1, 0, 1, 9, 0, 0, 3, 0, 0, 1, 0, 1,
                       1, 0, 1, 2, 3, 4, 1, 0, 0, 1, 0, 4, 0, 0, 3, 3, 0, 1, 0, 0, 1, 2, 3, 4, 1, 0, 4, 0, 3, 1,
                       1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 2, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1,
                       1, 2, 3, 3, 3, 3, 3, 4, 1, 0, 3, 4, 0, 0, 1, 0, 3, 0, 2, 3, 3, 4, 0, 0, 1, 0, 0, 0, 1, 1,
                       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 3, 0, 1, 1,
                       1, 2, 3, 3, 4, 0, 2, 3, 3, 4, 1, 0, 1, 0, 1, 2, 4, 0, 2, 3, 4, 0, 1, 0, 1, 0, 1, 0, 1, 1,
                       1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1,
                       1, 0, 1, 0, 0, 3, 0, 0, 2, 0, 0, 2, 3, 4, 0, 0, 0, 2, 0, 3, 0, 4, 0, 0, 1, 0, 1, 0, 1, 1,
                       1, 0, 1, 2, 4, 1, 2, 0, 0, 2, 0, 0, 1, 0, 2, 3, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1,
                       1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 4, 1, 0, 1, 0, 0, 1,
                       1, 0, 3, 3, 0, 4, 1, 1, 2, 0, 1, 0, 1, 0, 2, 3, 4, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1,
                       1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4, 0, 2, 0, 1,
                       1, 0, 0, 1, 2, 3, 3, 3, 3, 4, 1, 0, 1, 0, 2, 4, 0, 1, 0, 1, 0, 1, 3, 0, 3, 0, 3, 0, 0, 1,
                       1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                       1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 3, 3, 3, 3, 3, 3, 4, 1];  
    mapArr.push(tempMap);
    
    //MAP 1
    tempMap = new maps();
        tempMap.gift_x = 815;
        tempMap.gift_y = 545;  
        tempMap.gift_buffer_x = tempMap.gift_x-5;
        tempMap.gift_buffer_y = tempMap.gift_y-5;
        tempMap.MAP = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       1, 8, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1,
                       1, 9, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 3, 4, 1, 0, 1, 3, 1, 0, 0, 2, 4, 1,
                       1, 2, 0, 0, 0, 2, 0, 1, 2, 4, 0, 1, 3, 1, 0, 3, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1,
                       1, 1, 0, 3, 0, 0, 0, 1, 1, 1, 3, 1, 1, 0, 0, 1, 2, 0, 0, 1, 0, 2, 0, 0, 2, 0, 0, 1, 0, 1,
                       1, 1, 3, 1, 2, 3, 0, 0, 1, 1, 0, 0, 1, 2, 0, 0, 1, 2, 0, 1, 0, 0, 0, 4, 1, 0, 0, 0, 3, 1,
                       1, 1, 0, 0, 1, 0, 0, 4, 0, 0, 2, 0, 1, 0, 0, 4, 1, 0, 0, 1, 0, 3, 4, 1, 1, 2, 3, 4, 0, 1,
                       1, 0, 2, 0, 0, 0, 4, 0, 0, 0, 1, 3, 0, 2, 0, 1, 1, 2, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 3, 1, 
                       1, 0, 0, 0, 3, 4, 0, 2, 3, 0, 0, 1, 0, 1, 3, 1, 1, 1, 3, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 1,
                       1, 0, 0, 4, 1, 1, 0, 0, 1, 2, 0, 1, 2, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1,
                       1, 0, 4, 1, 1, 1, 0, 0, 0, 0, 3, 1, 0, 2, 0, 0, 0, 1, 1, 0, 3, 3, 0, 0, 0, 0, 0, 3, 0, 1,
                       1, 0, 0, 1, 0, 0, 2, 0, 3, 0, 1, 0, 3, 0, 0, 0, 4, 0, 0, 3, 0, 0, 0, 0, 3, 3, 4, 1, 3, 1,
                       1, 0, 4, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 4, 1, 2, 4, 0, 0, 3, 0, 4, 0, 1, 1, 1, 0, 1, 
                       1, 0, 0, 0, 3, 3, 0, 4, 1, 0, 0, 0, 3, 0, 4, 1, 1, 0, 1, 2, 0, 0, 0, 0, 3, 1, 0, 0, 3, 1,
                       1, 2, 3, 4, 1, 1, 0, 0, 0, 2, 0, 4, 1, 1, 1, 0, 0, 3, 0, 0, 2, 0, 0, 0, 1, 1, 2, 4, 1, 1, 
                       1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 1, 1, 1, 1,                       
                       1, 2, 3, 0, 1, 0, 2, 3, 4, 0, 0, 0, 2, 3, 0, 3, 0, 2, 3, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 1,
                       1, 1, 1, 3, 0, 3, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 4, 1,
                       1, 0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 3, 3, 3, 0, 0, 2, 0, 1, 1,                       
                       1, 2, 4, 1, 2, 3, 4, 1, 3, 1, 1, 2, 3, 3, 3, 4, 1, 1, 1, 2, 4, 1, 1, 1, 2, 4, 1, 3, 1, 1];
    mapArr.push(tempMap);
    
     //MAP 2
    tempMap = new maps();
        tempMap.gift_x = 785;
        tempMap.gift_y = 545;  
        tempMap.gift_buffer_x = tempMap.gift_x-5;
        tempMap.gift_buffer_y = tempMap.gift_y-5;
        tempMap.MAP = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1,                        
                       1, 0, 0, 3, 0, 3, 3, 3, 3, 3, 0, 0, 0, 3, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 2, 4, 1,
                       1, 0, 4, 1, 3, 1, 0, 0, 0, 1, 2, 3, 4, 1, 2, 3, 4, 0, 1, 0, 2, 3, 3, 4, 0, 2, 0, 0, 0, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 3, 0, 0, 0, 0, 0, 1, 2, 3, 0, 1,                          
                       1, 2, 0, 0, 1, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 3, 0, 4, 1, 0, 1, 0, 1,                       
                       1, 1, 2, 0, 0, 0, 0, 3, 3, 4, 1, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
                       1, 1, 1, 0, 0, 3, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 3, 4, 0, 0, 3, 3, 0, 3, 0, 0, 1, 0, 1,                       
                       1, 0, 0, 4, 0, 0, 0, 1, 0, 3, 0, 2, 0, 3, 0, 4, 0, 0, 0, 2, 0, 0, 0, 4, 0, 2, 0, 1, 0, 1,
                       1, 2, 0, 0, 0, 3, 0, 0, 3, 0, 0, 1, 3, 1, 3, 1, 0, 3, 4, 1, 2, 3, 0, 0, 0, 0, 3, 0, 0, 1,
                       1, 1, 2, 3, 0, 0, 2, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 2, 3, 0, 4, 1, 2, 0, 1,                       
                       1, 1, 0, 0, 2, 4, 1, 0, 1, 0, 4, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
                       1, 1, 2, 0, 1, 0, 0, 0, 0, 3, 1, 0, 1, 0, 0, 3, 0, 1, 1, 0, 4, 0, 0, 0, 4, 0, 2, 0, 4, 1,                       
                       1, 0, 1, 0, 1, 0, 3, 0, 0, 0, 1, 0, 1, 0, 2, 1, 3, 0, 0, 0, 0, 0, 3, 4, 0, 3, 0, 0, 0, 1,                       
                       1, 0, 0, 3, 0, 0, 1, 0, 3, 4, 0, 0, 1, 0, 0, 1, 1, 2, 0, 3, 0, 4, 0, 1, 0, 0, 2, 3, 0, 1,                       
                       1, 0, 4, 0, 0, 4, 0, 3, 0, 1, 0, 0, 0, 2, 0, 0, 1, 1, 0, 1, 0, 1, 3, 0, 0, 0, 0, 0, 0, 1, 
                       1, 0, 1, 0, 4, 1, 0, 0, 0, 1, 0, 3, 0, 1, 0, 4, 1, 1, 0, 1, 3, 1, 1, 2, 3, 3, 3, 0, 4, 1, 
                       1, 2, 0, 0, 0, 1, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 8, 1, 
                       1, 1, 2, 3, 0, 0, 0, 1, 2, 3, 3, 0, 0, 0, 0, 4, 1, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 2, 9, 1, 
                       1, 1, 1, 1, 2, 3, 4, 1, 1, 1, 1, 2, 3, 3, 4, 1, 1, 2, 4, 1, 2, 3, 3, 4, 1, 2, 4, 1, 4, 1];  
    mapArr.push(tempMap);    
        
    
    //MAP 3
    tempMap = new maps();
        tempMap.gift_x = 845;
        tempMap.gift_y = 35;  
        tempMap.gift_buffer_x = tempMap.gift_x-5;
        tempMap.gift_buffer_y = tempMap.gift_y-5;
        tempMap.MAP = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1,
                       1, 1, 0, 0, 0, 0, 4, 0, 2, 4, 0, 1, 0, 1, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 3, 0, 3, 4, 1,
                       1, 0, 2, 3, 0, 4, 1, 0, 1, 0, 0, 1, 3, 0, 3, 1, 3, 0, 3, 1, 2, 3, 0, 0, 4, 0, 0, 0, 0, 1,                       
                       1, 0, 1, 1, 0, 0, 0, 3, 0, 0, 4, 1, 1, 3, 0, 1, 0, 3, 0, 1, 1, 1, 0, 4, 1, 0, 3, 3, 4, 1,
                       1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 0, 3, 0, 3, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                       1, 3, 0, 0, 0, 3, 3, 0, 0, 3, 0, 0, 1, 1, 0, 3, 0, 3, 0, 0, 0, 0, 4, 1, 2, 0, 1, 2, 0, 1,
                       1, 0, 2, 0, 4, 0, 0, 0, 4, 1, 0, 0, 0, 0, 3, 1, 0, 1, 2, 0, 3, 0, 1, 1, 1, 0, 0, 0, 0, 1,                       
                       1, 0, 0, 3, 0, 2, 0, 4, 0, 1, 2, 0, 0, 4, 1, 1, 3, 1, 1, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 1,                       
                       1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 0, 3, 0, 0, 4, 0, 3, 1,
                       1, 2, 3, 0, 0, 0, 3, 4, 0, 0, 0, 1, 0, 0, 3, 0, 3, 3, 0, 0, 1, 1, 0, 0, 2, 4, 0, 3, 1, 1,                       
                       1, 0, 1, 0, 3, 4, 0, 0, 0, 3, 4, 0, 2, 4, 0, 3, 1, 1, 2, 0, 0, 0, 2, 0, 0, 0, 3, 1, 1, 1,                       
                       1, 3, 0, 0, 0, 1, 2, 0, 4, 1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 4, 0, 1, 0, 1,
                       1, 0, 2, 3, 0, 0, 0, 0, 0, 0, 3, 1, 2, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 3, 4, 1, 0, 1, 0, 1,                       
                       1, 0, 1, 1, 2, 0, 0, 0, 3, 4, 1, 0, 1, 0, 0, 3, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 3, 1, 0, 1,                       
                       1, 0, 1, 0, 0, 0, 3, 0, 1, 1, 1, 3, 0, 0, 4, 1, 2, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 1, 3, 1,
                       1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 1, 0, 1, 2, 0, 0, 0, 0, 0, 2, 0, 0, 4, 1, 1, 1,
                       1, 3, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 4, 1, 0, 8, 0, 1, 2, 0, 3, 3, 4, 1, 0, 4, 1, 1, 1, 1, 
                       1, 0, 0, 0, 3, 4, 1, 0, 4, 1, 0, 0, 0, 0, 0, 9, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 
                       1, 2, 3, 4, 1, 1, 1, 3, 1, 1, 2, 3, 3, 3, 3, 3, 4, 1, 2, 4, 1, 2, 4, 1, 3, 1, 1, 1, 3, 1];
    mapArr.push(tempMap);  
	
	//MAP 4
    tempMap = new maps();
        tempMap.gift_x = 35;
        tempMap.gift_y = 545;
        tempMap.gift_buffer_x = tempMap.gift_x-5;
        tempMap.gift_buffer_y = tempMap.gift_y-5;    
        tempMap.MAP = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 8, 1,
                       1, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 9, 1,
                       1, 0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 4, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
                       1, 2, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1,
                       1, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 0, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                       1, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 4, 1,
                       1, 0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 1, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
                       1, 2, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1,
                       1, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 0, 4, 1,
                       1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
                       1, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1,
                       1, 0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 4, 1,
                       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1,
                       1, 2, 3, 3, 3, 3, 3, 3, 3, 4, 0, 4, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1,
                       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 4, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 3, 1,
                       1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    mapArr.push(tempMap);
}

function snowflakes(spawnPoint){
    this.x = ((Math.random()*canvas.width)+0);
    this.y = spawnPoint;
    this.radius = Math.round((Math.random()*2)+1); // between 1 and 2 Randomly generated.
    this.transparency = ((Math.random()*1)+0);
    
    this.fallspeed = ((Math.random()*1)+0.5);
    
    this.draw = function(){                
        canvasContext.fillStyle = 'rgba(255,255,255,' + this.transparency + ')';
        canvasContext.beginPath();    
        canvasContext.arc(this.x,this.y, this.radius ,0,Math.PI*2, true);
        canvasContext.fill();
    }    
    this.move = function(){
        this.y += this.fallspeed; 
    }
}
var snowArray = []; //Containing snowflakes.

function addSnow(){
    for(var i = 0; i < 1000; i++){
        var tempSnowflake = new snowflakes(((Math.random()*canvas.width)+0));
        snowArray.push(tempSnowflake);
    }
}
function addSnowFromTop(){
    for(var i = 0; i < 1; i++){
        var tempSnowflake = new snowflakes(0);
        snowArray.push(tempSnowflake);
    }
}  
function drawSnow(){
    for(var i = 0; i < snowArray.length; i++)
        snowArray[i].draw();    
}
function moveSnow(){
    for(var i = 0; i < snowArray.length; i++)
        snowArray[i].move();    
    drawSnow();
}