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
const { exec } = require("child_process");
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


const { color, bgcolor } = require('./lib/color')
const { getBuffer, fetchJson } = require('./lib/fetcher')
const { wait } = require('./lib/functions')
const { getGroupAdmins, getRandom } = require("./lib/functions")
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
blocked = []
let prefix = ">"

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}
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

conn.on (["action", null, "battery"], json => {

    const batteryLevelStr = json[2][0][1].value

    const batterylevel = parseInt (batteryLevelStr)

    console.log ("battery level: " + batterylevel + "%")

})

conn.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await conn.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await conn.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*\nSalam Kenal Kawan:)`
				let buff = await getBuffer(ppimg)
				conn.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Nitip Gorengan Yah @${num.split('@')[0]}`
				let buff = await getBuffer(ppimg)
				conn.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

conn.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

conn.on('user-presence-update', json => console.log(`[ ${moment().format("HH:mm:ss")} ] =>  recode by: @serenyemnyem`))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
   console.log(`[ ${moment().format("HH:mm:ss")} ] =>  recode by: @serenyemnyem`)
})

conn.on('message-new', async(m) =>
{
   const from = m.key.remoteJid
	const { msgType, extendedText } = MessageType
    global.blocked
    global.prefix
	const content = JSON.stringify(m.message)
    const messageContent = m.message
    const text = m.message.conversation
    let id = m.key.remoteJid
    const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
    const type = Object.keys(m.message)[0]
    let imageMessage = m.message.imageMessage;
    body = (type === 'conversation' && m.message.conversation.startsWith(prefix)) ? m.message.conversation : (type == 'imageMessage') && m.message.imageMessage.caption.startsWith(prefix) ? m.message.imageMessage.caption : (type == 'videoMessage') && m.message.videoMessage.caption.startsWith(prefix) ? m.message.videoMessage.caption : (type == 'extendedTextMessage') && m.message.extendedTextMessage.text.startsWith(prefix) ? m.message.extendedTextMessage.text : ''
   
   //stiker
   const isMedia = (type === 'imageMessage' || type === 'videoMessage')
   const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
   const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
	const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
   
   const args = body.trim().split(/ +/).slice(1)

   console.log(`[ ${moment().format("HH:mm:ss")} ] => Nomor: [ ${id.split("@s.whatsapp.net")} ] => ${text}`);
   
   //premiumyak!!!/donasi
   
   
   //sampe sini


const botNumber = conn.user.jid
const ownerNumber = ["6285779386736@s.whatsapp.net"] // replace this with your number
const isGroup = from.endsWith('@g.us')
const sender = isGroup ? m.participant : m.key.remoteJid
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.jid : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender) || false
const isOwner = ownerNumber.includes(sender)
const isNsfw = isGroup ? nsfw.includes(from) : false
const isWelkom = isGroup ? welkom.includes(from) : false


const reply = (teks) => {
				conn.sendMessage(from, teks, text, {quoted:m})
			}
			const sendMess = (hehe, teks) => {
				conn.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? conn.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : conn.sendMessage(from, teks.trim(), extendedText, {quoted: m, contextInfo: {"mentionedJid": memberr}})
			}

//command

if (text == prefix + "clear") {
		if (!isOwner) return conn.sendMessage(id , "Koe Bukan Owner Sat!" , MessageType.text )
		anu = await conn.chats.all()
					conn.setMaxListeners(100)
					for (let _ of anu) {
						conn.deleteChat(_.jid)
						console.log("Sukses Di Bersihkan!")
					}
					conn.sendMessage(id, "Berhasil Di Bersihkan!", MessageType.text, {quoted: m})
					}
					
					if (text == prefix + "adminlist") {
						
						
						if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `${no.toString()}.@${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
	}
	
	if (text.includes(prefix + "kick")) {
		
		if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Dapat Mengkick, Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						conn.groupRemove(from, [num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Menambah", MessageType.text, {quoted: m})

            }

        )
						
						}
					
					if (text == prefix + "tagall") {
						
						if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
						members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					no = 0
					teks += '\n\n'
					for (let mem of groupMembers) {
						no += 1
						teks += `${no.toString()}.@${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
}
	if (text.includes(prefix + "add")) {
		if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas, Contoh: 6261627271', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						conn.groupAdd(from, [num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Menambah", MessageType.text, {quoted: m})

            }

        )
						
						}
						
if (text.includes(prefix + "oadd")) {
		if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isOwner) return conn.sendMessage(id , "Fitur Ini Khusus Pembuat Chopper!" , MessageType.text )
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas, Contoh: 6261627271', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						conn.groupAdd(from, [num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Menambah", MessageType.text, {quoted: m})

            }

        )
						
						}
						
