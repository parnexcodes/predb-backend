var irc = require("irc");
var ircf = require("irc-formatting");

const fastify = require("fastify")({ logger: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

var client = new irc.Client("irc.opentrackers.org", "iota1476", {
  channels: ["#pre-zenet"]
});

client.addListener("message", async function (from, to, message) {
  let msg = ircf.parse(message);
  if (msg_arr[1].text == "PRE") {
    let pre_category = msg[3].text;
    let temp = msg[5].text.replace("(", "").trim()
    let pre_title = temp.substring(0, temp.lastIndexOf(")")) + ""
    let pre_group = pre_title.split("-").pop();

    const postPre = await prisma.pre.create({
      data: {
        preCategory: pre_category,
        preTitle: pre_title,
        preGroup: pre_group,
      },
    });
  }
});

// Declare a route
fastify.get("/", { prefix: "/api" }, async (request, reply) => {
  return {
    info: "Welcome to predb API.",
    endpoints: [
      {
        pre: "/api/pre",
        cat: "/api/cat?q={category_name}",
        group: "/api/group?q={group_name}",
        search: "/api/search?q={search_query}"
      },
    ],
  };
});

fastify.get("/*", async (request, reply) => {
  return { error: "Undefined Endpoint" };
});

// Import the Routes
const getPre = require('./routes/getPre')
const getCat = require('./routes/getCat')
const getGroup = require('./routes/getGroup')
const getSearch = require('./routes/getSearch')

// Register the Routes
fastify.register(getPre)
fastify.register(getCat)
fastify.register(getGroup)
fastify.register(getSearch)

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
