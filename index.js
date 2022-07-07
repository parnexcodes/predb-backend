var irc = require('irc');
var ircf = require('irc-formatting');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

var client = new irc.Client('irc.corrupt-net.org', 'parnexsurf', {
    channels: ['#Pre'],
    port: 6667
});

client.addListener('message', async function (from, to, message) {
    let msg = ircf.parse(message)
    let pre_category = msg[2].text
    let pre_title = msg[3].text.replace(']', '').trim()
    let pre_group = msg[3].text.split('-').pop()

    if (pre_title.toLowerCase().includes('web.h264') && pre_category.includes('PRE')) {
        pre_category = 'TV-X264'
    }

    if (pre_title.includes('COMPLETE')) {
        pre_category = 'BLURAY'
    }

    const pre = await prisma.pre.create({
        data: {
            preCategory: pre_category,
            preTitle: pre_title,
            preGroup: pre_group
        }
    })

    console.log(pre)

});