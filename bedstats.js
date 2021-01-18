const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({host: 'mc.hypixel.net', port: '25565', username: 'email_here', password: 'password_here'});
bot.once(`spawn`, () => {
    console.log('Bot is ready.');
});
const apiKey = 'hypixel_API_key_here';



const pattern = /\[*.*\]*has invited you to join .+ party!/i
bot.on(`message`, async (message) => {
    // Is it a party request?
    if(message.toString().match(pattern) != null){
        // break the message down and find the first name seen
        let theMatch = message.toString().match(pattern)[0];
        let i1 = theMatch.indexOf(' ', 0);
        theMatch = theMatch.substr(i1+1, theMatch.length-1);
        i1 = theMatch.indexOf(' ', 0);
        theMatch = theMatch.substr(0, i1);
        // join, send stats then leave
        bot.chat(`/p accept ${theMatch}`);
        sendStats(theMatch);
    }
});
/*
bot.on(`whisper`, async (user, message) => {
    gonna do stuff here later when I'm not muted
});
*/
function sendStats(name){
    const HTTPS = require('https');
    HTTPS.get(`https://api.hypixel.net/player?key=${apiKey}&name=${name}`, resp => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => {
                    let url = JSON.parse(data);
                    let fk = parseInt(url.player.stats.Bedwars.final_kills_bedwars);
                    let fd = parseInt(url.player.stats.Bedwars.final_deaths_bedwars);
                    let ratio = round(fk/fd, 2);
                    let howmanymore = Math.ceil(fd*(ratio+0.01))-fk;
                    bot.chat(`/pchat ${fk} ${fd} ${ratio} ${howmanymore}`);
                    setTimeout(()=>{bot.chat(`/p leave`);}, 250);
                });
    });
}
// This code is one big pile of dog shit lol
function round(ratio, precision){
    ratio*=Math.pow(10, precision);
    ratio = Math.floor(ratio);
    ratio/=Math.pow(10, precision);
    return ratio;
}
