// 开始、停止按钮
var beginbtn=document.getElementById('begin');
var stopbtn=document.getElementById('stop');
beginbtn.onclick=function  () {
	// alert('haha');
	cells=random_cellstate(cells)
	// drawBorders(cells);
	ac=setInterval('drawState(cells)',500);
}
stopbtn.onclick=function () {
	clearInterval(ac);
}

// ---------------------------------------

var canvas=document.getElementById('lifecanvas');
var ctx=canvas.getContext("2d");
CELL_WIDTH=10
CELL_HEIGHT=10
// 细胞的对象表示--类
function Cell (zuobiao) {
	this.oldstate=0;
	this.state=0;
	this.futurestate=0;
	this.zuobiao={x:zuobiao.x,y:zuobiao.y}
	this.width=CELL_WIDTH;
	this.height=CELL_WIDTH;
	// this.draw=function (ctx) {
	// 	// 将当前的状态赋值给旧状态，以给后续的细胞判断生命显示状态
	// 	// var state_pd=this.state;
	// 	// this.oldstate=this.state;
	// 	// 判断是否绘制前先观察周围细胞状态，赋值未来下一次的生命状态
	// 	var num=getCellLiveNum(this.zuobiao);
	// 	this.futurestate=getFutureState(num);
	// 	console.log('----this.futurestate:-------',this.futurestate);
	// 	// 从全局状态表中得到之前的生存状态，判断是否绘制。
	// 	// 如果状态为0,表示已经死亡，不绘制
	// 	if (!this.state) {
	// 		ctx.fillStyle='white';
	// 		ctx.fillRect(this.zuobiao.x,this.zuobiao.y,this.width,this.height);
	// 	}else{
	// 		var color=this.color();
	// 		ctx.fillStyle=color;
	// 		ctx.fillRect(this.zuobiao.x,this.zuobiao.y,this.width,this.height);			
	// 	}
	// };
	// 随机颜色，rgb值
	

	// 获取细胞生存环境活的细胞数字
	this.getCellLiveNum=function () {
		var thezuobiao=this.zuobiao;
		var NeighborZuoBiaos=getNeighborsZuoBiao(thezuobiao);
		var NeighborCells=getNeighborsCells(NeighborZuoBiaos);
		var cellsStates=[];
			// console.log("-----thizuobiao--------",thezuobiao);
		// console.log("-------------",NeighborCells);
		for (var i = 0; i < NeighborCells.length; i++) {
			// console.log("--",i,NeighborCells[i]);
			cellsStates.push(NeighborCells[i].state);
		};

		var num=0
		for (var i = 0; i < cellsStates.length; i++) {
			num=num+cellsStates[i];
		};		
		return num;
	}

	// 获取未来的状态
	this.refreshFutureState=function () {
		var num=this.getCellLiveNum();
		// 规则
		// 1  周围有3个细胞，生
		// 2  周围有2个细胞，保持之前的生存状态不变
		// 3  其他情况为死亡
		if (num==3) {
			this.futurestate=1;
			return;
		};
		if (num==2) {
			this.futurestate=this.state;
			return;
		};
		if (num!=2&&num!=3) {
			this.futurestate=0;
			return;
		};
		
	}

}


function MakeCells (canvas) {
	// 获得细胞坐标数组
	this.getZuoBiaos=function () {
		var zuobiaos=[];
		for (var i = 0; i < canvas.width/CELL_WIDTH; i++) {
			x=i*CELL_WIDTH;
			for (var j = 0; j < canvas.height/CELL_HEIGHT; j++) {
				y=j*CELL_WIDTH;
				zuobiaos.push({x:x,y:y});
			};
		};
		return zuobiaos;
	}

	// 获得坐标对象
	this.getCells=function() {
		var zuobiaos=this.getZuoBiaos();
		var cells=[]
		for (var i = 0; i < zuobiaos.length; i++) {
			var x=Cell(zuobiaos[i]);
			cells.push(new Cell(zuobiaos[i]));
		};
		return cells
	}
	
}



