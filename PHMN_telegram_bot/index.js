import {Telegraf} from "telegraf";
import config from "config"
import CoinGecko from "coingecko-api"
import fetch from "node-fetch";
import base64 from 'base64-min';
const CoinGeckoClient = new CoinGecko();
const bot = new Telegraf(config.get('token'))
bot.use(Telegraf.log())
bot.launch()


bot.start((ctx) => ctx.reply('😊'))
let command_id_old = null
let command_id_old_info = null
let message_id_old = null
let message_id_old_info = null
const cyptobase = -1001183103754

bot.command('phmn', async (ctx)=>{
    if (ctx.chat.id === cyptobase){
        if(command_id_old){
            try{
            await ctx.deleteMessage(command_id_old)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase){
        if(message_id_old){
            try{
            await ctx.deleteMessage(message_id_old)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase) {
        command_id_old = ctx.message.message_id
    }
    const JunoData = await CoinGeckoClient.coins.fetch('juno-network', {});
    const JunoPrice = JunoData.data.market_data.current_price.usd;
    const JunoSwapData= await fetch('https://api-juno.nodes.guru/wasm/contract/juno1xkm8tmm7jlqdh8kua9y7wst8fwcxpdnk6gglndfckj6rsjg4xc5q8aaawn/state');
    const JunoSwap = await JunoSwapData.json();
    const LP_JUNO = await JunoSwap.result[2].value;
    const LP_PHMN = await JunoSwap.result[3].value;
    const PHMN = await base64.decode(LP_PHMN);
    const JUNO = await base64.decode(LP_JUNO);
    const PHMN_amount = await JSON.parse(PHMN);
    const JUNO_amount = await JSON.parse(JUNO);
    const PHMN_price = await JUNO_amount.reserve / PHMN_amount.reserve * JunoPrice;
    const PHMN_for_JUNO = await JUNO_amount.reserve / PHMN_amount.reserve;
    const Total_pool_liquidity = await (JUNO_amount.reserve * JunoPrice / 1000000)+(PHMN_amount.reserve / 1000000 * PHMN_price);
    const das_info = await fetch('https://api-juno.nodes.guru/wasm/contract/juno1jktfdt5g2d0fguvy8r8pl4gly7wps8phkwy08z6upc4nazkumrwq7lj0vn/state');
    const DAS = await das_info.json();
    const last_row_DAS = DAS.result[DAS.result.length - 1];
    const data_das = base64.decode(last_row_DAS.value)
    const lock_das_phmn = JSON.parse(data_das)
    console.log(lock_das_phmn)

    const {message_id} = await ctx.replyWithHTML(`<strong>Juno price:</strong> ${JunoPrice}$
<strong>PHMN price:</strong> ${PHMN_price.toFixed(2)}$
1 $PHMN  = ${PHMN_for_JUNO.toFixed(2)} $JUNO    
<strong>$PHMN/$JUNO pool:</strong> ${(PHMN_amount.reserve/1000000).toFixed(2)}/${(JUNO_amount.reserve/1000000).toFixed(2)}
<strong>Total pool liquidity:</strong> ${Total_pool_liquidity.toFixed(2)}$
<strong>PHMN lock in DAS: </strong> ${(lock_das_phmn / 1000000).toFixed(2)} <strong>$PHMN</strong>` )

    if (ctx.chat.id === cyptobase) {
        message_id_old = message_id
    }
});


bot.command('info', async (ctx) => {


    if (ctx.chat.id === cyptobase){
        if(message_id_old_info){
            try{
            await ctx.deleteMessage(message_id_old_info)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase){
        if(command_id_old_info){
            try{
            await ctx.deleteMessage(command_id_old_info)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase) {
        command_id_old_info = ctx.message.message_id
    }

    const {message_id} = await ctx.replyWithHTML("<strong>PHMN contract address:</strong> <code>juno1rws84uz7969aaa7pej303udhlkt3j9ca0l3egpcae98jwak9quzq8szn2l</code>")

    if (ctx.chat.id === cyptobase) {
        message_id_old_info = message_id
    }
})


