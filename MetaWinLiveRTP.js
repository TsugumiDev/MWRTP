const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
const cron = require("node-cron");

const bot = new Telegraf("6815905414:AAFwUt45ssniGWu66xpjlBKHQrwBfSgnLnc");

// Replace 'API_ENDPOINT' with your actual API endpoint
const API_ENDPOINT = "https://api.prod.platform.metawin.com/game";
const YOUR_LINK = "https://metawin.com/t/0adcaacb";

bot.start((ctx) => ctx.reply("Welcome to your bot!"));

// Function to handle updates
const sendUpdates = async (ctx) => {
	try {
		// Fetch data from your API
		const response = await fetch(API_ENDPOINT);
		const responseData = await response.json();
		const games = responseData.items;

		// Filter games with liveRTP above 100
		const hotGames = games.filter((game) => game.liveRTP > 100);

		// Post updates for hot games
		hotGames.forEach((game) => {
			const message = `🔥 Hot Game Alert! 🔥\n\nName: ${game.name}\nRTP: ${game.rtp}%\nLive RTP: ${game.liveRTP}%\n\nPlay this slot now at: ${YOUR_LINK}`;

			// Post message with thumbnail as a photo
			ctx.telegram.sendPhoto("-1001998591453", game.thumbnail, {
				caption: message,
			});
		});

		if (hotGames.length === 0) {
			ctx.reply("No hot games found at the moment.");
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		ctx.reply("Error fetching data. Please try again later.");
	}
};

// Schedule the update task to run every hour (at minute 0)
cron.schedule("0 * * * *", () => sendUpdates(bot.context));

// Command handler for /liveRTP
bot.command("liveRTP", (ctx) => sendUpdates(ctx));

bot.launch();
