const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSearch = async (fastify) => {
    fastify.get("/api/search", async (request, reply) => {
        let { q, page, order } = request.query
        if (!page) {
          page = 0;
        }
        if (!order) {
          order = "desc";
        }
        if (order != "asc" && order != "desc") {
          order = "desc";
        }
      
        const getPreSearch = await prisma.pre.findMany({
          skip: page * 20,
          take: 20,
          where: {
            preTitle: {
                contains: q
            }
          },
          orderBy: {
            id: order,
          },
        })

        const totalPre = await prisma.pre.findMany()

        return { totalPre: totalPre.length, result: getPreSearch };
      });
}

module.exports = getSearch