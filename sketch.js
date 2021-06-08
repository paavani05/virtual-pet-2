var dogImg, happyDogImg, dog, database, foodS, foodStock, button1, button2, fedTime, lastFed;
var foodObj;

function preload()
{
	dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  dog = createSprite(800,200);
  dog.addImage("dog", dogImg);
  dog.scale = 0.15;
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  feed = createButton("feed the dog");
  feed.position(700,65);
  feed.mousePressed(feedDog);

  addFood = createButton("add food");
  addFood.position(800, 65);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
}


function draw() { 
  background("green");
  foodObj.display();

  fedTime= database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("last fed : " + lastFed%12 + "PM", 150, 30)
  }
  else if(lastFed==0){
    text("last fed: 12 AM", 150, 30);
  }
  else{
    text("last fed: " + lastFed + "AM", 150, 30);
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    food:x
  })
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}
