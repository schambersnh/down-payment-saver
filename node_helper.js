var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
	start: function () {
		console.log("Down payment saver helper module loaded!");
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "get_account_balance") {
			this.getAccountBalance(payload);
		}
	},

	getAccountBalance: function (url) {
		const self = this;
		console.log("url", url);
		self.sendSocketNotification("account_balance", { accountBalance: 20000 });
	}
});
