Module.register("down-payment-saver", {
	accountBalance: 0,

	//override dom generator
	getDom: function () {
		let windowWidth = window.screen.width;
		let windowHeight = window.screen.height;

		let wrapper = document.createElement("div");
		let wrapperHeight = windowHeight / 2;
		let wrapperWidth = windowWidth;

		//wrapper.style.backgroundColor = "yellow";
		wrapper.height = this.n2px(wrapperHeight);
		wrapper.width = this.n2px(wrapperWidth);
		wrapper.style.minHeight = this.n2px(windowHeight / 2);
		wrapper.style.maxHeight = this.n2px(windowHeight / 2);

		let canv = this.createCanvas(wrapper, wrapperWidth, wrapperHeight);
		let context = canv.getContext("2d");

		let rectangle = this.drawBase(context, wrapperWidth, wrapperHeight);
		this.drawRoof(context, rectangle);
		this.drawBricks(context, rectangle, this.config.goal);

		wrapper.appendChild(canv);
		return wrapper;
	},

	start: function () {
		this.getAccountBalance();
	},

	getAccountBalance: function () {
		const url = "ally invest oauth information";
		this.sendSocketNotification("get_account_balance", url);
	},

	scheduleUpdate: function () {
		var self = this;
		// Refresh time should not be less than 5 minutes
		var delay = config.refreshTime;
		setInterval(function () {
			self.getAccountBalance();
		}, delay);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "account_balance") {
			this.accountBalance = payload.accountBalance;
			this.updateDom();
		}
	},

	//all drawing below
	createCanvas: function (wrapper, wrapperWidth, wrapperHeight) {
		let canv = document.createElement("canvas");
		canv.id = "down-payment-saver-canvas";

		//set height of canvas to match div
		canv.width = wrapperWidth;
		canv.height = wrapperHeight;
		canv.style.textAlign = "center";

		return canv;
	},

	drawBase: function (context, wrapperWidth, wrapperHeight) {
		context.beginPath();
		context.lineJoin = "round";

		let rectHeight = wrapperHeight / 2;
		let rectWidth = wrapperWidth / 4;

		context.rect(wrapperWidth / 2 - rectWidth / 2, wrapperHeight - rectHeight - 10, rectWidth, rectHeight);
		context.fillStyle = "white";
		context.strokeStyle = "white";
		context.lineWidth = 10;
		context.closePath();
		context.stroke();
		return {
			xLocation: wrapperWidth / 2 - rectWidth / 2,
			yLocation: wrapperHeight - rectHeight - 10,
			width: rectWidth,
			height: rectHeight
		};
	},

	drawRoof: function (context, rectangle) {
		let lineOffset = rectangle.width / 2;
		let roofOffset = rectangle.width / 10;
		let roofHeight = rectangle.height / 1.5;
		let lineSideOffset = rectangle.width / 27;
		let chimneyWidth = rectangle.width / 10;
		let chimneyHeight = rectangle.height / 8;

		//first line
		context.beginPath();
		context.lineJoin = "round";
		context.moveTo(rectangle.xLocation - roofOffset, rectangle.yLocation);
		context.lineTo(rectangle.xLocation + lineOffset, rectangle.yLocation - roofHeight);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation - roofOffset, rectangle.yLocation);
		context.lineTo(rectangle.xLocation - roofOffset + lineSideOffset, rectangle.yLocation + lineSideOffset);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation - roofOffset + lineSideOffset, rectangle.yLocation + lineSideOffset);
		context.lineTo(rectangle.xLocation, rectangle.yLocation);
		context.closePath();
		context.stroke();

		//second line
		context.beginPath();
		context.moveTo(rectangle.xLocation + lineOffset, rectangle.yLocation - roofHeight);
		context.lineTo(rectangle.xLocation + rectangle.width + roofOffset, rectangle.yLocation);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation + rectangle.width + roofOffset, rectangle.yLocation);
		context.lineTo(rectangle.xLocation + rectangle.width + roofOffset - lineSideOffset, rectangle.yLocation + lineSideOffset);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation + rectangle.width + roofOffset - lineSideOffset, rectangle.yLocation + lineSideOffset);
		context.lineTo(rectangle.xLocation + rectangle.width, rectangle.yLocation);
		context.closePath();
		context.stroke();

		//chimney
		context.beginPath();
		context.moveTo(rectangle.xLocation + rectangle.width * 0.7, rectangle.yLocation - roofHeight * 0.68);
		context.lineTo(rectangle.xLocation + rectangle.width * 0.7, rectangle.yLocation - roofHeight * 0.68 - chimneyHeight);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation + rectangle.width * 0.7, rectangle.yLocation - roofHeight * 0.68 - chimneyHeight);
		context.lineTo(rectangle.xLocation + rectangle.width * 0.7 + chimneyWidth, rectangle.yLocation - roofHeight * 0.68 - chimneyHeight);
		context.closePath();
		context.stroke();

		context.beginPath();
		context.moveTo(rectangle.xLocation + rectangle.width * 0.7 + chimneyWidth, rectangle.yLocation - roofHeight * 0.68 - chimneyHeight);
		context.lineTo(rectangle.xLocation + rectangle.width * 0.7 + chimneyWidth, rectangle.yLocation - roofHeight * 0.5);
		context.closePath();
		context.stroke();
	},

	drawBricks: function (context, rectangle, goal) {
		console.log("account balance", this.accountBalance);
		console.log("goal", goal);

		let oneBrick = goal / 100;
		let bricksDrawn = 0;
		let brickWidth = rectangle.width / 10;
		let brickHeight = rectangle.height / 10;
		let brickXLocation = rectangle.xLocation;
		let brickYLocation = rectangle.yLocation + rectangle.height - brickHeight;

		this.drawBrick(context, brickXLocation, brickYLocation, brickWidth, brickHeight);
		for (let i = 0; i < this.accountBalance; i += oneBrick) {
			if (i !== 0 && bricksDrawn % 10 === 0) {
				//move the row up
				brickYLocation -= brickHeight;
				brickXLocation = rectangle.xLocation;
			}
			this.drawBrick(context, brickXLocation, brickYLocation, brickWidth, brickHeight);
			bricksDrawn++;
			brickXLocation += brickWidth;
		}
	},

	drawBrick: function (context, xLocation, yLocation, width, height) {
		context.beginPath();

		context.rect(xLocation, yLocation, width, height);
		context.fillStyle = "black";
		//context.fillStyle = "#640e01";
		context.strokeStyle = "white";
		context.fill();
		context.lineWidth = 10;
		context.closePath();
		context.stroke();
	},

	//utility functions
	n2px: function (number) {
		let numberAsString = number.toString();
		return numberAsString + "px";
	}
});
