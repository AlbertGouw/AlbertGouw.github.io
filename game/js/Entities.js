
var player;
var enemyList = {};
var upgradeList = {};
var bulletList = {};

Player = function(){
	var self = Actor('player','myId',50,40,30,5,40,50,Img.player,1000,1);
	
	self.updatePosition = function(){
		if(self.pressingRight)
			self.x += 4;
		if(self.pressingLeft)
			self.x -= 4;	
		if(self.pressingDown)
			self.y += 4;	
		if(self.pressingUp)
			self.y -= 4;	
		
		//ispositionvalid
		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > WIDTH-self.width/2)
			self.x = WIDTH - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > HEIGHT - self.height/2)
			self.y = HEIGHT - self.height/2;
	}
	
	self.pressingDown = false;
	self.pressingUp = false;
	self.pressingLeft = false;
	self.pressingRight = false;
	return self;
	
}

Entity = function(type,id,x,y,spdX,spdY,width,height,img){
	var self = {
		type:type,
		id:id,
		x:x,
		y:y,
		spdX:spdX,
		spdY:spdY,
		width:width,
		height:height,
		img:img,
	};
	self.update = function(){
		self.updatePosition();
		self.draw();
	}
	self.draw = function(){
		ctx.save();
		var x = self.x-self.width/2;
		var y = self.y-self.height/2;
		ctx.drawImage(self.img,0,0,self.img.width,self.img.height,x,y,self.width,self.height);
		ctx.restore();
	}
	self.getDistance = function(entity2){	//return distance (number)
		var vx = self.x - entity2.x;
		var vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	}

	self.testCollision = function(entity2){	//return if colliding (true/false)
		var rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		}
		var rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		}
		return testCollisionRectRect(rect1,rect2);
		
	}
	self.updatePosition = function(){
		self.x += self.spdX;
		self.y += self.spdY;
				
		if(self.x < 0 || self.x > WIDTH){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > HEIGHT){
			self.spdY = -self.spdY;
		}
	}
	
	return self;
}

Actor = function(type,id,x,y,spdX,spdY,width,height,img,hp,atkSpd){
	var self = Entity(type,id,x,y,spdX,spdY,width,height,img ,hp);
	
	self.hp = hp;
	self.atkSpd = atkSpd;
	self.spdX = spdX;
	self.spdY = spdY;
	self.attackCounter = 0;
	self.aimAngle = 0;
	
	var super_update = self.update;
	self.update = function(){
		super_update();
	}
	
	return self;
}

Enemy = function(id,x,y,spdX,spdY,width,height){
	var self = Actor('enemy',id,x,y,spdX,spdY,width,height,Img.enemy,100,1);
	enemyList[id] = self;
}

randomlyGenerateEnemy = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*WIDTH;
	var y = Math.random()*HEIGHT;
	var height = 64;	//between 10 and 40
	var width = 64;
	var id = Math.random();
	var spdX = 2 + Math.random() * 3;
	var spdY = 2 + Math.random() * 3;
	Enemy(id,x,y,spdX,spdY,width,height);
	
}

Upgrade = function (id,x,y,spdX,spdY,width,height,category,img){
	var self = Entity('upgrade',id,x,y,spdX,spdY,width,height,img);
	
	self.category = category;
	upgradeList[id] = self;
}

randomlyGenerateUpgrade = function(){
	//Math.random() returns a number between 0 and 1
	var x = Math.random()*WIDTH;
	var y = Math.random()*HEIGHT;
	var height = 10;
	var width = 10;
	var id = Math.random();
	var spdX = 0;
	var spdY = 0;
	
	if(Math.random()<0.67){
		var category = 'health';
		var img = Img.upgrade1;
	} else {
		var category = 'traps';
		var img = Img.bullet;
	}
	
	Upgrade(id,x,y,spdX,spdY,width,height,category,img);
}



