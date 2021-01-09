const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({host: 'mc.hypixel.net', port: '25565', username: 'email here', password: 'password here'});
bot.once(`spawn`, () => {
    console.log('Bot is ready.');
});
const pattern = /\[*.*\]*has invited you to join .+ party!/i
const apiKey = 'hypixel api key here';
bot.on(`message`, async (message) => {
    if(message.toString().match(pattern) != null){
        let theMatch = message.toString().match(pattern)[0];
        console.log(theMatch);
        let i1 = theMatch.indexOf(' ', 0);
        theMatch = theMatch.substr(i1+1, theMatch.length-1);
        i1 = theMatch.indexOf(' ', 0);
        theMatch = theMatch.substr(0, i1);
        console.log(theMatch);
        if (theMatch === 'CoderGian' || theMatch === 'ArJx'){
            join(theMatch);
            sendStats(theMatch);
            setTimeout(leave, 1500);
        }
    }
});
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
                    let ratio = round(fk/fd);
                    let howmanymore = Math.ceil(fd*(ratio+0.01))-fk;
                    bot.chat(`/pchat ${fk} ${fd} ${ratio} ${howmanymore}`);
                });
    });
}
function round(ratio){
    ratio*=100;
    ratio = Math.floor(ratio);
    ratio/=100;
    return ratio;
}
function join(name){
    bot.chat(`/p accept ${name}`);
}
function leave(){
    bot.chat(`/p leave`);
}
