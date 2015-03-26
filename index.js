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

// ---------------------------------------

var canvas=document.getElementById('lifecanvas');
var ctx=canvas.getContext("2d");
var CELL_WIDTH=10
var CELL_HEIGHT=10
// 产生细胞
var cells=new MakeCells(canvas).getCells();
// 让每个细胞获得自己的邻居细胞
setNeighbors(cells,canvas);

// 画出格子
draw_house();

// 方法定义：画出格子
function draw_house(){
	ctx.strokeStyle="gray";
	for (var i = 0; i < cells.length; i++) {
		var zb=cells[i].zuobiao;
		ctx.strokeRect(zb.x,zb.y,CELL_WIDTH,CELL_HEIGHT);
	};
}
// ctx.fillRect(107,105,200,200);




// 方法定义：让每个细胞获得自己的邻居细胞
function setNeighbors(cells,canvas) {
	var util=new UtilOfCells(cells,canvas);
	util.setNeighborsPerCell();
}


// 细胞的对象表示--类
function Cell (zuobiao) {
	this.oldstate=0;
	this.state=0;
	this.futurestate=0;
	this.zuobiao={x:zuobiao.x,y:zuobiao.y}
	this.width=CELL_WIDTH;
	this.height=CELL_WIDTH;
	this.neighborsOfCells=[];

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

	// 刷新未来的状态
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

// 产生细胞对象
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
		// 
		return cells
	}

}


// ------------测试MakeCells--------------------

function test_MakeCells(canvas) {
	// console.log('hhaa');
	var cells=new MakeCells(canvas).getCells();
	console.log(cells);
	for (var i = 0; i < cells.length; i++) {
		zb=cells[i].zuobiao;
		console.log(zb);
	};
}

// test_MakeCells(canvas);

// ---------------------------------------------

// 细胞工具，如：获取相邻细胞坐标。
function UtilOfCells (cells,canvas) {
	this.cells=cells;
	this.canvas=canvas;

	// 全局遍历cells,为每个cell赋值邻居细胞
	this.setNeighborsPerCell=function () {
		var cells=this.cells;
		for (var i = 0; i < cells.length; i++) {
			cells[i].neighborsOfCells.push(this.getNeighborsCells(cells[i]));
		};
	}

	// 让细胞获得相邻细胞的坐标数据
	this.getNeighborsCells=function (cell) {
		// console.log(cell.zuobiao);
		var newcells=[];
		var nzbs=this.getNeighborsZuoBiao(cell.zuobiao);
		// console.log('nzbs:',nzbs);

		for (var i = 0; i < nzbs.length; i++) {
			// console.log('nzbs[i].zuobiao:',nzbs[i]);
			newcells.push(this.getCellFromZuobiao(nzbs[i],this.cells));
		};
		return newcells;
	}

	// 根据坐标，找到相应的细胞
	this.getCellFromZuobiao=function (zuobiao,cells) {
		// console.log(zuobiao);
		for (var i = 0; i < cells.length; i++) {
			if (cells[i].zuobiao.x==zuobiao.x &&cells[i].zuobiao.y==zuobiao.y ) {
				return cells[i];
			};
		};
		console.loe("未找到该坐标相对应的细胞:",zuobiao);
		return "未找到该坐标相对应的细胞";
	}
	// 由坐标获得相邻坐标
	this.getNeighborsZuoBiao=function (zuobiao) {
		var neighbors=[];
		var x=zuobiao.x;
		var y=zuobiao.y;
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
		// 去掉x,y<0 >canvas的坐标
		for (var i = 0; i < neighbors.length; i++) {
			if (neighbors[i].x<0||neighbors[i].x>=this.canvas.width||neighbors[i].y>=this.canvas.height||neighbors[i].y<0) {
				continue;
			};
			clearN.push(neighbors[i]);
		};

		return clearN; 
	}
}

// -------------------------测试UtilOfCells------------------------------------
function test_UtilOfCells (cells,canvas) {

	var util=new UtilOfCells(cells,canvas);
	util.setNeighborsPerCell();
	for (var i = 0; i < cells.length; i++) {
		console.log(cells[i]);
	};
}

test_UtilOfCells(cells,canvas);













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
