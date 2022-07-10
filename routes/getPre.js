const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPre = async(fastify) => {
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
}

module.exports = getPre