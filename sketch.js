//Create variables here
var dog , food ; 
var foodStock;
var foodObj;


function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png");
  bgImg = loadImage("images/BgImage.jpg")

}

function setup() {
	createCanvas(700, 450);
  
  dog = createSprite(600,350);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  database = firebase.database();
  console.log(database);
  foodStockRef = database.ref('food');
  foodStockRef.on("value",readStock);
  
  feed=createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodObj = new Milk();

  feedTime = database.ref('FeedTime');
  feedTime.on("value", function(data){
    lastFed = data.val();
  })
}


function draw() { 
  background(bgImg);

  if(foodStock === 0){
    dog.addImage(dogImage);
  }
      
  drawSprites();
  textSize(18);
  fill("black");
  text("Food Remaining : " + foodStock, 50, 40);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }
     else if(lastFed===0){
       text("Last Feed : 12 AM" , 350,30);
  }
     else{
       text("Last Feed : "+ lastFed + " AM" , 350,30);
  }

}

function readStock(data){
  foodStock = data.val();

}
  
function writeStock(x){

  if(x <= 0){
    x = 0;
  }else{
    x = x - 1;
  }

  database.ref('/').update({
    food : x
  })
}

function feedDog(){
  dog.addImage(happyDogImage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    feedTime: hour()
  })
} 

function addFoods(){
  foodStock++;
  database.ref('/').update({
  food: foodStock
  })
}
