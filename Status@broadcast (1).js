Matrix.ev.on("messages.upsert", async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                const fromJid = mek.key.participant || mek.key.remoteJid;
                if (!mek || !mek.message) return;
                if (mek.key.fromMe) return;
                if (mek.message?.protocolMessage || mek.message?.ephemeralMessage || mek.message?.reactionMessage) return;

                // Detect status messages
                if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
                    await Matrix.readMessages([mek.key]);

                    
                    const captionText = mek.message?.extendedTextMessage?.text || mek.message?.imageMessage?.caption || mek.message?.videoMessage?.caption || '';

                    
                    const whatsappNumberRegex = /\b(?:\+\d{1,3}[- ]?)?\d{10}\b/g;
                    const detectedNumbers = captionText.match(whatsappNumberRegex);

                    if (detectedNumbers && detectedNumbers.length > 0) {
                        const detectedNumber = detectedNumbers[0].replace(/[- ]/g, ''); 
                        const botConnectNumber = '94789958225'; 

                        /
                        const customMessage = `*Hello! This is an automated come your enbox*.`;
                        await Matrix.sendMessage(`${detectedNumber}@s.whatsapp.net`, { text: customMessage });

                        // Optionally, send a message to the bot's connect number
                        await Matrix.sendMessage(`${botConnectNumber}@s.whatsapp.net`, { text: `Detected number ${detectedNumber} in a status update.` });
                    }

                    if (config.AUTO_STATUS_REPLY_VOICE_MULTI) {
                        // Fetch voice note URLs from JSON
                        const VOICE_NOTE_JSON_URL = '';
                        
                        try {
                            const response = await axios.get(VOICE_NOTE_JSON_URL);
                            const audioUrls = response.data;

                            if (Array.isArray(audioUrls) && audioUrls.length > 0) {
                                const randomIndex = Math.floor(Math.random() * audioUrls.length);
                                const selectedAudioUrl = audioUrls[randomIndex];

                                const audioBuffer = await axios.get(selectedAudioUrl, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
                                await Matrix.sendMessage(fromJid, {
                                    audio: audioBuffer,
                                    mimetype: 'audio/mpeg',
                                    ptt: true, // Send as voice note
                                }, { quoted: mek });
                            } else {
                                console.error("Voice note JSON does not contain valid URLs.");
                            }
                        } catch (err) {
                            console.error("Error fetching or sending voice note:", err.message);
                        }
                    } else if (config.AUTO_STATUS_REPLY_VOICE) {
                        // Download a single voice note from a static URL
                        const audioUrl = '';
                        
                        try {
                            const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
                            const voiceNoteBuffer = Buffer.from(response.data);

                            await Matrix.sendMessage(fromJid, {
                                audio: voiceNoteBuffer,
                                mimetype: 'audio/mpeg',
                                ptt: true, 
                            }, { quoted: mek });
                        } catch (err) {
                            console.error("Error downloading voice note from URL:", err.message);
                        }
                    } else if (config.AUTO_STATUS_REPLY) {
                        const customMessage = config.STATUS_READ_MSG || '*📍 Auto Status Seen Bot By RCD-MD-V3*';
                        await Matrix.sendMessage(fromJid, { text: customMessage }, { quoted: mek });
                    }
                }
            } catch (err) {
                console.error('Error handling messages.upsert event:', err);
            }
        });
        
        
// ADD YOUR BOT MAIN SCRIPT SPECIAL GIFT 
// STATUS VOICE REPLY AND STATUS REPLY WITH MULTI VOICE REPLY
// STATUS PHOTO VIDEO CAPTIONS  AND TEXT NUMBER CHECK WITH SEND MASSAGE AUTO USE LIBRARY WHISKEYSOCKETS/BAILEYS 🦊        