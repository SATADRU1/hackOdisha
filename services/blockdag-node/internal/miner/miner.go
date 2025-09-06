package miner

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"
	"sync"
	"time"

	"hackodisha/blockdag-node/internal/consensus"
	"hackodisha/blockdag-node/internal/dag"
	"hackodisha/blockdag-node/internal/mempool"
)

// Miner implements Proof of Work mining for BlockDAG
type Miner struct {
	dagStore        *dag.Store
	consensusEngine *consensus.Engine
	mempool         *mempool.Mempool
	target          *big.Int
	mu              sync.RWMutex
	mining          bool
	stopChan        chan struct{}
}

// NewMiner creates a new miner
func NewMiner(dagStore *dag.Store, consensusEngine *consensus.Engine, mempool *mempool.Mempool) *Miner {
	// Set a simple target (in production, this would be dynamic)
	target := big.NewInt(1)
	target.Lsh(target, 256-16) // 16 leading zeros

	return &Miner{
		dagStore:        dagStore,
		consensusEngine: consensusEngine,
		mempool:         mempool,
		target:          target,
		stopChan:        make(chan struct{}),
	}
}

// Start begins the mining process
func (m *Miner) Start(ctx context.Context) error {
	m.mu.Lock()
	if m.mining {
		m.mu.Unlock()
		return fmt.Errorf("miner is already running")
	}
	m.mining = true
	m.mu.Unlock()

	log.Println("Starting miner...")

	for {
		select {
		case <-ctx.Done():
			m.mu.Lock()
			m.mining = false
			m.mu.Unlock()
			return ctx.Err()
		case <-m.stopChan:
			m.mu.Lock()
			m.mining = false
			m.mu.Unlock()
			return nil
		default:
			if err := m.mineBlock(); err != nil {
				log.Printf("Mining error: %v", err)
				time.Sleep(1 * time.Second)
			}
		}
	}
}

// Stop stops the mining process
func (m *Miner) Stop() {
	select {
	case m.stopChan <- struct{}{}:
	default:
	}
}

// IsMining returns whether the miner is currently mining
func (m *Miner) IsMining() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.mining
}

// mineBlock attempts to mine a new block
func (m *Miner) mineBlock() error {
	// Get current tips
	tips := m.dagStore.GetTips()

	// Get transactions from mempool
	transactions := m.mempool.GetTransactions()
	if len(transactions) == 0 {
		// No transactions to mine, wait a bit
		time.Sleep(100 * time.Millisecond)
		return nil
	}

	// Create new vertex
	vertex := &dag.Vertex{
		ID:        generateVertexID(),
		Parents:   tips,
		Timestamp: time.Now(),
		Weight:    1, // Base weight
	}

	// Add transaction data
	vertex.Data = m.packTransactions(transactions)

	// Mine the block (find nonce)
	nonce, err := m.findNonce(vertex)
	if err != nil {
		return err
	}

	vertex.Nonce = nonce
	vertex.Hash = vertex.CalculateHash()

	// Validate the vertex
	if err := m.consensusEngine.IsValidVertex(vertex); err != nil {
		return fmt.Errorf("invalid vertex: %v", err)
	}

	// Add to DAG
	if err := m.dagStore.AddVertex(vertex); err != nil {
		return fmt.Errorf("failed to add vertex: %v", err)
	}

	// Remove mined transactions from mempool
	for _, tx := range transactions {
		m.mempool.RemoveTransaction(tx.ID)
	}

	log.Printf("Mined block %s with nonce %d", vertex.ID, nonce)
	return nil
}

// findNonce finds a valid nonce for the vertex
func (m *Miner) findNonce(vertex *dag.Vertex) (uint64, error) {
	// Simple PoW implementation
	for nonce := uint64(0); nonce < 1000000; nonce++ {
		vertex.Nonce = nonce
		hash := vertex.CalculateHash()

		// Convert hash to big.Int
		hashBytes, err := hex.DecodeString(hash)
		if err != nil {
			continue
		}

		hashInt := new(big.Int).SetBytes(hashBytes)

		// Check if hash meets target
		if hashInt.Cmp(m.target) < 0 {
			return nonce, nil
		}
	}

	return 0, fmt.Errorf("could not find valid nonce")
}

// packTransactions packs transactions into vertex data
func (m *Miner) packTransactions(transactions []*mempool.Transaction) []byte {
	// Simple packing - in production, this would be more sophisticated
	data := make([]byte, 0)
	for _, tx := range transactions {
		data = append(data, tx.Data...)
	}
	return data
}

// generateVertexID generates a unique vertex ID
func generateVertexID() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	hash := sha256.Sum256(bytes)
	return hex.EncodeToString(hash[:8])
}

// GetMiningStats returns current mining statistics
func (m *Miner) GetMiningStats() map[string]interface{} {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return map[string]interface{}{
		"mining":       m.mining,
		"target":       m.target.Text(16),
		"mempool_size": m.mempool.GetTransactionCount(),
		"current_tips": len(m.dagStore.GetTips()),
	}
}
