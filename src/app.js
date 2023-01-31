import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { startPaymentProcess, checkTransaction } from "./bot/handlers/payment.js";
import handleStart from "./bot/handlers/start.js";

dotenv.config();

// 使機器人出現錯誤時不停止
async function runApp() {
    console.log('Starting app...')
    process.on('uncaughtException', function (exception) {
        console.log(exception)
    })
}

const bot = new Bot(process.env.BOT_TOKEN)
bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
bot.use(conversations());
bot.use(createConversation(startPaymentProcess));

bot.command("start", handleStart);
bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
});
bot.callbackQuery("check_transaction", checkTransaction);
await bot.init();
bot.start();
console.info(`Bot @${bot.botInfo.username} is up and running`);