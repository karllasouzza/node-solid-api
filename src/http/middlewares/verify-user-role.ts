import type { FastifyRequest, FastifyReply } from "fastify";

export function verifyUserRole(roletoVerify: "ADMIN" | "MEMBER") {
  return (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roletoVerify) {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }
  };
}