if (text.includes(prefix + "okick")) {
		
		if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isOwner) return conn.sendMessage(id , "Fitur Ini Khusus Pembuat Chopper!" , MessageType.text )
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						conn.groupRemove(from, [num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Mengkick", MessageType.text, {quoted: m})

            }

        )
						
						}
						
						if (text.includes(prefix + "osetdesc")) {
							if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
	if (!isOwner) return conn.sendMessage(id , "Fitur Ini Khusus Pembuat Chopper!" , MessageType.text, {quoted:m})
		                	const teks = text.replace(/>osetdesc /, "")
							let desk = `${teks}`;
                            let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
                            conn.groupUpdateDescription(idgrup, desk)
							conn.sendMessage(id, "Berhasil Ganti Description Menjadi\n\n" + teks , MessageType.text, {quoted: m})
							}
							
							if (text.includes(prefix + "osetname")) {
								
								if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isOwner) return conn.sendMessage(id , "Fitur Ini Khusus Pembuat Chopper!" , MessageType.text, {quoted:m})
		                	const teks = text.replace(/>osetname /, "")
							let nama = `${teks}`;
                            let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
                            conn.groupUpdateSubject(idgrup, nama);
                             conn.sendMessage(id, "Berhasil Ganti Nama Menjadi " + teks , MessageType.text, {quoted: m})
               }
						
						if (text.includes(prefix + "setdesc")) {
							if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
							const teks = text.replace(/>setdesc /, "")
							let desk = `${teks}`;
                            let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
                            conn.groupUpdateDescription(idgrup, desk)
							conn.sendMessage(id, "Berhasil Ganti Description Menjadi\n\n" + teks , MessageType.text, {quoted: m})
							}
							
							if (text.includes(prefix + "setname")) {
								
								if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
							const teks = text.replace(/>setname /, "")
                             let nama = `${teks}`;
                            let idgrup = `${id.split("@s.whatsapp.net")[0]}`;
                            conn.groupUpdateSubject(idgrup, nama);
                             conn.sendMessage(id, "Berhasil Ganti Nama Menjadi " + teks , MessageType.text, {quoted: m})
               }
               
               if (text == prefix + "leave") {
               	
               	if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
await conn.groupLeave (id.split("@s.whatsapp.net")[0]) // (will throw error if it fails)
}

