require('dotenv').config();
const Discord = require('discord.js')

module.exports = {
    commands: ['translate'],
    description: "Traduza palavras ou textos do inglês para o português",

    callback: async (message, arguments, text, client) => {

        const axios = require('axios')

        const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
        const BEARER_TOKEN = process.env.GPT;

        async function getGptResponse(message) {
            const payload = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You will be provided with a sentence in English, and your task is to translate it into Brazilian Portugues e você sempre responderá qualquer pergunta com o melhor da sua experiência, e formatará as resposta em markdown",
                    },
                    {
                        role: "user",
                        content: message.content.substring(11),
                    }
                ],
            };
        
            const headers = {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            };
        
            try {
                const response = await axios.post(API_ENDPOINT, payload, { headers: headers });

                return response.data.choices[0].message.content
                
            } catch (error) {
                console.error("Error calling the API:", error);
            }
        }

        // Test the function
        message.reply('Consultando o Duolingo ...').then( (resultMessage) => {
            getGptResponse(message).then(response => {

                embed = new Discord.MessageEmbed()
                .setTitle(`Segundo a Janet ...`)
                .setColor('random')
                .setTimestamp()
                .setDescription(response + ' \n')
                .setFooter(`Solicitado por ${message.author.username}`)
                
                resultMessage.edit('Sentença traduzida!')
                resultMessage.edit(embed)
            })
        })
    },
  }