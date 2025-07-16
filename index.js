
const {Client, LocalAuth} = require("whatsapp-web.js")
const excel = require('read-excel-file/node');
const qrcode = require("qrcode-terminal")
const {Sequelize, DataTypes} = require("sequelize")


const sequelize = new Sequelize("postgresql://neondb_owner:npg_57ueVELgdYZD@ep-bitter-union-ac40n7zb-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
sequelize.authenticate().then(()=>console.log('conectado')).catch(error=>console.log(error.message))


const model = sequelize.define("leads", {
	nome:{
		type: DataTypes.STRING,
		allowNull: false
	},
	fone:{
		type: DataTypes.STRING,
		allowNull: false
	},
	fone_id:{
		type: DataTypes.STRING,
		allowNull: false
	},
	resposta:{
		type: DataTypes.STRING,
		allowNull: false
	}
})


//model.sync({force:true}).then(()=>console.log('tabela lead ceiada')).catch(error=>console.log(error.message))

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
	if(msg.from === "5521964987625@c.us" || msg.from === "5521986113683@c.us"){

	

		if(msg.hasMedia){
			
				const media = await msg.downloadMedia()
				await msg.reply("Recebi a planilha !")
			
		
			const buffer = Buffer.from(media.data, 'base64')
			const resp = await excel(buffer, {schema})
			const {rows} = resp
			rows.map(async(item, index)=>{
				
				//console.log(item.nome, item.telefone)
				try{
					const id = await client.getNumberId(item.telefone)
					const confere = await model.findAll({where:{fone_id:id._serialized}})
					
				
					
					
	//	console.log(id._serialized)
								//console.log(id._seialized)
					

						setTimeout(async()=>{
						//	if(!confere){
								
							
							await client.sendMessage(id._serialized,`Olá ${item.nome}! Aqui é da Leve Saúde. Você ainda está buscando um plano de saúde? Se sim, responda *SIM* para que eu possa te enviar mais informações.`)
						//console.log(`mensagem enviada para ${item.nome}`)
							await model.create({nome:item.nome, fone:item.telefone, fone_id:id._serialized, resposta:'NAO'})
							await msg.reply(`mensagem enviada para ${item.nome}`)
						//console.log(item.nome)
						///	}
						//	else{
							//	console.log("ja cadastrado")
						//	}
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