var cells =getCells();
// for (var i = 0; i < cells.length; i++) {
// 	console.log(cells[i].zuobiao.x,cells[i].zuobiao.y);
// };
// console.log(cells[38]);
// 画出图形
function drawState (cells) {
	for (var i = 0; i < cells.length; i++) {
		cells[i].draw(ctx);
	};
	// 循环一遍后，更新futurestate
	for (var i = 0; i < cells.length; i++) {
		cells[i].state=cells[i].futurestate;
	};
}

// 根据坐标，找到相应的细胞
function getCellFromCells (zuobiao) {
	// 此处为闭包，可以直接访问cells,避免传递变量到Cell类中
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].zuobiao.x==zuobiao.x &&cells[i].zuobiao.y==zuobiao.y ) {
			return cells[i];
		};
	};

}

// var g=getCellFromCells({x:0,y:0});
// alert(g);

// 画出细胞的边框
function drawBorders (cells) {
	for (var i = 0; i < cells.length; i++) {
		ctx.fillStyle='red';
		ctx.strokeRect(cells[i].zuobiao.x,cells[i].zuobiao.y,cells[i].width,cells[i].height);
		ctx.stroke();
	};
}
drawBorders(cells);
// 从一个坐标{x:0,y:0}得到邻居坐标
function getNeighborsZuoBiao (zuobiao) {
	var neighbors=[];
	x=zuobiao.x;
	y=zuobiao.y;
	// 一共8个
	// [x-20,x,x+20],[y-20,y,y+20]
	var xs=[x-CELL_WIDTH,x,x+CELL_WIDTH];
	var ys=[y-CELL_WIDTH,y,y+CELL_WIDTH];
	for (var i = 0; i < xs.length; i++) {
		for (var j = 0; j < ys.length; j++) {
			neighbors.push({x:xs[i],y:ys[j]});
		};
	};
	// console.log(neighbors);	

	// 在neighbors数组中去掉自己{x:x,y:y}。
	var n_neighbors=[];
	for (var i = 0; i < neighbors.length; i++) {
		if (neighbors[i].x==zuobiao.x && neighbors[i].y==zuobiao.y ) {
			continue;
		};
		n_neighbors.push(neighbors[i]);
	};
	neighbors=n_neighbors;
	clearN=[]
	// 去掉x,y<0 >600的坐标
	for (var i = 0; i < neighbors.length; i++) {
		if (neighbors[i].x<0||neighbors[i].x>=canvas.width||neighbors[i].y>=canvas.height||neighbors[i].y<0) {
			continue;
		};
		clearN.push(neighbors[i]);
	};

	return clearN; 
}


// 输入坐标数组，得到数组对应的细胞数组；
function getNeighborsCells(NeighborZuoBiaos) {
	var cells=[];
	for (var i = 0; i < NeighborZuoBiaos.length; i++) {
		var cell=getCellFromCells(NeighborZuoBiaos[i]);
		cells.push(cell);
	};
	return cells;
}




// ------------------------测试------------------------------------
function test_getNeighborsCells() {
	// x: 0, y: 580
	var res=getNeighborsZuoBiao({x:0,y:580});
	console.log(res);
	var res_cells=getNeighborsCells(res);
	console.log(res_cells);
	for (var i = 0; i < res_cells.length; i++) {
		console.log(res_cells[i].state);
	};
}

// test_getNeighborsCells();

// ---------------------------工具-----------------------
// 0-n的随机数
function getNum(n) {
	// n为随机数的上限。
	return Math.floor(Math.random() * ( n + 1));
}
// 随机颜色
function randomColor() {
	var color="rgb(R,G,B)".replace('R',getNum(255))
							.replace('G',getNum(255))
							.replace('B',getNum(255));
	return color
}
// 随机cell的状态
function random_cellstate(cells) {
	for (var i = 0; i < cells.length; i++) {
		var s=getNum(1);
		cells[i].state=s;
	};
	return cells
}
