// 开始、停止按钮
var beginbtn=document.getElementById('begin');
var stopbtn=document.getElementById('stop');
beginbtn.onclick=function  () {
	// alert('haha');
	cells=random_cellstate(cells)
	ac=setInterval('drawState(cells)',500);
}
stopbtn.onclick=function () {
	clearInterval(ac);
}

var canvas=document.getElementById('lifecanvas');
var ctx=canvas.getContext("2d");
CELL_WIDTH=20
CELL_HEIGHT=20
function getNum(n) {
	// n为随机数的上限。
	return Math.floor(Math.random() * ( n + 1));
}
// 细胞的对象表示--类
function Cell (zuobiao) {
	this.oldstate=0;
	this.state=0;
	this.futurestate=0;
	this.zuobiao={x:zuobiao.x,y:zuobiao.y}
	this.width=20;
	this.height=20;
	this.draw=function (ctx) {
		// 将当前的状态赋值给旧状态，以给后续的细胞判断生命显示状态
		// var state_pd=this.state;
		// this.oldstate=this.state;
		// 判断是否绘制前先观察周围细胞状态，赋值未来下一次的生命状态
		var num=getCellLiveNum(this.zuobiao);
		this.futurestate=getFutureState(num);
		console.log('----this.futurestate:-------',this.futurestate);
		// 从全局状态表中得到之前的生存状态，判断是否绘制。
		// 如果状态为0,表示已经死亡，不绘制
		if (!this.state) {
			ctx.fillStyle='white';
			ctx.fillRect(this.zuobiao.x,this.zuobiao.y,this.width,this.height);
		}else{
			var color=this.color();
			ctx.fillStyle=color;
			ctx.fillRect(this.zuobiao.x,this.zuobiao.y,this.width,this.height);			

		}

	};
	// 随机颜色，rgb值
	this.color=function () {
		var color="rgb(R,G,B)".replace('R',getNum(255))
							.replace('G',getNum(255))
							.replace('B',getNum(255));
		return color
	}

	// 获取细胞生存环境活的细胞数字
	this.getCellLiveNum=function (thezuobiao) {
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
	this.getFutureState=function (num) {
		// 规则
		// 1  周围有3个细胞，生
		// 2  周围有2个细胞，保持之前的生存状态不变
		// 3  其他情况为死亡
		if (num==3) {
			return 1;
		};
		if (num==2) {
			return this.state;
		};
		return 0;
	}
}

// 获得细胞坐标数组
function getZuoBiaos () {
	var zuobiaos=[];
	for (var i = 0; i < 600/20; i++) {
		x=i*20;
		for (var j = 0; j < 600/20; j++) {
			y=j*20;
			zuobiaos.push({x:x,y:y});
		};
	};
	return zuobiaos;
}


// 获得坐标对象
function getCells () {
	var zuobiaos=getZuoBiaos();
	var cells=[]
	for (var i = 0; i < zuobiaos.length; i++) {
		var x=Cell(zuobiaos[i]);
		cells.push(new Cell(zuobiaos[i]));
	};
	return cells
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

// 产生部分活的细胞
function makeLiveCells () {
	
	
}

// 从一个坐标{x:0,y:0}得到邻居坐标
function getNeighborsZuoBiao (zuobiao) {
	var neighbors=[];
	x=zuobiao.x;
	y=zuobiao.y;
	// 一共8个
	// [x-20,x,x+20],[y-20,y,y+20]
	var xs=[x-20,x,x+20];
	var ys=[y-20,y,y+20];
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
		if (neighbors[i].x<0||neighbors[i].x>=600||neighbors[i].y>=600||neighbors[i].y<0) {
			continue;
		};
		clearN.push(neighbors[i]);
	};

	return clearN; 
}


// 输入坐标数组，得到细胞列表；
function getNeighborsCells(NeighborZuoBiaos) {
	var cells=[];
	for (var i = 0; i < NeighborZuoBiaos.length; i++) {
		var cell=getCellFromCells(NeighborZuoBiaos[i]);
		cells.push(cell);
	};
	return cells;
}

// 随机cell的状态
function random_cellstate(cells) {
	for (var i = 0; i < cells.length; i++) {
		var s=getNum(1);
		cells[i].state=s;
	};
	return cells
}




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


