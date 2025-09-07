import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BlockDAGAdapter, getNetworkConfig } from '../adapters/blockdag';

// Helper function to safely log errors
const logError = (fastify: FastifyInstance, message: string, error: unknown) => {
  fastify.log.error(message);
  if (error instanceof Error) {
    fastify.log.error(error.message);
  } else {
    fastify.log.error(String(error));
  }
};

const NetworkSchema = z.object({
  network: z.string().optional().default('alpha'),
});

const VertexIdSchema = z.object({
  id: z.string(),
});

const TransactionSchema = z.object({
  data: z.string(),
});

export async function blockdagRoutes(fastify: FastifyInstance) {
  // Get BlockDAG status
  fastify.get('/status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const status = await adapter.getStatus();

      return {
        success: true,
        data: status,
        network: query.network,
      };
    } catch (error: unknown) {
      logError(fastify, 'Error fetching BlockDAG status:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch BlockDAG status',
      });
    }
  });

  // Get peers
  fastify.get('/peers', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const peers = await adapter.getPeers();

      return {
        success: true,
        data: peers,
        count: peers.length,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error fetching peers:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch peers',
      });
    }
  });

  // Get mempool
  fastify.get('/mempool', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const mempool = await adapter.getMempool();

      return {
        success: true,
        data: mempool,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error fetching mempool:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch mempool',
      });
    }
  });

  // Get vertices
  fastify.get('/vertices', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const vertices = await adapter.getVertices();

      return {
        success: true,
        data: vertices,
        count: vertices.length,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error fetching vertices:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch vertices',
      });
    }
  });

  // Get specific vertex
  fastify.get('/vertex/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = VertexIdSchema.parse(request.params);
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const vertex = await adapter.getVertex(params.id);

      return {
        success: true,
        data: vertex,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error fetching vertex:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch vertex',
      });
    }
  });

  // Get heaviest path
  fastify.get('/heaviest-path', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const path = await adapter.getHeaviestPath();

      return {
        success: true,
        data: path,
        count: path.length,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error fetching heaviest path:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch heaviest path',
      });
    }
  });

  // Submit transaction
  fastify.post('/transactions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = TransactionSchema.parse(request.body);
      const query = NetworkSchema.parse(request.query);
      const adapter = new BlockDAGAdapter(query.network);
      
      const result = await adapter.submitTransaction(body.data);

      return {
        success: true,
        data: result,
        network: query.network,
      };
    } catch (error) {
      logError(fastify, 'Error submitting transaction:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to submit transaction',
      });
    }
  });

  // RPC call
  fastify.post('/rpc', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { method, params, network } = request.body as any;
      const adapter = new BlockDAGAdapter(network || 'alpha');
      
      const result = await adapter.callRPC(method, params);

      return {
        success: true,
        data: result,
        method,
        network: network || 'alpha',
      };
    } catch (error) {
      logError(fastify, 'Error making RPC call:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to make RPC call',
      });
    }
  });

  // WebSocket connection info
  fastify.get('/websocket/info', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = NetworkSchema.parse(request.query);
      const config = getNetworkConfig(query.network);
      
      return {
        success: true,
        data: {
          url: `ws://${config.rpcUrl}/ws`,
          network: query.network,
          supportedEvents: [
            'new_block',
            'new_transaction',
            'peer_connected',
            'peer_disconnected',
            'mining_update',
          ],
        },
      };
    } catch (error) {
      logError(fastify, 'Error getting WebSocket info:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get WebSocket info',
      });
    }
  });
}
