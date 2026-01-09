const { Client, GatewayIntentBits, Message } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

let currentVoiceConnection = null;
let currentChannelId = null;
const player = createAudioPlayer();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.once('ready', () => {
    console.log(`✅ Bot aktif: ${client.user.tag}`);
    console.log('🎵 Ses kanalına bağlanmak için ID girin...');
    askForChannelId();
});

function askForChannelId() {
    rl.question('🎵 Ses kanalı ID\'sini girin: ', async (channelId) => {
        if (!channelId.trim()) {
            console.log('❌ Kanal ID boş olamaz!');
            askForChannelId();
            return;
        }

        if (!/^\d+$/.test(channelId.trim())) {
            console.log('❌ Geçersiz kanal ID! Lütfen sayısal bir ID girin.');
            askForChannelId();
            return;
        }

        await connectToChannel(channelId.trim());
    });
}

async function connectToChannel(channelId) {
    try {
        let channelFound = false;
        let targetChannel = null;

        client.guilds.cache.forEach(guild => {
            const channel = guild.channels.cache.get(channelId);
            if (channel && channel.type === 2) {
                channelFound = true;
                targetChannel = channel;
            }
        });

        if (!targetChannel) {
            console.log('❌ Belirtilen kanal bulunamadı veya bu bir ses kanalı değil!');
            console.log('💡 Botun eriştiği sunucularda bu ID\'ye sahip bir ses kanalı yok.');
            askForChannelId();
            return;
        }

        if (currentVoiceConnection) {
            currentVoiceConnection.destroy();
            currentVoiceConnection = null;
        }

        currentVoiceConnection = joinVoiceChannel({
            channelId: targetChannel.id,
            guildId: targetChannel.guild.id,
            adapterCreator: targetChannel.guild.voiceAdapterCreator
        });

        currentChannelId = targetChannel.id;

        currentVoiceConnection.on('stateChange', (oldState, newState) => {
            console.log(`🔄 Voice connection state: ${oldState.status} -> ${newState.status}`);
        });

        currentVoiceConnection.on('error', (error) => {
            console.error('❌ Voice connection error:', error);
            setTimeout(() => {
                if (currentChannelId) {
                    connectToChannel(currentChannelId);
                }
            }, 5000);
        });

        currentVoiceConnection.on('disconnect', () => {
            console.log('🔌 Voice connection disconnected');
            setTimeout(() => {
                if (currentChannelId) {
                    connectToChannel(currentChannelId);
                }
            }, 1000);
        });

        console.log(`✅ "${targetChannel.name}" ses kanalına bağlandı! (Sunucu: ${targetChannel.guild.name})`);
        console.log('🎵 Bot 7/24 aktif kalacak...');
        console.log('📝 Başka bir kanala bağlanmak için yeni ID girin (çıkmak için Ctrl+C):');

        rl.question('\n🎵 Yeni ses kanalı ID\'si (boş bırakıp Enter = devam): ', async (newChannelId) => {
            if (newChannelId.trim()) {
                await connectToChannel(newChannelId.trim());
            } else {
                console.log('🎵 Mevcut kanalda devam ediliyor...');
                askForChannelId();
            }
        });

    } catch (error) {
        console.error('❌ Ses kanalına bağlanma hatası:', error);
        askForChannelId();
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('.dotnet tun')) {
        await handleDotnetTunCommand(message);
    }
});

async function handleDotnetTunCommand(message) {
    const args = message.content.split(' ');
    
    if (args.length < 3) {
        return message.reply('❌ Kullanım: `.dotnet tun <kanal_id>`\n\nÖrnek: `.dotnet tun 123456789012345678`\n\n💡 Botu CMD üzerinden başlatıp kanal ID\'si girerek de bağlanabilirsiniz!');
    }

    const channelId = args[2];
    
    if (!/^\d+$/.test(channelId)) {
        return message.reply('❌ Geçersiz kanal ID! Lütfen sayısal bir kanal ID girin.');
    }

    try {
        const channel = message.guild.channels.cache.get(channelId);
        
        if (!channel) {
            return message.reply('❌ Belirtilen kanal bulunamadı!');
        }

        if (channel.type !== 2) {
            return message.reply('❌ Bu bir ses kanalı değil!');
        }

        await joinVoiceChannelAndStay(channel, message);
        
    } catch (error) {
        console.error('Kanal bağlantı hatası:', error);
        message.reply('❌ Ses kanalına bağlanırken hata oluştu!');
    }
}

async function joinVoiceChannelAndStay(channel, message) {
    try {
        if (currentVoiceConnection) {
            currentVoiceConnection.destroy();
            currentVoiceConnection = null;
        }

        currentVoiceConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        currentChannelId = channel.id;

        currentVoiceConnection.on('stateChange', (oldState, newState) => {
            console.log(`Voice connection state: ${oldState.status} -> ${newState.status}`);
        });

        currentVoiceConnection.on('error', (error) => {
            console.error('Voice connection error:', error);
            setTimeout(() => {
                if (currentChannelId) {
                    const channel = client.channels.cache.get(currentChannelId);
                    if (channel) {
                        joinVoiceChannelAndStay(channel, null);
                    }
                }
            }, 5000);
        });

        currentVoiceConnection.on('disconnect', () => {
            console.log('Voice connection disconnected');
            setTimeout(() => {
                if (currentChannelId) {
                    const channel = client.channels.cache.get(currentChannelId);
                    if (channel) {
                        joinVoiceChannelAndStay(channel, null);
                    }
                }
            }, 1000);
        });

        message.reply(`✅ **${channel.name}** ses kanalına bağlandı ve 7/24 aktif kalacak! 🎵`);
        console.log(`🎵 Bot "${channel.name}" kanalına bağlandı (ID: ${channel.id})`);

    } catch (error) {
        console.error('Ses kanalına bağlanma hatası:', error);
        if (message) {
            message.reply('❌ Ses kanalına bağlanırken hata oluştu!');
        }
    }
}

async function joinVoiceChannelAndStay(channel, message) {
    try {
        if (currentVoiceConnection) {
            currentVoiceConnection.destroy();
            currentVoiceConnection = null;
        }

        currentVoiceConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        currentChannelId = channel.id;

        currentVoiceConnection.on('stateChange', (oldState, newState) => {
            console.log(`Voice connection state: ${oldState.status} -> ${newState.status}`);
        });

        currentVoiceConnection.on('error', (error) => {
            console.error('Voice connection error:', error);
            setTimeout(() => {
                if (currentChannelId) {
                    const channel = client.channels.cache.get(currentChannelId);
                    if (channel) {
                        joinVoiceChannelAndStay(channel, null);
                    }
                }
            }, 5000);
        });

        currentVoiceConnection.on('disconnect', () => {
            console.log('Voice connection disconnected');
            setTimeout(() => {
                if (currentChannelId) {
                    const channel = client.channels.cache.get(currentChannelId);
                    if (channel) {
                        joinVoiceChannelAndStay(channel, null);
                    }
                }
            }, 1000);
        });

        message.reply(`✅ **${channel.name}** ses kanalına bağlandı ve 7/24 aktif kalacak! 🎵`);
        console.log(`🎵 Bot "${channel.name}" kanalına bağlandı (ID: ${channel.id})`);

    } catch (error) {
        console.error('Ses kanalına bağlanma hatası:', error);
        if (message) {
            message.reply('❌ Ses kanalına bağlanırken hata oluştu!');
        }
    }
}

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

client.login(process.env.DISCORD_TOKEN);