const qrcode = require("qrcode-terminal");
const moment = require("moment");
const cheerio = require("cheerio");
const get = require('got')
const fs = require("fs");
const dl = require("./lib/downloadImage.js");
const fetch = require('node-fetch');
const urlencode = require("urlencode");
const axios = require("axios");
const imageToBase64 = require('image-to-base64');
const menu = require("./lib/menu.js");
const donate = require("./lib/donate.js");
const info = require("./lib/info.js");
const readTextInImage = require('./lib/ocr');
const speed = require('performance-now');
//
const BotName = 'Chopper'; // Nama Bot Whatsapp
const instagramlu = 'https://instagram.com/serenyemnyem'; // Nama Instagramlu cok
const whatsapplu = '085779386736'; // Nomor whatsapplu cok
const kapanbotaktif = '19.30-23.00'; // Kapan bot lu aktif
const grupch1 = 'https://chat.whatsapp.com/FPveeKtkbNaGo2BfPC5hcx'; // OFFICIAL GRUP LU 1
const grupch2 = 'https://chat.whatsapp.com/KOLxngyc6EeC9a4Rp84sC6'; // OFFICIAL GRUP LU 2
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
             + 'VERSION:3.0\n'
             + 'FN:Syahfa Ganss\n' // full name
             + 'ORG:ig : @serenyemnyem;\n' // the organization of the contact
             + 'TEL;type=CELL;type=VOICE;waid=6285779386736:+62 857-7938-6736\n' // WhatsApp ID + phone number
             + 'END:VCARD'
//
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
   GroupSettingChange,
   mentionedJid,
   processTime,
} = require("@adiwajshing/baileys");
var jam = moment().format("HH:mm");

function foreach(arr, func)
{
   for (var i in arr)
   {
      func(i, arr[i]);
   }
}
const conn = new WAConnection()
conn.on('qr', qr =>
{
   qrcode.generate(qr,
   {
      small: true
   });
   console.log(`[ ${moment().format("HH:mm:ss")} ] Scan cok`);
});

conn.on('credentials-updated', () =>
{
   // save credentials whenever updated
   console.log(`credentials updated!`)
   const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
// uncomment the following line to proxy the connection; some random proxy I got off of: https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
conn.connect();

conn.on('user-presence-update', json => console.log(`[ ${moment().format("HH:mm:ss")} ] =>  recode by: @serenyemnyem`))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
   console.log(`[ ${moment().format("HH:mm:ss")} ] =>  recode by: @serenyemnyem`)
})

