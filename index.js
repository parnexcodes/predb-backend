var irc = require("irc");
var ircf = require("irc-formatting");

const fastify = require("fastify")({ logger: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

var client = new irc.Client("irc.corrupt-net.org", "parnexsurf", {
  channels: ["#Pre"],
  port: 6667,
});

client.addListener("message", async function (from, to, message) {
  let msg = ircf.parse(message);
  let pre_category = msg[2].text;
  let pre_title = msg[3].text.replace("]", "").trim();
  let pre_group = msg[3].text.split("-").pop();

  if (pre_category.includes("dupe") || pre_category.includes('repack') || pre_category.includes('proper') || pre_category.includes('proof')) {
    pre_title = pre_category;
    pre_category = "PRE";
    pre_group = "nuke";
  }

  if (
    pre_title.toLowerCase().includes("web.h264") || pre_title.toLowerCase().includes("hdtv.h264") &&
    pre_category.includes("PRE")
  ) {
    pre_category = "X264";
  }

  if (
    pre_title.toLowerCase().includes("web.h265") || pre_title.toLowerCase().includes("x265") &&
    pre_category.includes("PRE")
  ) {
    pre_category = "X265";
  }

  if (pre_title.includes("COMPLETE") || pre_title.includes("AVC")) {
    pre_category = "BLURAY";
  }

  if (pre_title.toLowerCase().includes("webflac")) {
    pre_category = "WEBFLAC";
  }

  const postPre = await prisma.pre.create({
    data: {
      preCategory: pre_category,
      preTitle: pre_title,
      preGroup: pre_group,
    },
  });
  // console.log(postPre)
});

// Declare a route
fastify.get("/", { prefix: "/api" }, async (request, reply) => {
  return {
    info: "Welcome to predb API.",
    endpoints: [
      {
        pre: "/api/pre",
      },
    ],
  };
});

fastify.get("/*", async (request, reply) => {
  return { error: "Undefined Endpoint" };
});

fastify.get("/api/pre", async (request, reply) => {
  let { order, page } = request.query;
  if (!page) {
    page = 0;
  }
  if (!order) {
    order = "desc";
  }
  if (order != "asc" && order != "desc") {
    order = "desc";
  }

  const getPre = await prisma.pre.findMany({
    skip: page * 20,
    take: 20,
    orderBy: {
      id: order,
    },
  });
  return { result: getPre };
});

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
