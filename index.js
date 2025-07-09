const {Client, LocalAuth} = require("whatsapp-web.js")
const excel = require('read-excel-file/node');
const qrcode = require("qrcode-terminal")



const schema = {
  'nome': {
    prop: 'nome',
    type: String
  },
  'telefone': {
    prop: 'telefone',
    type: String
  }
}


const client = new Client({
	 authStrategy: new LocalAuth(), // mantém sessão salva loc
	puppeteer: {
 	args: ['--no-sandbox', '--disable-setuid-sandbox']
 	}
 })


 client.on('qr', function(qr){
 	qrcode.generate(qr, {small:true})
 })

 client.on('ready', ()=>{
 	console.log('whatsapp ativo')
 	
 })

 client.on('message', async(msg)=>{
	if(msg.from === "5521964987625@c.us"){
		if(msg.hasMedia){
			
				const media = await msg.downloadMedia()
				await msg.reply("Recebi a planilha !")
			
		
			const buffer = Buffer.from(media.data, 'base64')
			const resp = await excel(buffer, {schema})
			const {rows} = resp
			rows.map(async(item, index)=>{
				//console.log(item.nome, item.telefone)
				const id = await client.getNumberId(item.telefone)
				//console.log(id._serialized)
				try{

					setTimeout(async()=>{
						await client.sendMessage(id._serialized,`Olá ${item.nome}! Aqui é da Leve Saúde. Você ainda está buscando um plano de saúde? Se sim, responda *SIM* para que eu possa te enviar mais informações.`)
						//console.log(`mensagem enviada para ${item.nome}`)
						await msg.reply(`mensagem enviada para ${item.nome}`)
6						//console.log(item.nome)
					}, 180000 * index)
					
				}
				catch(error){
					console.log(error.message)					
				}
			})
		}
	}
 })	

 client.initialize()