if (text == prefix + "blocklist") {
	teks = 'This is list of blocked number :\n'
	no = 0
					for (let block of blocked) {
						no += 1
						teks += `${no.toString()}.@${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					conn.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
}



if (text.includes(prefix + "promote")) {
	
	if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas, Contoh 6271827382829', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
 conn.groupMakeAdmin(from, [num, num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Promote", MessageType.text, {quoted: m})

            }

        )
        
        conn.sendMessage(id, `Berhasil Promote ${num}`, MessageType.text)
 
 
						}

if (text.includes(prefix + "demote")) {
	
	if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
		if (args[0].startsWith('08')) return conn.sendMessage(id, 'Gunakan kode negara mas', MessageType.text, {quoted: m})
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
 await conn.groupDemoteAdmin(from, [num, num]).catch(

            (error) => {

                conn.sendMessage(id, "Tidak Bisa Demote", MessageType.text, {quoted: m})

            }

        )
 
 conn.sendMessage(id, `Berhasil Demote ${num}`, MessageType.text)
						}

if (text == prefix + "infobot") {
	
	me = conn.user
					uptime = process.uptime()
					const timestamp = speed();
                    const latensi = speed() - timestamp
					teks = `*Nama bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}\nSpeed: ${latensi.toFixed(4)} _Second_`
					buffer = await getBuffer(me.imgUrl)
					conn.sendMessage(from, buffer, MessageType.image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
}

if (text.includes(prefix + "welcome")) {
	if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})
					if (args.length < 1) return conn.sendMessage(id, 'Hmmmm', MessageType.text)
					if (Number(args[0]) === 1) {
						if (isWelkom) return conn.sendMessage(id,"Udah Aktif", MessageType.text)
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						conn.sendMessage(id, 'Sukses mengaktifkan fitur welcome di group ini ✔️', MessageType.text)
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						conn.sendMessage(id , 'Sukses menonaktifkan fitur welcome di group ini ✔️', MessageType.text)
					} else {
						conn.sendMessage(id, '1 untuk mengaktifkan, 0 untuk menonaktifkan' , MessageType.text)
					}
					}

if (text.includes(prefix + "prefix")) {
if (args.length < 1) return
if (!isOwner) return conn.sendMessage(id , "Koe Bukan Owner Sat!" , MessageType.text )
prefix = args[0]
conn.sendMessage(id, `Prefix berhasil di ubah menjadi : ${prefix}`,MessageType.text)
}

if (text.includes(prefix + "say")){
  const teks = text.replace(/say /, "")
conn.sendMessage(id, teks, MessageType.text, { quoted: m })
}

if (text.includes(prefix + 'nulis')){
  var teks = text.replace(/nulis /, '')
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
if (text.includes(prefix + 'ytmp3')){
  var teks = text.replace(/ytmp3 /, '')
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
if (text.includes(prefix + 'ytmp4')){
  var teks = text.replace(/ytmp4 /, '')
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

if (text == prefix + 'menu'){
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
if (text == prefix + 'help'){
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
else if (text == prefix + 'quran'){
axios.get('https://api.banghasan.com/quran/format/json/acak').then((res) => {
    const sr = /{(.*?)}/gi;
    const hs = res.data.acak.id.ayat;
    const ket = `${hs}`.replace(sr, '');
    let hasil = `[${ket}]   ${res.data.acak.ar.teks}\n\n${res.data.acak.id.teks}(QS.${res.data.surat.nama}, Ayat ${ket})`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
else if (text == prefix + 'iklan'){
conn.sendMessage(id, '📺 *IKLAN* : *INSTAGRAM: @serenyemnyem*\n\n♨️ GROUP NGOBROL [1] : https://chat.whatsapp.com/FPveeKtkbNaGo2BfPC5hcx\n\n😭 MERENUNG: https://www.instagram.com/p/CCd6JSRJtNr/?igshid=1bb1pivqzs8yt\n\n♻️ Mau pasang iklan di *Choper?*\n\n☎️ WA : *085779386736*' ,MessageType.text, { quoted: m });
}
else if (text == prefix + 'Iklan'){
conn.sendMessage(id, '📺 *IKLAN* : *INSTAGRAM: @serenyemnyem*\n\n♨️ GROUP NGOBROL [1] : https://chat.whatsapp.com/FPveeKtkbNaGo2BfPC5hcx\n\n😭 MERENUNG: https://www.instagram.com/p/CCd6JSRJtNr/?igshid=1bb1pivqzs8yt\n\n♻️ Mau pasang iklan di *Choper?*\n\n☎️ WA : *085779386736*' ,MessageType.text, { quoted: m });
}
else if (text == prefix + 'donate'){
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
else if (text == prefix + 'donasi'){
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
else if (text == prefix + 'DONATE'){
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
else if (text == prefix + 'DONASI'){
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
else if (text == prefix + 'info'){
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

   if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == prefix + 'stiker')
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
   
   
   if (type == 'videoMessage') {
				const captvid = m.message.videoMessage.caption.toLowerCase()
				if (captvid == prefix + 'stikergif' || captvid == prefix + 'stickergif') {
					try {
      
					media = await conn.downloadAndSaveMediaMessage(m)
					ran = getRandom('.webp')
					exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ran}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(ran)
						conn.sendMessage(id, buffer, MessageType.sticker, {quoted: m})
						fs.unlinkSync(ran)
						fs.unlinkSync(media)
					})
					} catch (error) {
					console.log(error)
					conn.sendMessage(id, "Tidak Bisa Convert Menjadi Sticker Bergerak Silakan Ulangi", MessageType.text)
					}
					}
					}
					
					if (type == 'extendedTextMessage') {
				mok = JSON.parse(JSON.stringify(m).replace('quotedM','m'))
				qtdMsg = m.message.extendedTextMessage.text.toLowerCase()
				if (qtdMsg == prefix + 'stiker' || qtdMsg == prefix + 'sticker') {
					try {

					media = await conn.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					ran = getRandom('.webp')
					exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ran}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(ran)
						conn.sendMessage(id, buffer, MessageType.sticker, {quoted: m})
						fs.unlinkSync(ran)
						fs.unlinkSync(media)
						})
						} catch (error) {
					console.log(error)
					conn.sendMessage(id, "Tidak Bisa Convert Menjadi Sticker Silakan Ulangi", MessageType.text)
					}
					}
					
				if (qtdMsg == prefix + 'wait' && content.includes('imageMessage')) {

					media = await conn.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					let buffer = fs.readFileSync(media)
					await wait(buffer).then(res => {
						conn.sendMessage(id, res.video, MessageType.video, {caption: res.hasil, quoted: m})
						fs.unlinkSync(media)
					}).catch(err => {
						conn.sendMessage(id, err, MessageType.text, {quoted: m})
						fs.unlinkSync(media)
					})
				} 
				
				if (qtdMsg == prefix + 'toimg' || qtdMsg == prefix + 'sti' || qtdMsg == prefix + 'stikertoimg' && content.includes('stickerMessage')) {
					try {
						
					media = await conn.downloadAndSaveMediaMessage(mok.message.extendedTextMessage.contextInfo)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (error, stdout, stderr) => {
						let buffer = fs.readFileSync(ran)
						conn.sendMessage(id, buffer, MessageType.image, { quoted: m })
					})
				} catch (error) {
					console.log(error)
					conn.sendMessage(id, "Tidak Bisa Convert Menjadi Gambar Silakan Ulangi", MessageType.text)
					}
					}
				}
				
				
			if (type == 'conversation') {
				const body = m.message.conversation.toLowerCase()
				const args = body.split(' ')
				if (body.startsWith(prefix + 'tts ')) {
					try {
						
					rendom = getRandom('.mp3')
					random = getRandom('.ogg')
					if (args.length < 1) return conn.sendMessage(id, 'Masukkan kode bahasanya juga mas e', MessageType.text, {quoted: m})
					const gtts = require('./lib/gtts')(args[1])
					const dtt = body.slice(8)
					if (!dtt) return conn.sendMessage(id, 'Masukkan teks buat di jadiin suaranya juga mas e', MessageType.text, {quoted: m})
					if (dtt.length > 600) return conn.sendMessage(id, 'Ngotak mas', MessageType.text, {quoted: m})
					
					gtts.save(rendom, dtt, function () {
						exec(`ffmpeg -i ${rendom} -ar 48000 -vn -c:a libopus ${random}`, (error, stdout, stder) => {
							let res = fs.readFileSync(random)
							conn.sendMessage(id, res, MessageType.audio, {ptt: true})
							fs.unlinkSync(random)
							fs.unlinkSync(rendom)
						})
					})
					} catch (error) {
					console.log(error)
					conn.sendMessage(id, "Masukan Code Bahasa!", MessageType.text)
					}
				}
				}

if (text.includes(prefix + 'groupinfo')){
                if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
                ppUrl = await client.getProfilePicture(from) // leave empty to get your own
			    buffer = await getBuffer(ppUrl)
			    let hasil = `*NAME* : ${groupName}\n*MEMBER* : ${groupMembers.length}\n*ADMIN* : ${groupAdmins.length}\n*DESK* : ${groupDesc}`
		        conn.sendMessage(from, buffer, image, { caption: hasil, quoted: m})
		        }

   if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == prefix + 'pantun')
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
      if (text.includes(prefix + ">covidID"))
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
   if (text.includes(prefix + "quotes"))
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
        else if (text.includes(prefix + "artinama ")) 
  {
    const cheerio = require('cheerio');
    const request = require('request');
    var nama = text.split(prefix + "artinama ")[1];
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
  else if (text.includes(prefix + "pasangan ")) {
    const request = require('request');
    var gh = text.split(prefix + "pasangan ")[1];
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
    if (text.includes(prefix + "p cewek"))
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
    
    if (text.includes(prefix + "kucing"))
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
              buf,MessageType.image, { caption: '*KUCING*️',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
    if (text.includes(prefix + "loli"))
   {
    var items = ["anime loli"];
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
              buf,MessageType.image, { caption: '*LOLI*️',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
    if (text.includes(prefix + ">p ukhti"))
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
              buf,MessageType.image, { caption: '*Assalamualaikum Teman Teman*',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }
    
     if (text.includes(prefix + ">cosplay"))
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
              buf,MessageType.image, { caption: '*COSPLAY*',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

   if (text.includes(prefix + ">p cowok"))
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

if (text.includes(prefix + ">randomanime"))
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

if (text.includes(prefix + ">scdl")){
const fs = require("fs");
const scdl = require("./lib/scdl");
scdl.setClientID("iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX");
scdl("https://m.soundcloud.com/abdul-muttaqin-701361735/lucid-dreams-gustixa-ft-vict-molina")
    .pipe(fs.createWriteStream("mp3/song.mp3"));
}
 
if (text.includes(prefix + ">lirik")){
	const teks = text.replace(/>lirik /, "")
	axios.get(`https://tobz-api.herokuapp.com/api/lirik?q=${teks}`).then ((res) => {
	     conn.sendMessage(id, 'Bentar, Lagi Di Proses!!!', MessageType.text)
	 	let hasil = ` *🎧Lirik🎧 Lagu ${teks}:* \n\n\n _${res.data.result.lirik}_ `
	conn.sendMessage(id, hasil, MessageType.text, { quoted: m })
	})
}
if (text.includes(prefix + '>alay')){
	const teks = text.replace(/>alay /, "")
	axios.get(`https://arugaz.herokuapp.com/api/bapakfont?kata=${teks}`).then ((res) =>
		{ let hasil = `${res.data.result}`
		conn.sendMessage(id, hasil, MessageType.text, { quoted: m })
	})
}
if (text.includes(prefix + '>ssweb')){
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
     if (text.includes(prefix + '>wiki')){
const teks = text.replace(/>wiki /, "")
axios.get(`https://st4rz.herokuapp.com/api/wiki?q=${teks}`).then((res) => {
	conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text)
    let hasil = `*Pertanyaan: ${teks}*\n\nJawaban: ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + '>spamcall')){
const teks = text.replace(/>spamcall /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamcall?no=${teks}`).then((res) => {
    let hasil = `${res.data.logs}\n${res.data.msg}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
 if (text.includes(prefix + '>spamgmail')){
const teks = text.replace(/>spamgmail /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamgmail?target=${teks}&jum=1`).then((res) => {
    let hasil = `${res.data.logs}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}   
   if (text.includes(prefix + '>spamsms')){
const teks = text.replace(/>spamsms /, "")
axios.get(`https://arugaz.herokuapp.com/api/spamsms?no=${teks}&jum=1`).then((res) => {
    let hasil = `${res.data.logs}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
} 

  if (text.includes(prefix + '>checkip'))
  { const teks = text.replace(/>checkip /, "") 
  axios.get(`https://mnazria.herokuapp.com/api/check?ip=${teks}`).then((res) =>{ 
  let hasil = `➸ *City* : ${res.data.city}\n*Latitude* : ${res.data.latitude}\n*Longtitude* : ${res.data.longitude}\n*Region* : ${res.data.region_name}\n*Region Code* : ${res.data.region_code}\n*IP* : ${res.data.ip}\n*Type* : ${res.data.type}\n*Name* : ${res.data.name}\n*zip* : ${res.data.zip}\n*Geonime* : ${res.data.location.geoname_id}\n*Capital* : ${res.data.location.capital}\n*Calling* : ${res.data.location.calling_code}\n\n*Country Flag* : ${res.data.location.country_flag}\n\n*CountryFlagEmoji* : ${res.data.location.country_flag_emoji}` 
  conn.sendMessage(id, hasil, MessageType.text); 
 })
 }
  if (text.includes(prefix + '>cooltext')){
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
if (text.includes(prefix + '>map')){
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
 if (text.includes(prefix + '>per')){
const teks = text.replace(/>per /, "")
axios.get(`https://st4rz.herokuapp.com/api/simsimi?kata=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }

 if (text.includes(prefix + '>jadwalTVnow')){
const teks = text.replace(/>jadwalTVnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>jadwaltvnow')){
const teks = text.replace(/>jadwaltvnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>jadwalTvnow')){
const teks = text.replace(/>jadwalTvnow /, "")
axios.get(`https://api.haipbis.xyz/jadwaltvnow`).then((res) => {
    let hasil = `Jam : ${res.data.jam}\n\n${res.data.jadwalTV}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>cersex1')){
const teks = text.replace(/>cersex1 /, "")
axios.get(`https://arugaz.herokuapp.com/api/cersex2`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
  if (text.includes(prefix + '>cerpen')){
const teks = text.replace(/>cerpen /, "")
axios.get(`https://arugaz.herokuapp.com/api/cerpen`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
if (text.includes(prefix + ">infogempa")){
  const teks = text.replace(/>infogempa /, "")
  axios.get(`https://arugaz.herokuapp.com/api/infogempa`).then ((res) =>{
  conn.sendMessage(id, 'Sedang Meneliti Goncangan, Silahkan Tunggu 1 Minggu', MessageType.text, { quoted: m })
  let hasil = ` *INFO GEMPA* \n\ *Lokasi* : _${res.data.lokasi}_ \n *Kedalaman✍️* : _${res.data.kedalaman}_ \n *Koordinat✍️* : _${res.data.koordinat}_ \n *Magnitude✍️* : _${res.data.magnitude}_ \n *Waktu✍️* : _${res.data.waktu}_ `;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
 if (text.includes(prefix + '>cektanggal')){
const teks = text.replace(/>cektanggal /, "")
axios.get(`https://api.haipbis.xyz/harinasional?tanggal=${teks}`).then((res) => {
    let hasil = `➸  *Tanggal : ${res.data.tanggal}*\n\n➸ keterangan : ${res.data.keterangan}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>ig')){
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
   if (text.includes(prefix + '>katabijak')){
 var teks = text.replace(/>katabijak /, '')
axios.get(`https://arugaz.herokuapp.com/api/randomquotes`).then((res) => {
    let hasil = `➸  *Author : ${res.data.author}*\n\n\n➸${res.data.quotes}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>puisi1')){
 var teks = text.replace(/>puisi1 /, '')
axios.get(`https://arugaz.herokuapp.com/api/puisi2`).then((res) => {
    let hasil = `➸ ${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
  if (text.includes(prefix + '>puisi2')){
 var teks = text.replace(/>puisi2 /, '')
axios.get(`https://arugaz.herokuapp.com/api/puisi3`).then((res) => {
    let hasil = ` ➸ ${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>nekonime')){
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
if (text.includes(prefix + '>profileig')){
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
if (text.includes(prefix + '>ping')){
const teks = text.replace(/>ping /, "")
axios.get(`https://api.banghasan.com/domain/nping/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
  if (text.includes(prefix + '>hostsearch')){
const teks = text.replace(/>hostsearch /, "")
axios.get(`https://api.banghasan.com/domain/hostsearch/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + '>cekumur')){
const teks = text.replace(/>cekumur /, "")
axios.get(`https://arugaz.herokuapp.com/api/getzodiak?nama=aruga&tgl-bln-thn=${teks}`).then((res) => {
    let hasil = `➡️ Lahir : ${res.data.lahir}*\n➡ ️ultah : ${res.data.ultah}\n➡ ️usia : ${res.data.usia}\n➡ zodiak : ${res.data.zodiak}️`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
    
if (text.includes(prefix + '>meme'))
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
       if (caption == prefix + 'ocr')
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
      if (text.includes(prefix + '>chord')){
const teks = text.replace(/>chord /, "")
axios.get(`https://st4rz.herokuapp.com/api/chord?q=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
  })
 }
if (text.includes(prefix + ">covidGlobal")){
const teks = text.replace(/>covidGlobal /, "")
axios.get(`https://api.terhambar.com/negara/World`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = `info corona all \n\n *negara* : _${res.data.negara}_ \n *total* : _${res.data.total}_ \n *kasus_baru* : _${res.data.kasus_baru}_ \n *meninggal* : _${res.data.meninggal}_ \n *meninggal_baru* : _${res.data.meninggal_baru}_ \n *sembuh* : _${res.data.sembuh}_ \n *penanganan* : _${res.data.penanganan}_ \n *terakhir* : _${res.data.terakhir}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
 if (text.includes(prefix + '>video18')){
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
if (text.includes(prefix + 'gltext')){                           
  var gh = text.split(prefix + "gltext ")[1];                           
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
if (text.includes(prefix + 'kbbi')){                           
    const teks = text.replace(/kbbi /, "")                 
    axios.get(`https://mnazria.herokuapp.com/api/kbbi?search=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + 'aesthetic'))
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
    if (text.includes(prefix + 'whp'))
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
    if (text.includes(prefix + "wpc"))
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
      if (text.includes(prefix + "pokemon"))
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
                conn.sendMessage(id, "❌Gambar Tidak Di Temukan❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(prefix + "husbu"))
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
                conn.sendMessage(id, "❌Gambar Tidak Di Temukan❌", MessageType.text, {quoted: m});  // Logs an error if there was one
            }
        )
    
    });
    }
    if (text.includes(prefix + "shota"))
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
               conn.sendMessage(id, "❌Gambar Tidak Di Temukan❌", MessageType.text, {quoted: m}); // Logs an error if there was one            
            }
        )
    
    });
    }
    if (text.includes(prefix + "waifu"))
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
              buf,MessageType.image, { caption: 'Haik~',  quoted: m })
       
            }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌Gambar Tidak Di Temukan❌", MessageType.text, {quoted: m}); // Logs an error if there was one
             }
        )
    
    });
    }
    if (text.includes(prefix + "cari"))
   {
const teks = text.replace(/prefix + cari /, "")
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
                conn.sendMessage(id, "❌Gambar Tidak Di Temukan❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes(prefix + 'gombal')){
const teks = text.replace(/gombal /, "")
axios.get(`https://arugaz.herokuapp.com/api/howbucins`).then((res) => {
	let hasil = `_${res.data.desc}_`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
//join
else if (text == prefix + 'groupofc'){                           
  conn.sendMessage(id, 'Group Untuk Info Updated Bot: https://tinyurl.com/y2g9hrzv\nGroup Gabut: https://tinyurl.com/y6erfkw6' ,MessageType.text, { quoted: m });
}
//Cretaor
else if (text == prefix + 'creator'){                         
     conn.sendMessage(id, {displayname: "Syahfa", vcard: vcard}, MessageType.contact)                                     
      conn.sendMessage(id, 'Wetet, Ada Apa Manggil Majikan Saya?', MessageType.text, { quoted: m })                         
 }
 else if (text == prefix + 'owner'){
conn.sendMessage(id, {displayname: "Syahfa", vcard: vcard}, MessageType.contact, { quoted: m })
}
//Group
else if (text == prefix + 'closegc'){       
         if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})			              
         let hasil = `${id.split("@s.whatsapp.net")[0]}`;           
         conn.groupSettingChange (hasil, GroupSettingChange.messageSend, true);
         conn.sendMessage(id, "Group Berhasil Di Tutup", MessageType.text, { quoted: m })
}
else if (text == prefix + 'opengc'){
       if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })
		if (!isGroupAdmins) return conn.sendMessage(id, "Kamu Bukan Admin!", MessageType.text, {quoted: m})					
let hasil = `${id.split("@s.whatsapp.net")[0]}`;
conn.groupSettingChange (hasil, GroupSettingChange.messageSend, false);
conn.sendMessage(id, "Group Berhasil Di Buka", MessageType.text, { quoted: m })
}
if (text.includes(prefix + "linkgc")) {
        if (!isGroup) return conn.sendMessage(id, "Ini Bukan Grup Bodo!", MessageType.text , {quoted: m})
		if (!isBotGroupAdmins) return conn.sendMessage(id, "Bot Tidak Menjadi Admin Silakan Adminkan Untuk Bisa Menggunakan Fitur Ini", MessageType.text, { quoted: m })				
const code = await conn.groupInviteCode (id.split("@s.whatsapp.net")[0])

conn.sendMessage(id, "https://chat.whatsapp.com/" + code , MessageType.text, { quoted: m })

}
//Game
if (text.includes(prefix + "dadu")) {                              
var items = ["1", "2", "3", "4", "5", "6"]                
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
}
if (text.includes(prefix + "pegang")) {
var items = ["Badan", "Kepala", "Kaki", "Lutut", "Tangan","Jempol kaki"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
}
//Kerang Menu
if (text.includes(prefix + "apakah")){
var items = ["Ya","Tidak","Coba Ulangi", "Mana Saya Tau", "Ya Semangat Terus", "hm"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
if (text.includes(prefix + "bisakah")){
var items = ["Ya","Tidak bisa","Coba Ulangi", "Mana Saya Tau", "Ya Semangat Terus", "hm"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
if (text.includes(prefix + "kapankah")){
var items = ["1Minggu lagii","1 Tahun Lagi","1 Bulan lagi", "Besok", "Lusa", "3 Hari Lagi", "Tunggu aja"]
var nime = items[Math.floor(Math.random() * items.length)];
conn.sendMessage(id, nime, MessageType.text, { quoted: m })
	}
// NEW FITUR
if (text.includes(prefix + 'stalkig')){

  var teks = text.replace(/stalkig /, '')

    axios.get('https://st4rz.herokuapp.com/api/stalk?username='+teks)

    .then((res) => {

      imageToBase64(res.data.Profile_pic)

        .then(

          (ress) => {

           let hasil = `User Ditemukan!!\n\n*➸ Nama :* ${res.data.Name}\n*➸ Username :* ${res.data.Username}\n*➸ Followers :* ${res.data.Jumlah_Followers}\n*➸ Mengikuti :* ${res.data.Jumlah_Following}\n*➸ Jumlah Post :* ${res.data.Jumlah_Post}\n*➸ Bio :* ${res.data.Biodata}\nLink: https://instagram.com/${teks}`;

            var buf = Buffer.from(ress, 'base64')

            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })

           }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌User Tidak Di Temukan❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes(prefix + 'infoanime')){
  var teks = text.replace(/infoanime /, '')
    axios.get('https://arugaz.herokuapp.com/api/dewabatch?q='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then((ress) => {
           let hasil = ` *_${res.data.result}_* `;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
          }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌Anime Yang Anda Cari Tidak Ada Dalam Data Kami❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes(prefix + 'kuso')){
  var teks = text.replace(/kuso /, '')
    axios.get('https://st4rz.herokuapp.com/api/kuso?q='+teks)
    .then((res) => {
      imageToBase64(res.data.thumb)
        .then(
        (ress) => {
           let hasil = `Info: ${res.data.info}\n\nAlur Singkat: ${res.data.sinopsis}\n\nDownload: ${res.data.link_dl}`;
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: hasil, quoted: m })
          }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌Anime Yang Anda Cari Tidak Ada Dalam Data Kami❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
if (text.includes(prefix + 'cersex2')){
    const teks = text.replace(/cersex2 /, "")                 
    axios.get(`https://arugaz.herokuapp.com/api/cersex1`).then((res) => {
    let hasil = `${res.data.result.article}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
 if (text.includes(prefix + "hostsearch")){
const teks = text.replace(/hostsearch /, "")
axios.get(`https://api.banghasan.com/domain/hostsearch/${teks}`).then((res) => {
    let hasil = `*query : ${res.data.query}*\n\nhasil : ${res.data.hasil}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 }
 if (text.includes(prefix + 'bitly')){
 const teks = text.replace(/bitly /, "")
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
  if (text.includes(prefix + "hilih")){
const teks = text.replace(/hilih /, "")
axios.get(`https://freerestapi.herokuapp.com/api/v1/hilih?kata=${teks}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
  })
 } 
if (text.includes(prefix + 'image18')){
  var teks = text.replace(/image18 /, '')
    axios.get('https://freerestapi.herokuapp.com/api/v1/randomp')
    .then((res) => {
      imageToBase64(res.data.url)
        .then(
        (ress) => {
       conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Paham Kan Kontol?', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'EHH!?', quoted: m })
          }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌Anda Terlalu Engas, Jadi Eror Kan Anjim❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
 if (text.includes(prefix + 'sholat')){
  const teks = text.replace(/sholat /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/jadwalshalat?daerah=${teks}`).then ((res) =>{
  conn.sendMessage(id, '[❗] SEDANG DIPROSES', MessageType.text, { quoted: m })
  let hasil = `Jadwal sholat di ${teks} hari ini adalah\n\n⚡Imsyak : ${res.data.result.Imsyak}\n⚡Subuh : ${res.data.result.Subuh} WIB\n⚡Dzuhur : ${res.data.result.Dzuhur}WIB\n⚡Ashar : ${res.data.result.Ashar} WIB\n⚡Maghrib : ${res.data.result.Maghrib}\n⚡Isya : ${res.data.result.Isya} WIB\n⚡Tengah malam : ${res.data.result.Dhuha} WIB`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
 }
)
if (text.includes(prefix + 'nimequotes')){
 const teks = text.replace(/nimequotes /, "") 
 axios.get(`https://docs-jojo.herokuapp.com/api/quotesnime/random`).then ((res) =>{
 let hasil = `Quotes: ${res.data.data.quote}`;
 conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + 'alkitab')){
  const teks = text.replace(/alkitab /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/alkitab`).then ((res) =>{
  let hasil = `${res.data.result.ayat}\n\n${res.data.result.isi}`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + 'same')){
  const teks = text.replace(/same /, "")
  axios.get(`https://docs-jojo.herokuapp.com/api/samehadaku?q=${teks}`).then ((res) =>{
  let hasil = `Judul: ${res.data.title}\n\nLink: ${res.data.link}`;
  conn.sendMessage(id, hasil, MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + "namaninja")){
const teks = text.replace(/namaninja /, "")
axios.get(`https://api.terhambar.com/ninja?nama=${teks}`).then((res) => {
	conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text)
    let hasil = `Nama Ninja kamu🙂:\n\n${res.data.result.ninja}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
if (text.includes(prefix + 'tagme')) {
 var nomor = m.participant
 const options = {
       text: `@${nomor.split("@s.whatsapp.net")[0]} tagged!`,
       contextInfo: { mentionedJid: [nomor] }
 }
 conn.sendMessage(id, options, MessageType.text, { quoted: m })
}
else if (text == 'speed') {
const timestamp = speed();
const latensi = speed() - timestamp
conn.sendMessage(id, `PONG!!\nSpeed: ${latensi.toFixed(4)} _Second_`, MessageType.text, {quoted: m})
}

if (text.includes(prefix + 'gaming')){
  var teks = text.replace(/gaming /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/gaming?text=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { quoted: m })
        })
    })
}
if (text.includes(prefix + 'nomorsend')){
conn.sendMessage(id, from, `*Neh Mhank Link Nomor Wa Lu ${pushname}*\n\n*wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n\n*Atau*\n\n*api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*`)
}
if (text.includes(prefix + 'texthunder')){
  var teks = text.replace(/texthunder /, '')
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
if (text.includes(prefix + "renungan")){
const teks = text.replace(/renungan /, "")
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
else if (text == 'bot'){
let stik = fs.readFileSync('temp/' + 'bot' + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker, { quoted: m })
}
if (text.includes(prefix + 'randomcry')){
  var teks = text.replace(/randomcry /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/cry`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'bakaa:(', quoted: m })
          }
        )
        .catch(
            (error) => {
                conn.sendMessage(id, "❌Udh Gak Ush Nangis Yah Ka, Bot Nya Jadi Eror Mulu Nih❌", MessageType.text, {quoted: m}); // Logs an error if there was one
            }
        )
    
    });
    }
if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == prefix + 'fakta')
      {

         fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body =>
            {
               let tod = body.split("\n");
               let pjr = tod[Math.floor(Math.random() * tod.length)];
               let fakta = pjr.replace(/pjrx-line/g, "\n");
               conn.sendMessage(id, fakta, MessageType.text, { quoted: m })
            });
      }

   }
  
  if (text.includes(prefix + 'nsfwblowjob')){
  var teks = text.replace(/nsfwblowjob /, '')
    axios.get('https://tobz-api.herokuapp.com/api/nsfwblowjob')
    .then((res) => {
      imagegifToBase64(res.data.result)
        .then(
          (ress) => {
           conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Demi Kenyamanan Member Group!!!', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.imagegif)
        })
    })
}
  if (text.includes(prefix + 'hug')){
  var teks = text.replace(/hug /, '')
    axios.get('https://tobz-api.herokuapp.com/api/hug')
    .then((res) => {
      imagegifToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.imagegif, { quoted: m })
        })
    })
}
if (text.includes(prefix + 'randomhentai')){
  var teks = text.replace(/randomhentai /, '')
    axios.get('https://tobz-api.herokuapp.com/api/hentai')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
        (ress) => {
       conn.sendMessage(id, 'Beri Jeda 15 detik', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'EHH!?', quoted: m })
        })
    })
}
if (text.includes(prefix + 'nsfwneko')){
  var teks = text.replace(/nsfwneko /, '')
    axios.get('https://tobz-api.herokuapp.com/api/nsfwneko')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
        (ress) => {
       conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Demi Kenyamanan Member Group?', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'EHH!?', quoted: m })
        })
    })
}
if (text.includes(prefix + 'nsfwtrap')){
  var teks = text.replace(/nsfwtrap /, '')
    axios.get('https://tobz-api.herokuapp.com/api/nsfwtrap')
    .then((res) => {
      imageToBase64(res.data.result)
        .then(
        (ress) => {
       conn.sendMessage(id, 'Mohon Gunakan Fitur Ini Di Private Chat Chopper, Demi Kenyamanan Member Group?', MessageType.text, { quoted: m })
           var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image, { caption: 'EHH!?', quoted: m })
        })
    })
}
if (text.includes(prefix + "bugreport")){
const teks = text.replace(/bugreport /, "")
const hasil = `${id.split("@s.whatsapp.net")[0]}`;
var nomor = m.participant
    const bug = {
          text: `*[BUG REPORT]*\n\n*Nomor :* @${nomor.split("@s.whatsapp.net")[0]}\n*Id :* ${hasil}\n*Pesan :* ${teks}\n*Pada Tanggal :* ${moment().format('DD-MM-YY')}\n*Pada Jam :* ${moment().format("HH:mm:ss")}`,
          contextInfo: { mentionedJid: [nomor] }
    }
conn.sendMessage('6285779386736@s.whatsapp.net', bug, MessageType.text, { quoted: m })
conn.sendMessage(id, 'Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi.', MessageType.text, { quoted: m } )
         
}
if (text.includes(prefix + "join")){
const teks = text.replace(/join /, "")
const hasil = `${id.split("@s.whatsapp.net")[0]}`;
var nomor = m.participant
    const bug = {
          text: `*[INFO JOIN]*\n\n*Nomor :* @${nomor.split("@s.whatsapp.net")[0]}\n*Id :* ${hasil}\n*Pesan :* ${teks}\n*Pada Tanggal :* ${moment().format('DD-MM-YY')}\n*Pada Jam :* ${moment().format("HH:mm:ss")}`,
          contextInfo: { mentionedJid: [nomor] }
    }
conn.sendMessage('6285779386736@s.whatsapp.net', bug, MessageType.text, { quoted: m })
conn.sendMessage(id, 'Bot Join Jika Minimal Member 55+, Owner Akan Melihat Group Apakah Sudah Memenuhi Syarat Atau Tidak.', MessageType.text, { quoted: m } )
         
}
if (text.includes(prefix + "lirik2")){
	const teks = text.split("lirik2")[1]
	axios.get(`http://scrap.terhambar.com/lirik?word=${teks}`).then ((res) => {
	     conn.sendMessage(id, '[WAIT] Searching...❗', MessageType.text, {quoted:m})
	 	let hasil = `🎶lirik🎶 lagu ${teks} \n\n\n ${res.data.result.lirik}`
	conn.sendMessage(id, hasil, MessageType.text, {quoted: m})
	})
}
if (text.includes(prefix + "alay")){
	const alay = text.split(prefix + "alay")[1]
	axios.get(`https://api.terhambar.com/bpk?kata=${alay}`).then ((res) =>
		{ let hasil = `${res.data.text}`
		conn.sendMessage(id, hasil, MessageType.text, {quoted: m})
	})
}
if (text.includes(prefix + "joox")){
const teks = text.replace(/prefix + joox /, "")
axios.get(`https://tobz-api.herokuapp.com/api/joox?q=${text}`).then((res) => {
    let hasil = `*Judul:* ${res.data.result.judul} \n*Album:* ${res.data.result.album} \n*Tanggal Upload:* ${res.data.result.dipublikasi}\n*Download:* ${res.data.result.mp3}`;
    conn.sendMessage(id, hasil ,MessageType.text, { quoted: m });
})
}
      //Nyehh
    
})
