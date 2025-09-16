	
const {Client, LocalAuth, MessageMedia} = require("whatsapp-web.js")
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
  'nome': { prop: 'nome', type: String },
  'telefone': { prop: 'telefone', type: String }
}


/*const schema = {
    'telefone': {
      prop: 'telefone',
      type: String
    }
  }
*/

const client = new Client({
	 authStrategy: new LocalAuth(), // mantém sessão salva loc
	puppeteer: {
 	args: ['--no-sandbox', '--disable-setuid-sandbox']
 	}
 })


 client.on('qr', function(qr){
 	qrcode.generate(qr, {small:true})
 })

 client.on('ready', async()=>{
 	console.log('whatsapp ativo')
 	const chat = await client.getChats()
 	chat.map(item=>{
 		if(item.isGroup){
 			console.log(item.name)
 		}
 	})
 })

 client.on('message', async(msg)=>{
	if(msg.from === "5521964987625@c.us" || msg.from === "5521986113683@c.us"){

			
		const criativo = await MessageMedia.fromFilePath("./IMG-20250915-WA0570.jpg")
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
					//const confere = await model.findAll({where:{fone_id:id._serialized}})
					
				
					
					
	//	console.log(id._serialized)
								//console.log(id._seialized)
					

						setTimeout(async()=>{
						//	if(!confere){
								
						//	const nome_a = item.nome.toUpperCase()
						await client.sendMessage(id._serialized, `Olá! Sou Allan Souza, consultor da Leve Saúde. Recebi seu pedido de cotação e vou te ajudar com as melhores opções! 😊🩺\n\nPara começarmos, me envie, por favor:\n\n1️⃣ Quantas pessoas serão incluídas?\n2️⃣ Idade de cada uma?\n3️⃣ Seu bairro?\n4️⃣ Possui MEI ou CNPJ?\n\nAguardo para te enviar a cotação! 💬`)
					//	await client.sendMessage(id._serialized, criativo, {caption: '*Coleta domiciliar sem custo !*\n\nSou Allan, da *Leve Saúde*.\nNa cotação enviada, você já tem coleta domiciliar gratuita para exames.\nFechando conosco, o benefício é seu!\n\n👉 Me chame para conhecer outros *benefícios gratuitos*.'})
						//console.log(`mensagem enviada para ${item.nome}`)
						//	await model.create({nome:item.nome, fone:item.telefone, fone_id:id._serialized, resposta:'NAO'})
						//	const nome = await client.getContactById(id._serialized)
						//	console.log(nome)
							await msg.reply(`mensagem enviada ${item.nome}`)
							console.log(`mensagem enviada para ${item.nome} - ${item.telefone}`)
						//console.log(item.nome)
						///	}
						//	else{
							//	console.log("ja cadastrado")
						//	}
						}, 180000 * index)
				
				}
				catch(error){
					console.log(error)
				}
			})
		}
		
	}
 })	

 client.initialize()
