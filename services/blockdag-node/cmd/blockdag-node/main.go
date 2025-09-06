package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"hackodisha/blockdag-node/internal/consensus"
	"hackodisha/blockdag-node/internal/dag"
	"hackodisha/blockdag-node/internal/mempool"
	"hackodisha/blockdag-node/internal/miner"
	"hackodisha/blockdag-node/internal/p2p"
	"hackodisha/blockdag-node/internal/rpc"
	"hackodisha/blockdag-node/storage"
)

func main() {
	// Initialize storage
	db, err := storage.NewBadgerDB("./data/blockdag")
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}
	defer db.Close()

	// Initialize DAG store
	dagStore := dag.NewStore(db)

	// Initialize consensus engine
	consensusEngine := consensus.NewEngine(dagStore)

	// Initialize mempool
	mempool := mempool.NewMempool(10000) // 10k tx capacity

	// Initialize miner
	miner := miner.NewMiner(dagStore, consensusEngine, mempool)

	// Initialize P2P network
	p2pNode, err := p2p.NewNode("0.0.0.0:4001")
	if err != nil {
		log.Fatalf("Failed to initialize P2P node: %v", err)
	}

	// Initialize RPC server
	rpcServer := rpc.NewServer(dagStore, consensusEngine, mempool, miner, p2pNode)

	// Start services
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Start P2P node
	go func() {
		if err := p2pNode.Start(ctx); err != nil {
			log.Printf("P2P node error: %v", err)
		}
	}()

	// Start miner
	go func() {
		if err := miner.Start(ctx); err != nil {
			log.Printf("Miner error: %v", err)
		}
	}()

	// Start RPC server
	go func() {
		log.Println("Starting RPC server on :8080")
		if err := rpcServer.Start(":8080"); err != nil && err != http.ErrServerClosed {
			log.Printf("RPC server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down...")
	cancel()

	// Graceful shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := rpcServer.Shutdown(shutdownCtx); err != nil {
		log.Printf("RPC server shutdown error: %v", err)
	}

	log.Println("BlockDAG node stopped")
}
