const token = require("./token.json");
const pagination = require("discord.js-pagination");
const pref = require("./prefix.json");
const Discord = require("discord.js");
const paginationEmbed = require("discord.js-pagination");
const bot = new Discord.Client({disableEveryone: true});
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search")

bot.on("ready", async () => {
    console.log("csá nigger");
});

var megáll;

var loop = false;

var kihivottFegyver;
var kihivoFegyver;

var kihivoElet = 100;
var kihívottElet = 100;

let tag;
let kihivo;
var harc = false;

bot.on("message", async message => {
    //if(message.author.bot) return;



    if(message.content === pref.pref + " help"){
        const page1 = new Discord.MessageEmbed()
        .setColor("#ff00aa")
        .setTitle("Parancsok")
        .addFields(
            {name: pref.pref + " szia" , value: "Visszaköszönök.", inline: false},
            {name: pref.pref + " hány kg vagy?" , value: "Megmondom a súlyomat.", inline: false},
            {name: pref.pref + " mi a nevem?" , value: "Ha elfelejtenéd a neved megmondom neked.", inline: false},
            {name: pref.pref + " szólj be neki (tagelj valakit)" , value: "Beszólok annak akinek szeretnéd, de ehhez be kell tagelned.", inline: false},
            {name: pref.pref + " mi a képem?" , value: "Elküldöm a profil képedet.", inline: false}
            );
        const page2 = new Discord.MessageEmbed()
        .setColor("#ff00aa")
        .setTitle("Parancsok2")
        .addFields(
            {name: pref.pref + " üzenem neki [tag] <üzenet>" , value: "Akármit leírok neki amit szeretnéd.", inline: false},
            {name: pref.pref + " gif" , value: "Küldök egy random gifet.", inline: false},
            {name: pref.pref + " play {link/videó cím} (Ez még bugos basszalak meg)", value: "el éneklem neked ezt a csodás nótát.", inline: false},
            {name: pref.pref + " menj el", value: "Kilépek a szobából.", inline: false},
            {name: pref.pref + " ismételd", value: "Ismétlem az adott számot ami épp megy.", inline: false}
        )
        const pages = [page1, page2]
        const emoji = ['◀️', '▶️']
        paginationEmbed(message, pages, emoji)
        
    }

    if(message.content === pref.pref + " gif"){
        var gifek = ["https://tenor.com/view/kanyewest-yeahright-sarcastic-gif-3871153",
        "https://images-ext-2.discordapp.net/external/8Gcs9CK_kIwMfN1a7q6UwXTEeB5yPIAfYXdtiY9QvIE/https/media.discordapp.net/attachments/777326052674240542/807702355633897502/image0.gif",
        "https://media.discordapp.net/attachments/724342656448069652/836667356348153956/bede.gif",
        "https://tenor.com/view/china-man-gun-gif-18153983",
        "https://images-ext-2.discordapp.net/external/g1-jlALa2WyvlwUkliEuIbWa2gLwF1aAtwb9HmxR8YI/https/media.discordapp.net/attachments/625085205937389579/810206074493730836/LEAVING.gif",
        "https://tenor.com/view/gay-gay-bear-gay-bears-beard-men-kissing-gif-15928487",
        "https://tenor.com/view/kaboom-gif-20216746",
        "https://tenor.com/view/apes-car-swag-money-gif-20294812",
        "https://tenor.com/view/tyler1-black-nigga-iam-nigga-gif-15072650",
        "https://tenor.com/view/paul-sonati-middle-finger-flip-off-flipping-off-dirty-finger-gif-17840559",

    ]
    message.channel.send(gifek[randomSzam(0,gifek.length-1)])
    }

    if(message.content.startsWith(`${pref.pref} play`)){
        const args = message.content.split(' ');
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.channel.send("Lépj be egy hang csatornába!")
        if(args.length <= 2) return message.channel.send("Jólvan öcsi ez mind szép és jó, de ha nem írsz linket vagy zenecímet nem tudok neked énekelni sajnos.")

        const connection = await voiceChannel.join();
        const videoFinder = async (query) =>{
            const videoResult = await ytSearch(query);
            return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        var keres = "";
        for(var i = 2 ; i < args.length;i++){
            keres += " " + args[i];
        }
        const video = await videoFinder(keres);

        if(video){
            var ido
            var perc = 0;
            for (ido = video.duration.seconds; ido >= 60; ido -= 60){
                perc++;
            }
            message.channel.send(`***${video.title} ami ${perc} perc és ${ido-1} másodperc hosszú*** számot  ${message.author} kérte, had szóljon neki a nóta!`)
            function ujra(){
            clearTimeout(megáll);
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on("finish", () =>{
                if (loop === true){
                    ujra();
                }else{
                 megáll = setTimeout(function(){
                    voiceChannel.leave();
                }, 120000);
            }
                
            })
        }
        ujra()
        }else {
            message.channel.send("Nem találom sajnos. :tired_face:")
        }
    
    }

    if(message.content ===`${pref.pref} ismételd`){
        if(loop === false){
            loop = true;
            message.channel.send("Ismétlés bekapcsolva!")
        }else{
            loop = false
            message.channel.send("Ismétlés kikapcsolva!")
       }
    }

    if(message.content == `${pref.pref} menj el`){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel){ 
            return message.channel.send("Lépj már be valahova ember");
        }
        voiceChannel.leave()
        message.channel.send("Engem senki nem szeret :tired_face: ")
    }

    //visszaköszön
    if(message.content === pref.pref + " szia"){
        message.reply("szia");
    }
    //Súly megkérdezése
    if(message.content === pref.pref + " hány kg vagy?"){
        message.channel.send(randomSzam(70,120)+"kg");
    }
    
    if(message.content === pref.pref + " mi a nevem?"){
        message.channel.send(`A te neved kérem szépen: ${message.author}`)

    }
    if(message.content.startsWith(pref.pref + " szólj be neki")){
        const taggedUser = message.mentions.users.first();
        try {
            if(taggedUser.username === "Bence0928"){
                message.channel.send(`Sajnálom, de az alkotómnak nem szólok be, ellenben neked te büdös féreg ${message.author}`)
            }
            else{
            message.channel.send(`A kurva anyád ${taggedUser.username}!`); message.delete()
            }
        }
        catch(ex) {
            message.channel.send(`Neked szólok be, mert nem tageltél senkit a kurva anyádat ${message.author}`);
        }
    }

    if(message.content.startsWith(pref.pref + " harc")){
        if(harc === false){
            tag = message.mentions.users.first();
            kihivo = message.author;
            if(tag === kihivo){
                message.channel.send("Nem hívhatod ki saját magad!"); return;
            }
            if (tag !== undefined){
                message.channel.send(`${tag} kihívott téged ${kihivo} egy harcra, elfogadod? [!G harc igen/!G harc nem]`);
                if(message.author === tag && message.content == pref.pref + " harc igen"){
                    message.channel.send(`${tag} írd le a chatre a fegyvered`)
                    harc = true}
                }else if(message.author === tag && message.content == pref.pref + " harc nem"){
                    message.channel.send(`${tag} túl pina, hogy harcoljon.`)
                }
                
            else{message.channel.send("nem tageltél senkit a harchoz!")}
        }else{
            message.channel.send(`Sajnálom ${message.author}, de már folyamatban van egy harc`); return;
        }
    }
    
    if(harc === true){
        fight(tag, kihivo, message);
    }
    if(message.content === pref.pref + " mi a képem?"){
        message.channel.send(message.author.avatarURL())
    }

    if(message.content.startsWith(pref.pref + " üzenem neki")){
        try{
       const tag = message.mentions.users.first().id;
       message.delete();
       var küld = "";
       const üzenet = message.content.split(' ');
       for(var i = 4; i < üzenet.length;i++){
        küld += " " + üzenet[i];
       }
       
        bot.users.fetch(tag).then((user)=>{
            user.send(küld)
        })
    }
    catch(ex){
        message.reply("Sajnos nem tageltél senkit")
    }
    }



})



bot.on("message", function(message){
    if(message.author.bot) return;
    if(message.content.startsWith(pref.pref)){
        console.log(`Új üzenet tőle ${message.author.username}: ${message}`);
}
})

bot.login(token.token)

function fight(kihivott, kihivo, message){
        //kihivott
        if(message.author === kihivott && kihivottFegyver === undefined){
        kihivottFegyver = message.content;
        }
        //kihivo
        else if(message.author === kihivo && kihivoFegyver === undefined && kihivottFegyver !== undefined){
            message.channel.send(`${kihivo} írd le a chatre a fegyvered`)
            kihivoFegyver = message.content
        }
        else{
            message.channel.send(`${kihivott} fegyvere: ${kihivottFegyver}       ${kihivo} fegyvere: ${kihivoFegyver}`);
        }
        
    return
}

function randomSzam(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
