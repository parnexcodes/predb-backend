const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPreGroup = async (fastify) => {
    fastify.get("/api/group", async (request, reply) => {
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
      
        const getPreGroup = await prisma.pre.findMany({
          skip: page * 20,
          take: 20,
          where: {
            preGroup: q
          },
          orderBy: {
            id: order,
          }
        })

        const getGroupRlsCount = await prisma.pre.findMany({
            where: {
                preGroup: q
            }
        })
        
        const totalPre = await prisma.pre.findMany()

        return { totalPre: totalPre.length, totalRls: getGroupRlsCount.length, result: getPreGroup };
      });
}

module.exports = getPreGroup