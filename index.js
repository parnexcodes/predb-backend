var irc = require("irc");
var ircf = require("irc-formatting");

const fastify = require("fastify")({ logger: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

var client = new irc.Client("irc.corrupt-net.org", "iota1476", {
  channels: ["#pre"],
  port: 6667
});

client.addListener("message", async function (from, to, message) {
  let msg = ircf.parse(message);
  if (msg[0].text == "PRE:") {
    let pre_category = msg[2].text;
    let pre_title = msg[3].text.replace("]", "").trim();
    let pre_group = msg[3].text.split("-").pop();

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
