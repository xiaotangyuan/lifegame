// 动画刷新方法
// setInterval和setTimeout?

var canvas=document.getElementById('lifecanvas');
var ctx=canvas.getContext("2d");
CELL_WIDTH=20
CELL_HEIGHT=20
// 细胞的对象表示--类
function Cell (zuobiao) {
	this.state=0;
	this.zuobiao={x:zuobiao.x,y:zuobiao.y}
	this.width=20;
	this.height=20;
	this.draw=function (ctx) {
		var color=this.color();
		ctx.fillStyle=color;
		ctx.fillRect(this.zuobiao.x,this.zuobiao.y,this.width,this.height);
	};
	// 随机颜色，rgb值
	this.color=function () {
		function getNum(n) {
			// n为随机数的上限。
			return Math.floor(Math.random() * ( n + 1));
		}
		var color="rgb(R,G,B)".replace('R',getNum(255))
							.replace('G',getNum(255))
							.replace('B',getNum(255));
		return color
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

var zuobiaos=getZuoBiaos();
var cells=[]
for (var i = 0; i < zuobiaos.length; i++) {
	var x=Cell(zuobiaos[i]);
	cells.push(new Cell(zuobiaos[i]));
};

console.log(cells);

// 画出图形
for (var i = 0; i < cells.length; i++) {
	cells[i].draw(ctx);

};


// ctx.fillRect(0,0,10,10);