conn.on('message-new', async(m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   let id = m.key.remoteJid
   const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
   let imageMessage = m.message.imageMessage;
   console.log(`[ ${moment().format("HH:mm:ss")} ] => Nomor: [ ${id.split("@s.whatsapp.net")[0]} ] => ${text}`);


// Groups

if (text.includes(">buatgrup"))
   {
var nama = text.split(">buatgrup")[1].split("-nomor")[0];
var nom = text.split("-nomor")[1];
var numArray = nom.split(",");
for ( var i = 0; i < numArray.length; i++ ) {
    numArray[i] = numArray[i] +"@s.whatsapp.net";
}
var str = numArray.join("");
console.log(str)
const group = await conn.groupCreate (nama, str)
console.log ("created group with id: " + group.gid)
conn.sendMessage(group.gid, "hello everyone", MessageType.extendedText) // say hello to everyone on the group

}

// FF
if(text.includes(">ceknomor")){
var num = text.replace(/>ceknomor/ , "")
var idn = num.replace("0","+62");

console.log(id);
const gg = idn+'@s.whatsapp.net'

const exists = await conn.isOnWhatsApp (gg)
console.log(exists);
conn.sendMessage(id ,`${gg} ${exists ? " exists " : " does not exist"} on WhatsApp`, MessageType.text)
}

if (text.includes(">say")){
  const teks = text.replace(/>say /, "")
conn.sendMessage(id, teks, MessageType.text, { quoted: m })
}

if (text.includes('>nulis')){
  var teks = text.replace(/>nulis /, '')
    axios.get('https://bangandre.herokuapp.com/nulis?teks='+teks)
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, 'Chopper Sedang Menulis..', MessageType.text, { quoted: m })
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'Capek Anjip', quoted: m })
        })
    })
}
if (text.includes('>ytmp3')){
  var teks = text.replace(/>ytmp3 /, '')
    axios.get('https://st4rz.herokuapp.com/api/yta2?url='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then(
          (ress) => {
          let hasil = `Audio telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n👇👇👇👇👇👇👇👇👇\n\nJudul : ${res.data.title}\n\nLink: ${res.data.result}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
if (text.includes('>ytmp4')){
  var teks = text.replace(/>ytmp4 /, '')
    axios.get('https://st4rz.herokuapp.com/api/ytv2?url='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then(
          (ress) => {
          let hasil = `Video telah tersedia pada link di bawah, silahkan klik link dan download hasilnya\n👇👇👇👇👇👇👇👇👇\n\nJudul : ${res.data.title}\n\nLink: ${res.data.result}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}

if (text == '>menu'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, menu.menu(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
if (text == '>help'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, menu.menu(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>quran'){
axios.get('https://api.banghasan.com/quran/format/json/acak').then((res) => {
    const sr = /{(.*?)}/gi;
    const hs = res.data.acak.id.ayat;
    const ket = `${hs}`.replace(sr, '');
    let hasil = `[${ket}]   ${res.data.acak.ar.teks}\n\n${res.data.acak.id.teks}(QS.${res.data.surat.nama}, Ayat ${ket})`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('assalamualaikum')){
conn.sendMessage(id, ' _waalaikumsalam, _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('bot')){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Bot')){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == '!help'){
conn.sendMessage(id, ' *_>help_* bukan ~!help~' ,MessageType.text, { quoted: m });
}
else if (text == '!menu'){
conn.sendMessage(id, ' *_>help_* bukan ~!menu~' ,MessageType.text, { quoted: m });
}
else if (text == '#help'){
conn.sendMessage(id, ' *_>help_* bukan ~#help~' ,MessageType.text, { quoted: m });
}
else if (text == '#menu'){
conn.sendMessage(id, ' *_>help_* bukan ~#menu~' ,MessageType.text, { quoted: m });
}
else if (text == ':help'){
conn.sendMessage(id, ' *_>help_* bukan ~:help~' ,MessageType.text, { quoted: m });
}
else if (text == ':menu'){
conn.sendMessage(id, ' *_>help_* bukan ~:menu~' ,MessageType.text, { quoted: m });
}
else if (text == '.help'){
conn.sendMessage(id, ' *_>help_* bukan ~.help~' ,MessageType.text, { quoted: m });
}
else if (text == '.menu'){
conn.sendMessage(id, ' *_>help_* bukan ~.menu~' ,MessageType.text, { quoted: m });
}
else if (text == '-help'){
conn.sendMessage(id, ' *_>help_* bukan ~-help~' ,MessageType.text, { quoted: m });
}
else if (text == '-menu'){
conn.sendMessage(id, ' *_>help_* bukan ~-menu~' ,MessageType.text, { quoted: m });
}
else if (text == '$help'){
conn.sendMessage(id, ' *_>help_* bukan ~$help~' ,MessageType.text, { quoted: m });
}
else if (text == '$menu'){
conn.sendMessage(id, ' *_>help_* bukan ~$menu~' ,MessageType.text, { quoted: m });
}
else if (text == '=help'){
conn.sendMessage(id, ' *_>help_* bukan ~=help~' ,MessageType.text, { quoted: m });
}
else if (text == '=menu'){
conn.sendMessage(id, ' *_>help_* bukan ~=menu~' ,MessageType.text, { quoted: m });
}
else if (text == '&help'){
conn.sendMessage(id, ' *_>help_* bukan ~&help~' ,MessageType.text, { quoted: m });
}
else if (text == '&menu'){
conn.sendMessage(id, ' *_>help_* bukan ~&menu~' ,MessageType.text, { quoted: m });
}
else if (text == '~help'){
conn.sendMessage(id, ' *_>help_* bukan ~~help~' ,MessageType.text, { quoted: m });
}
else if (text == '~menu'){
conn.sendMessage(id, ' *_>help_* bukan ~~menu~' ,MessageType.text, { quoted: m });
}
if (text.includes('salam')){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m});
}
else if (text == 'asalamualaikum'){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Assalamualaikum')){
conn.sendMessage(id, ' _Waalaikumsalam, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'p'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'P'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == '>iklan'){
conn.sendMessage(id, '📺 *IKLAN* : *INSTAGRAM: @serenyemnyem*\n\n♨️ GROUP NGOBROL [1] : https://chat.whatsapp.com/FPveeKtkbNaGo2BfPC5hcx\n\n😭 MERENUNG: https://www.instagram.com/p/CCd6JSRJtNr/?igshid=1bb1pivqzs8yt\n\n♻️ Mau pasang iklan di *Choper?*\n\n☎️ WA : *085779386736*' ,MessageType.text, { quoted: m });
}
else if (text == '>Iklan'){
conn.sendMessage(id, '📺 *IKLAN* : *INSTAGRAM: @serenyemnyem*\n\n♨️ GROUP NGOBROL [1] : https://chat.whatsapp.com/FPveeKtkbNaGo2BfPC5hcx\n\n😭 MERENUNG: https://www.instagram.com/p/CCd6JSRJtNr/?igshid=1bb1pivqzs8yt\n\n♻️ Mau pasang iklan di *Choper?*\n\n☎️ WA : *085779386736*' ,MessageType.text, { quoted: m });
}
else if (text == 'Halo'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Asu')){
conn.sendMessage(id, 'LU ASU' ,MessageType.text, { quoted: m });
}
else if (text == '>ownerbot'){
conn.sendMessage(id, ' *Owner Choper wa.me/+6285779386736* ' ,MessageType.text, { quoted: m });
}
else if (text == '>help'){
conn.sendMessage(id, ' *Menampilkan Pilihan Menu!!!* ' ,MessageType.text, { quoted: m });
}
else if (text == '>info'){
conn.sendMessage(id, ' *Menampilkan Info!!!* ' ,MessageType.text, { quoted: m });
}
else if (text == '>donasi'){
conn.sendMessage(id, ' *Menampilkan Donasi!!!* ' ,MessageType.text, { quoted: m });
}
if (text.includes('Pagi')){
conn.sendMessage(id, ' _Pagi juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Siang')){
conn.sendMessage(id, ' _Siang juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Sore')){
conn.sendMessage(id, ' _Sore juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Malam')){
conn.sendMessage(id, ' _Malam juga, Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
//ngentod
if (text.includes('Ngentod')){
conn.sendMessage(id, 'NANTI DI BERSETUBUH KELUAR AIR MATA😭' ,MessageType.text, { quoted: m });
}
if (text.includes('ngentod')){
conn.sendMessage(id, 'NANTI DI BERSETUBUH KELUAR AIR MATA😭' ,MessageType.text, { quoted: m });
}
if (text.includes('Ngentd')){
conn.sendMessage(id, 'NANTI DI BERSETUBUH KELUAR AIR MATA😭' ,MessageType.text, { quoted: m });
}
if (text.includes('ngentd')){
conn.sendMessage(id, 'NANTI DI BERSETUBUH KELUAR AIR MATA😭' ,MessageType.text, { quoted: m });
}
//anjing
if (text.includes('Anjing')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
if (text.includes('anjing')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
if (text.includes('Ajg')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
if (text.includes('ajg')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
if (text.includes('Anjg')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
if (text.includes('anjg')){
conn.sendMessage(id, 'NGOK NGOK🐽' ,MessageType.text, { quoted: m });
}
//bacot
if (text.includes('Bacot')){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
if (text.includes('bacot')){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
if (text.includes('bacod')){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
if (text.includes('Bacod')){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
else if (text == 'Bct'){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
else if (text == 'bct'){
conn.sendMessage(id, 'APA!!?, GAK SENENG?' ,MessageType.text, { quoted: m });
}
//TOXIC
if (text.includes('asu')){
conn.sendMessage(id, 'Lu Kaya Bebek' ,MessageType.text, { quoted: m });
}
if (text.includes('Bajingan')){
conn.sendMessage(id, 'TOXIC TERDETEKSI (BAJINGAN)' ,MessageType.text, { quoted: m });
}
if (text.includes('bajingan')){
conn.sendMessage(id, 'TOXIC TERDETEKSI (BAJINGAN)' ,MessageType.text, { quoted: m });
}
if (text.includes('Jembot')){
conn.sendMessage(id, 'Aku Sih Lebih Doyan Jenggot' ,MessageType.text, { quoted: m });
}
if (text.includes('jembot')){
conn.sendMessage(id, 'Aku Sih Lebih Doyan Jenggot' ,MessageType.text, { quoted: m });
}
if (text.includes('Kntl')){
conn.sendMessage(id, 'apasih Bacot lu, ANJING, KONTOL MEMEK, JEMBOT' ,MessageType.text, { quoted: m });
}
if (text.includes('kntl')){
conn.sendMessage(id, 'apasih Bacot lu, ANJING, KONTOL MEMEK, JEMBOT' ,MessageType.text, { quoted: m });
}
if (text.includes('kontol')){
conn.sendMessage(id, 'apasih Bacot lu, ANJING, KONTOL MEMEK, JEMBOT' ,MessageType.text, { quoted: m });
}
if (text.includes('Kontol')){
conn.sendMessage(id, 'apasih Bacot lu, ANJING, KONTOL MEMEK, JEMBOT' ,MessageType.text, { quoted: m });
}
if (text.includes('Test')){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('test')){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Hai'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'hai'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Woi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'woi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Eoy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'eoy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Hi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'hi'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Gan'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Sis'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Bro'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Min'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
if (text.includes('Sayang')){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'I love u'){
conn.sendMessage(id, ' _love you too😻_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Mas'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Mba'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Bre'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Cuy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Euy'){
conn.sendMessage(id, ' _Iyah aku disini kak...ada yang bisa kami bantu? Ketik *>help* untuk melihat fitur bot kami🙏_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'makasi'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Makasi'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'makasih'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Makasih'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'thank'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Thank'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'thanks'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == 'Thanks'){
conn.sendMessage(id, ' _Sama sama, semoga harimu menyenangkan :)_ ' ,MessageType.text, { quoted: m });
}
else if (text == '>donate'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>donasi'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>DONATE'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>DONASI'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, donate.donate(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>info'){
var date = new Date();
var tahun = date.getFullYear();
var bulan = date.getMonth();
var tanggal = date.getDate();
var hari = date.getDay();
var jam = date.getHours();
var menit = date.getMinutes();
var detik = date.getSeconds();
switch(hari) {
 case 0: hari = "Minggu"; break;
 case 1: hari = "Senin"; break;
 case 2: hari = "Selasa"; break;
 case 3: hari = "Rabu"; break;
 case 4: hari = "Kamis"; break;
 case 5: hari = "Jum'at"; break;
 case 6: hari = "Sabtu"; break;
}
switch(bulan) {
 case 0: bulan = "Januari"; break;
 case 1: bulan = "Februari"; break;
 case 2: bulan = "Maret"; break;
 case 3: bulan = "April"; break;
 case 4: bulan = "Mei"; break;
 case 5: bulan = "Juni"; break;
 case 6: bulan = "Juli"; break;
 case 7: bulan = "Agustus"; break;
 case 8: bulan = "September"; break;
 case 9: bulan = "Oktober"; break;
 case 10: bulan = "November"; break;
 case 11: bulan = "Desember"; break;
}
var tampilTanggal = "TANGGAL: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
var tampilWaktu = "JAM: " + jam + ":" + menit + ":" + detik;
conn.sendMessage(id, info.info(id, BotName, tampilTanggal, tampilWaktu, instagramlu, whatsapplu, kapanbotaktif, grupch1, grupch2) ,MessageType.text, { quoted: m });
}
else if (text == '>p'){
conn.sendMessage(id, 'kirim >p cewek/cowok\n\nContoh: >p cewek' ,MessageType.text, { quoted: m });
}
   if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '>sticker')
      {
         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '.webp', (error, stdout, stderr) =>
         {
         
        conn.sendMessage(id, 'Bentar, Lagi Di Proses!!!', MessageType.text, { quoted: m })
         
            let stik = fs.readFileSync('temp/' + jam + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker, { quoted: m })
         });
      }
   }
   if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '>stiker')
      {
         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '.webp', (error, stdout, stderr) =>
         {
          
          conn.sendMessage(id, 'Bentar, Lagi Di Proses!!!', MessageType.text, { quoted: m })
         
            let stik = fs.readFileSync('temp/' + jam + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker, { quoted: m })
         });
      }
   }

   if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == '>pantun')
      {

         fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            .then(res => res.text())
            .then(body =>
            {
               let tod = body.split("\n");
               let pjr = tod[Math.floor(Math.random() * tod.length)];
               let pantun = pjr.replace(/pjrx-line/g, "\n");
               conn.sendMessage(id, pantun, MessageType.text, { quoted: m })
            });
      }

    };
      if (text.includes(">covidID"))
   {
const get = require('got')
    const body = await get.post('https://api.kawalcorona.com/indonesia', {

    }).json();
    var positif = (body[0]['positif']);
    var sembuh  = (body[0]['sembuh']);
    var meninggal = (body[0]['meninggal']);
    var dirawat = (body[0]['dirawat']);
    console.log(body[0]['name'])
    conn.sendMessage(id,`DATA WABAH COVID-19 TERBARU DI INDONESIA\n\n🔰Positif ➸  ${positif} \n🔰Sembuh ➸  ${sembuh} \n🔰Meninggal ➸  ${meninggal}\n🔰Dirawat ➸  ${dirawat}`, MessageType.text, { quoted: m });
}
   if (text.includes(">quotes"))
   {
      var url = 'https://jagokata.com/kata-bijak/acak.html'
      axios.get(url)
         .then((result) =>
         {
            let $ = cheerio.load(result.data);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
            var kata = $('q[class="fbquote"]').contents().first().text();

            conn.sendMessage(
               id,
               `
      
     _${kata}_
        
    
	*~${author}*
         `, MessageType.text, { quoted: m}
            );

         });
     }
        else if (text.includes(">artinama ")) 
  {
    const cheerio = require('cheerio');
    const request = require('request');
    var nama = text.split(">artinama ")[1];
    var req = nama.replace(/ /g,"+");
    request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
      },function(error, response, body){
          let $ = cheerio.load(body);
          var y = $.html().split('arti:')[1];
          var t = y.split('method="get">')[1];
          var f = y.replace(t ," ");
          var x = f.replace(/<br\s*[\/]?>/gi, "\n");
          var h  = x.replace(/<[^>]*>?/gm, '');
      console.log(""+ h);
      conn.sendMessage(id,
            `
     

  
         Nama _*${nama}*_ ${h}
 

`,
 MessageType.text, { quoted: m });
  });
  }
  else if (text.includes(">pasangan ")) {
    const request = require('request');
    var gh = text.split(">pasangan ")[1];
    var namamu = gh.split("&")[0];
    var pasangan = gh.split("&")[1];
    request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     'http://www.primbon.com/kecocokan_nama_pasangan.php?nama1='+ namamu +'&nama2='+ pasangan +'&proses=+Submit%21+',

    },function(error, response, body){
        let $ = cheerio.load(body);
      var y = $.html().split('<b>KECOCOKAN JODOH BERDASARKAN NAMA PASANGAN</b><br><br>')[1];
        var t = y.split('.<br><br>')[1];
        var f = y.replace(t ," ");
        var x = f.replace(/<br\s*[\/]?>/gi, "\n");
        var h  = x.replace(/<[^>]*>?/gm, '');
        var d = h.replace("&amp;", '&')
      console.log(""+ d);
      conn.sendMessage(id, `


 *Kecocokan berdasarkan nama*


 ${d}



    `, MessageType.text, { quoted: m });
      });
  }
    if (text.includes(">p cewek"))
   {
    var items = ["ullzang girl", "korean girl", "cewe thailand", "chines girl"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'halo❤️',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
    if (text.includes(">kucing"))
   {
    var items = ["kucing imut", "kucing"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'halo❤️',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
    if (text.includes(">p ukhti"))
   {
    var items = ["hijab cantik", "cewek jilboobs"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Hai, xixixi',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
     if (text.includes(">cosplay"))
   {
    var items = ["cosplayer cantik", "cosplay sexy", "cosplay"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Kojujin Sama😍',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

   if (text.includes(">p cowok"))
   {
    var items = ["cowo ganteng", "cogan", "korean boy", "chinese boy", "japan boy"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
  var buf = Buffer.from(response, 'base64'); // Ta-da 
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Yoo😎',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes(">randomanime"))
   {
    var items = ["anime girl", "anime neko", "anime outoko", "anime aesthetic"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Random Nimex', quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes(">scdl")){
const fs = require("fs");
const scdl = require("./lib/scdl");
scdl.setClientID("iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX");
scdl("https://m.soundcloud.com/abdul-muttaqin-701361735/lucid-dreams-gustixa-ft-vict-molina")
    .pipe(fs.createWriteStream("mp3/song.mp3"));
}
 else if (text.includes(">tts")) {
  var teks = text.split(">ttsid ")[1];
  var path = require('path');
  var text1 = teks.slice(6);
  text1 = suara;
  var suara = text.replace(/>ttsid/g, text1);
  var filepath = 'mp3/bacot.wav';
  
  
/*
 * save audio file
 */

gtts.save(filepath, suara, function() {
  console.log(`${filepath} MP3 SAVED=`)
});
await new Promise(resolve => setTimeout(resolve, 500));

	if(suara.length > 200){ // check longness of text, because otherways google translate will give me a empty file
  conn.sendMessage("Text kepanjangan bro!")
}else{

const buffer = fs.readFileSync(filepath)
	conn.sendMessage(id , buffer , MessageType.audio);

};
}
if (text.includes(">lirik")){
	const teks = text.replace(/>lirik /, "")
	axios.get(`https://arugaz.herokuapp.com/api/lirik?judul=${teks}`).then ((res) => {
	     conn.sendMessage(id, 'Bentar, Lagi Di Proses!!!', MessageType.text)
	 	let hasil = ` *🎧Lirik🎧 Lagu ${teks}:* \n\n\n _${res.data.result}_ `
	conn.sendMessage(id, hasil, MessageType.text, { quoted: m })
	})
}
if (text.includes('>alay')){
	const teks = text.replace(/>alay /, "")
	axios.get(`https://arugaz.herokuapp.com/api/bapakfont?kata=${teks}`).then ((res) =>
		{ let hasil = `${res.data.result}`
		conn.sendMessage(id, hasil, MessageType.text, { quoted: m })
	})
}
if (text.includes('>ssweb')){
  var teks = text.replace(/>ssweb /, '')
    axios.get('https://mnazria.herokuapp.com/api/screenshotweb?url='+teks)
    .then((res) => {
      imageToBase64(res.data.gambar)
        .then((ress) => {
            conn.sendMessage(id, '[❗] SEDANG Diproses MENANGKAP LAYAR', MessageType.text, { quoted: m })
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}   
     if (text.includes('>wikiID')){
const teks = text.replace(/>wikiID /, "")
axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
    let hasil = `*Pertanyaan: ${teks}*\n\nJawaban: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>spamcall')){
const teks = text.replace(/>spamcall /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamcall?no=${teks}`).then((res) => {
    let hasil = `${res.data.logs}\n${res.data.msg}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>wikiEN')){
const teks = text.replace(/>wikiEN /, "")
axios.get(`https://arugaz.herokuapp.com/api/wikien?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
    let hasil = `*Question: ${teks}*\n\nAnswer: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
 if (text.includes('>spamgmail')){
const teks = text.replace(/>spamgmail /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamgmail?target=${teks}&jum=1`).then((res) => {
    let hasil = `${res.data.logs}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}   
   if (text.includes('>spamsms')){
const teks = text.replace(/>spamsms /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamsms?no=${teks}&jum=1`).then((res) => {
    let hasil = `${res.data.logs}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
} 

  if (text.includes('>checkip'))
  { const teks = text.replace(/>checkip /, "") 
  axios.get(`https://mnazria.herokuapp.com/api/check?ip=${teks}`).then((res) =>{ 
  let hasil = `➸ *City* : ${res.data.city}\n*Latitude* : ${res.data.latitude}\n*Longtitude* : ${res.data.longitude}\n*Region* : ${res.data.region_name}\n*Region Code* : ${res.data.region_code}\n*IP* : ${res.data.ip}\n*Type* : ${res.data.type}\n*Name* : ${res.data.name}\n*zip* : ${res.data.zip}\n*Geonime* : ${res.data.location.geoname_id}\n*Capital* : ${res.data.location.capital}\n*Calling* : ${res.data.location.calling_code}\n\n*Country Flag* : ${res.data.location.country_flag}\n\n*CountryFlagEmoji* : ${res.data.location.country_flag_emoji}` 
  conn.sendMessage(id, hasil, MessageType.text); 
 })
 }
  if (text.includes('>cooltext')){
  var teks = text.replace(/>cooltext /, '')
    axios.get('https://api.haipbis.xyz/randomcooltext?text='+teks)
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
            conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
} 
if (text.includes('>map')){
  var teks = text.replace(/>map /, '')
    axios.get('https://mnazria.herokuapp.com/api/maps?search='+teks)
    .then((res) => {
      imageToBase64(res.data.gambar)
        .then(
          (ress) => {
            conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}       
 if (text.includes('>per')){
const teks = text.replace(/>per /, "")
axios.get(`https://st4rz.herokuapp.com/api/simsimi?kata=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
if (text.includes('>loli')){
  var teks = text.replace(/>loli /, '')
    axios.get('https://st4rz.herokuapp.com/api/randomloli')
    .then(
    (res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'OniChan~', quoted: m })
        })
    })
}         
 if (text.includes('>jadwalTVnow')){
const teks = text.replace(/>jadwalTVnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>jadwaltvnow')){
const teks = text.replace(/>jadwaltvnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>jadwalTvnow')){
const teks = text.replace(/>jadwalTvnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>cersex1')){
const teks = text.replace(/>cersex1 /, "")
axios.get(`https://arugaz.herokuapp.com/api/cersex2`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
  if (text.includes('>cerpen')){
const teks = text.replace(/>cerpen /, "")
axios.get(`https://arugaz.herokuapp.com/api/cerpen`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
if (text.includes(">infogempa")){
  const teks = text.replace(/>infogempa /, "")
  axios.get(`https://arugaz.herokuapp.com/api/infogempa`).then ((res) =>{
  conn.sendMessage(id, 'Sedang Meneliti Goncangan, Silahkan Tunggu 1 Minggu', MessageType.text, { quoted: m })
  let hasil = ` *INFO GEMPA* \n\ *Lokasi* : _${res.data.lokasi}_ \n *Kedalaman✍️* : _${res.data.kedalaman}_ \n *Koordinat✍️* : _${res.data.koordinat}_ \n *Magnitude✍️* : _${res.data.magnitude}_ \n *Waktu✍️* : _${res.data.waktu}_ `;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
 if (text.includes('>cektanggal')){
const teks = text.replace(/>cektanggal /, "")
axios.get(`https://api.haipbis.xyz/harinasional?tanggal=${teks}`).then((res) => {
    let hasil = `➸  *Tanggal : ${res.data.tanggal}*\n\n➸ keterangan : ${res.data.keterangan}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>ig')){
  var teks = text.replace(/>ig /, '')
    axios.get('https://st4rz.herokuapp.com/api/ig?url=${teks}')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
   if (text.includes('>katabijak')){
 var teks = text.replace(/>katabijak /, '')
axios.get(`https://arugaz.herokuapp.com/api/randomquotes`).then((res) => {
    let hasil = `➸  *Author : ${res.data.author}*\n\n\n➸${res.data.quotes}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>puisi1')){
 var teks = text.replace(/>puisi1 /, '')
axios.get(`https://arugaz.herokuapp.com/api/puisi2`).then((res) => {
    let hasil = `➸ ${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
  if (text.includes('>puisi2')){
 var teks = text.replace(/>puisi2 /, '')
axios.get(`https://arugaz.herokuapp.com/api/puisi3`).then((res) => {
    let hasil = ` ➸ ${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>nekonime')){
  var teks = text.replace(/>nekonime /, '')
    axios.get('https://arugaz.herokuapp.com/api/nekonime')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'Meow', quoted: m })
        })
    })
}
if (text.includes('>profileig')){
  var teks = text.replace(/>profileig /, '')
    axios.get('https://arugaz.herokuapp.com/api/stalk?username='+teks)
    .then((res) => {
      imageToBase64(res.data.Profile_pic)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}
if (text.includes('>ping')){
const teks = text.replace(/>ping /, "")
axios.get(`https://api.banghasan.com/domain/nping/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
  if (text.includes('>hostsearch')){
const teks = text.replace(/>hostsearch /, "")
axios.get(`https://api.banghasan.com/domain/hostsearch/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>cekumur')){
const teks = text.replace(/>cekumur /, "")
axios.get(`https://arugaz.herokuapp.com/api/getzodiak?nama=aruga&tgl-bln-thn=${teks}`).then((res) => {
    let hasil = `➡️ Lahir : ${res.data.lahir}*\n➡ ️ultah : ${res.data.ultah}\n➡ ️usia : ${res.data.usia}\n➡ zodiak : ${res.data.zodiak}️`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
    if (text.includes('>randomhentai'))
   {
    var items = ["nsfwhentai", "anime hentai", "hentai", "nsfwneko"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes('>meme'))
   {
    var items = ["meme Indonesia", "funny meme", "meme", "meme 2020"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Woakwoakwoak🤣, Ngakak Hyung🏳️‍🌈',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
   if (messageType == 'imageMessage')
   {
       let caption = imageMessage.caption.toLocaleLowerCase()
       if (caption == '>ocr')
       {
           const img = await conn.downloadAndSaveMediaMessage(m)
           readTextInImage(img)
               .then(data => {
                   console.log(data)
                   conn.sendMessage(id, `${data}`, MessageType.text, { quoted: m });
               })
               .catch(err => {
                   console.log(err)
               })
       }
   }
      if (text.includes('>chord')){
const teks = text.replace(/>chord /, "")
axios.get(`https://st4rz.herokuapp.com/api/chord?q=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
if (text.includes(">covidglobal")){
const teks = text.replace(/>covidglobal /, "")
axios.get(`https://api.terhambar.com/negara/World`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = `info corona all \n\n *negara* : _${res.data.negara}_ \n *total* : _${res.data.total}_ \n *kasus_baru* : _${res.data.kasus_baru}_ \n *meninggal* : _${res.data.meninggal}_ \n *meninggal_baru* : _${res.data.meninggal_baru}_ \n *sembuh* : _${res.data.sembuh}_ \n *penanganan* : _${res.data.penanganan}_ \n *terakhir* : _${res.data.terakhir}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
 if (text.includes('>video18')){
const teks = text.replace(/>video18/, "")
axios.get(`https://arugaz.herokuapp.com/api/indohot`).then((res) => {
    let hasil = `➡ ️Judul : ${res.data.result.judul}\n➡ Durasi : ${res.data.result.durasi}\n➡️ Genre : ${res.data.result.genre}\nLink Download⤵\n\n${res.data.result.url}️️`;
    conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Paham Kan Kontol?', MessageType.text, { quoted: m })
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 else if (text == '>pesankosong'){
conn.sendMessage(id, '͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏ ͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏͏', MessageType.text, { quoted: m });
}
if (text.includes('>gltext')){                           
  var gh = text.split(">gltext ")[1];                           
   var teks1 = gh.split("|")[0];                            
     var teks2 = gh.split("|")[1];                             
      axios.get(`http://inyourdream.herokuapp.com/glitch?kata1=${teks1}&kata2=${teks2}`).then((res) => {                    
        imageToBase64(res.data.status)                             
          .then(  
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'Tada, Udh Jadi Nih Kak',  quoted: m });
        })
    })
}
//NEW FITUR
if (text.includes('>kbbi')){                           
    const teks = text.replace(/>kbbi /, "")                 
    axios.get(`https://mnazria.herokuapp.com/api/kbbi?search=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>aesthetic'))
   {
    var items = ["aesthetic HD"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Wah Gela Sih Aestehtic Sekali',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes('>whp'))
   {
    var items = ["wallpaper android"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Gasken, Pakek Langsung Di Hape Mu',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(">wpc"))
   {
    var items = ["wallpaper komputer"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Langsung Pake Kak Di Monitor Nya',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
      if (text.includes(">pokemon"))
   {
    var items = ["anime pokemon"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Pikaa Chu',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(">husbu"))
   {
    var items = ["anime husbu"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Nanii?',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(">shota"))
   {
    var items = ["anime shota"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Sate Sate Sate',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(">waifu"))
   {
    var items = ["anime waifu"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { caption: 'Ara ara~',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(">cari"))
   {
const teks = text.replace(/>cari /, "")
    var items = [teks];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
    conn.sendMessage(id, 'Bentar, Lagi Di Proses!!!', MessageType.text)
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image, { quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes('>seberapagay')){
const teks = text.replace(/>seberapagay /, "")
axios.get(`https://arugaz.herokuapp.com/api/howgay`).then((res) => {
    let hasil = `Pertanyaan: seberapa gay ${teks}\n*Persen:* ${res.data.persen}\n\n${res.data.desc}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>seberapabucin')){
const teks = text.replace(/>seberapabucin /, "")
axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then((res) => {
	let hasil = ` Pertanyaan: seberapa bucin ${teks}\n\n *Persen: ${res.data.persen}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>gombal')){
const teks = text.replace(/>gombal /, "")
axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then((res) => {
	let hasil = `_${res.data.desc}_`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
//join
else if (text == '>groupofc'){                           
  conn.sendMessage(id, 'Group Untuk Info Updated Bot: https://tinyurl.com/y2g9hrzv\nGroup Gabut: https://tinyurl.com/y6erfkw6' ,MessageType.text, { quoted: m });
}
if (text.includes(">join")){
conn.sendMessage(id, {displayname: "Syahfa", vcard: vcard},MessageType.contact)
conn.sendMessage(id, '*━━❰･Paket Join･❱━━*\n\nPaket Ini Terbagi Menjadi 2 Cara, Silahkan Ketik\n\n|- *_>trial_*\n|- *_>paketbayar_*\n\n Untuk Menghubungi Owner Bot Silahkan Ketik\n|- *_>creator_*', MessageType.text, { quoted: m });
}
else if (text == '>trial'){
conn.sendMessage(id, ' *_Paket Trial_*\n\n\n- Join grup 2 jam\n\n\nTunggu Owner Merespon.' ,MessageType.text, { quoted: m });
}
else if (text == '>paketbayar'){
conn.sendMessage(id, ' *_Paket Bayar_*\n\n|- Join Group 1 minggu : 3 Akun\n|- Join grup 1 bulan : 5 Akun \n|- Join grup Unlimited : 15 Akun/perbulan\n\nPembayaran Bisa Follow Instagram Saya:\n- Instagram : https://instagram.com/serenyemnyem\n\nUntukmenghubungi Owner silahkan ketik *_>creator_*\Jika Ingin Donasi Ketik *_>donasi_*' ,MessageType.text, { quoted: m });
}
//Cretaor
else if (text == '>creator'){                         
     conn.sendMessage(id, {displayname: "Syahfa", vcard: vcard}, MessageType.contact)                                     
      conn.sendMessage(id, 'Wetet, Ada Apa Manggil Majikan Saya?', MessageType.text, { quoted: m })                         
 }
 else if (text == '>owner'){
conn.sendMessage(id, {displayname: "Syahfa", vcard: vcard}, MessageType.contact, { quoted: m })
}
//Group
else if (text == '>closegc'){                     
         let hasil = `${id.split("@s.whatsapp.net")[0]}`;           
         conn.groupSettingChange (hasil, GroupSettingChange.messageSend, true);
         var nomor = m.participant
 const options = {
       text: `Group Berhasil Di Tutup Oleh @${nomor.split("@s.whatsapp.net")[0]}, Lu Kalo Bukan Admin Jangan Di Maenin`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text, { quoted: m })
}
else if (text == '>opengc'){

let hasil = `${id.split("@s.whatsapp.net")[0]}`;

conn.groupSettingChange (hasil, GroupSettingChange.messageSend, false);

var nomor = m.participant
 const options = {
       text: `Group Berhasil Di Buka Oleh @${nomor.split("@s.whatsapp.net")[0]}`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text, { quoted: m })
}
if (text.includes(">leave")){
const code = await conn.groupLeave (id.split("@s.whatsapp.net")[0])
conn.sendMessage(id, + code , MessageType.text, { quoted: m})                                                       
}
if (text.includes(">linkgc")) {

const code = await conn.groupInviteCode (id.split("@s.whatsapp.net")[0])

conn.sendMessage(id, "https://chat.whatsapp.com/" + code , MessageType.text, { quoted: m })

}
//Game
if (text.includes(">dadu")) {                              
var items = ["1", "2", "3", "4", "5", "6"]                
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
}
if (text.includes(">pegang")) {
var items = ["Badan", "Kepala", "Kaki", "Lutut", "Tangan","Jempol kaki"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
}
//Kerang Menu
if (text.includes(">apakah")){
var items = ["Ya","Tidak","Coba Ulangi", "Mana Saya Tau", "Ya Semangat Terus", "hm"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
if (text.includes(">bisakah")){
var items = ["Ya","Tidak bisa","Coba Ulangi", "Mana Saya Tau", "Ya Semangat Terus", "hm"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
if (text.includes(">kapankah")){
var items = ["1Minggu lagii","1 Tahun Lagi","1 Bulan lagi", "Besok", "Lusa", "3 Hari Lagi", "Tunggu aja"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
// NEW FITUR
if (text.includes('>stalkig')){

  var teks = text.replace(/>stalkig /, '')

    axios.get('https://st4rz.herokuapp.com/api/stalk?username='+teks)

    .then((res) => {

      imageToBase64(res.data.Profile_pic)

        .then(

          (ress) => {

           let hasil = `User Ditemukan!!\n\n*➸ Nama :* ${res.data.Name}\n*➸ Username :* ${res.data.Username}\n*➸ Followers :* ${res.data.Jumlah_Followers}\n*➸ Mengikuti :* ${res.data.Jumlah_Following}\n*➸ Jumlah Post :* ${res.data.Jumlah_Post}\n*➸ Bio :* ${res.data.Biodata}\nLink: https://instagram.com/${teks}`;

            var buf = Buffer.from(ress, 'base64')

            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })

        })

    })

}
if (text.includes('>infoanime')){
  var teks = text.replace(/>infoanime /, '')
    axios.get('https://arugaz.herokuapp.com/api/dewabatch?q='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then((ress) => {
           let hasil = ` *_${res.data.result}_* `;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
if (text.includes('>kuso')){
  var teks = text.replace(/>kuso /, '')
    axios.get('https://st4rz.herokuapp.com/api/kuso?q='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then(
        (ress) => {
           let hasil = `Info: ${res.data.info}\n\nAlur Singkat: ${res.data.sinopsis}\n\nDownload: ${res.data.link_dl}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
if (text.includes('>cersex2')){
    const teks = text.replace(/>cersex2 /, "")                 
    axios.get(`https://arugaz.herokuapp.com/api/cersex1`).then((res) => {
    let hasil = `${res.data.result.article}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
else if (text == '>fun'){
  var teks = text.replace(/>fun /, '')
    axios.get('https://st4rz.herokuapp.com/api/1cak')
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
          let hasil = `Judul: ${res.data.judul}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
        })
    })
}
 if (text.includes(">hostsearch")){
const teks = text.replace(/>hostsearch /, "")
axios.get(`https://api.banghasan.com/domain/hostsearch/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes('>bitly')){
 const teks = text.replace(/>bitly /, "")
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient('TOKEN BITLY', {});
 
bitly
  .shorten(teks)
  .then(function(result) {
    console.log(result);
    conn.sendMessage(id , result.link, MessageType.text, { quoted: m })
  })
  .catch(function(error) {
    console.error(error);
  });
  }
  if (text.includes(">hilih")){
const teks = text.replace(/>hilih /, "")
axios.get(`https://freerestapi.herokuapp.com/api/v1/hilih?kata=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 } 
if (text.includes('>image18')){
  var teks = text.replace(/>randomhentai /, '')
    axios.get('https://freerestapi.herokuapp.com/api/v1/randomp')
    .then((res) => {
      imageToBase64(res.data.url)
        .then(
        (ress) => {
       conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Paham Kan Kontol?', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'EHH!?', quoted: m })
        })
    })
}
 if (text.includes('>sholat')){
  const teks = text.replace(/>sholat /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/jadwalshalat?daerah=${teks}`).then ((res) =>{
  conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text, { quoted: m })
  let hasil = `Jadwal sholat di ${teks} hari ini adalah\n\n⚡Imsyak : ${res.data.result.Imsyak}\n⚡Subuh : ${res.data.result.Subuh} WIB\n⚡Dzuhur : ${res.data.result.Dzuhur}WIB\n⚡Ashar : ${res.data.result.Ashar} WIB\n⚡Maghrib : ${res.data.result.Maghrib}\n⚡Isya : ${res.data.result.Isya} WIB\n⚡Tengah malam : ${res.data.result.Dhuha} WIB`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes('nimequotes')){
 const teks = text.replace(/>nimequotes /, "") 
 axios.get(`https://docs-jojo.herokuapp.com/api/quotesnime/random`).then ((res) =>{
 let hasil = `Anime: ${res.data.data.anime}\nKarakter: ${res.data.data.character}\nQuotes: ${res.data.data.quote}`;
 conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes('>alkitab')){
  const teks = text.replace(/>alkitab /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/alkitab`).then ((res) =>{
  let hasil = `${res.data.result.ayat}\n\n${res.data.result.isi}`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes('>same')){
  const teks = text.replace(/>same /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/samehadaku?q=${teks}`).then ((res) =>{
  let hasil = `Judul: ${res.data.title}\n\nLink: ${res.data.link}`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes(">namaninja")){
const teks = text.replace(/>namaninja /, "")
axios.get(`https://api.terhambar.com/ninja?nama=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = `Nama Ninja kamu🙂:\n\n${res.data.result.ninja}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes('>tagme')) {
 var nomor = m.participant
 const options = {
       text: `@${nomor.split("@s.whatsapp.net")[0]} tagged!`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text, { quoted: m })
}
else if (text == '>speed') {
const timestamp = speed();
const latensi = speed() - timestamp
conn.sendMessage(id, `PONG!!\nSpeed: ${latensi.toFixed(4)} _Second_`, MessageType.text, {quoted: m})
}
if (text.includes('>randomhentai')){
  var teks = text.replace(/>randomhentai /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/hentai`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
         conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Paham Kan Kontol?', MessageType.text, { quoted: m })
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}
if (text.includes('>pornhub')){
var porn = text.split(">pornhub ")[1];
    var text1 = porn.split("|")[0];
    var text2 = porn.split("|")[1];
    axios.get(`https://mhankbarbars.herokuapp.com/api/textpro?theme=pornhub&text1=${text1}&text2=${text2}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ WAIT ] Sedang diproses⏳ silahkan tunggu sebentar', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { quoted: m });
        })
    })
}
if (text.includes('>gaming')){
  var teks = text.replace(/>gaming /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/gaming?text=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}
if (text.includes('>nomorsend')){
conn.sendMessage(id, from, `*Neh Mhank Link Nomor Wa Lu ${pushname}*\n\n*wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n\n*Atau*\n\n*api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*`)
}
if (text.includes('>texthunder')){
  var teks = text.replace(/>texthunder /, '')
    axios.get('http://jojo-api-doc.herokuapp.com/api/thunder?text='+teks)
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text, { quoted: m })
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}
if (text.includes(">movename")){
const teks = text.replace(/>movename /, "")
    let nama = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateSubject(idgrup, nama);
conn.sendMessage(id, 'Berhasil Mengganti Nama Group' ,MessageType.text, { quoted: m } );

}
if (text.includes(">movedesk")){
const teks = text.replace(/>movedesk /, "")
    let desk = `${teks}`;
    let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
    conn.groupUpdateDescription(idgrup, desk)
conn.sendMessage(id, 'Berhasil Mengganti Deskripsi Group' ,MessageType.text, { quoted: m } );

}
if (text.includes(">renungan")){
const teks = text.replace(/>renungan /, "")
axios.get(`https://docs-jojo.herokuapp.com/api/renungan`).then((res) => {
    let hasil = `Isi : ${res.data.Isi} \njudul : ${res.data.judul} \npesan : ${res.data.pesan}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
else if (text == 'baka'){
let hasil = fs.readFileSync('mp3/' + 'baka' + '.wav')
 conn.sendMessage(id, hasil, MessageType.audio, { quoted: m } )
}
else if (text == 'jir'){
let stik = fs.readFileSync('temp/' + 'jir' + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker, { quoted: m })
}
if (text.includes('>randomcry')){
  var teks = text.replace(/>randomcry /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/cry`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'bakaa:(', quoted: m })
        })
    })
}
      //Nyehh
    
})
