const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getCat = async (fastify) => {
    fastify.get("/api/cat", async (request, reply) => {
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
      
        const getPreCat = await prisma.pre.findMany({
          skip: page * 20,
          take: 20,
          where: {
            preCategory: q
          },
          orderBy: {
            id: order,
          }
        })

        const getCatRlsCount = await prisma.pre.findMany({
            where: {
                preCategory: q
            }
        })

        return { totalRls: getCatRlsCount.length, result: getPreCat };
      });
}

module.exports = getCat