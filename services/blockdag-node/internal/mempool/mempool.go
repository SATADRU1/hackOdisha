package mempool

import (
	"sort"
	"sync"
	"time"
)

// Transaction represents a transaction in the mempool
type Transaction struct {
	ID        string    `json:"id"`
	Data      []byte    `json:"data"`
	Timestamp time.Time `json:"timestamp"`
	Fee       uint64    `json:"fee"`
	Size      int       `json:"size"`
}

// Mempool manages pending transactions
type Mempool struct {
	mu           sync.RWMutex
	transactions map[string]*Transaction
	maxSize      int
}

// NewMempool creates a new mempool
func NewMempool(maxSize int) *Mempool {
	return &Mempool{
		transactions: make(map[string]*Transaction),
		maxSize:      maxSize,
	}
}

// AddTransaction adds a transaction to the mempool
func (m *Mempool) AddTransaction(tx *Transaction) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Check if mempool is full
	if len(m.transactions) >= m.maxSize {
		// Remove oldest transaction
		m.removeOldestTransaction()
	}

	// Check if transaction already exists
	if _, exists := m.transactions[tx.ID]; exists {
		return nil // Transaction already exists
	}

	m.transactions[tx.ID] = tx
	return nil
}

// GetTransaction retrieves a transaction by ID
func (m *Mempool) GetTransaction(id string) (*Transaction, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	tx, exists := m.transactions[id]
	return tx, exists
}

// RemoveTransaction removes a transaction from the mempool
func (m *Mempool) RemoveTransaction(id string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.transactions, id)
}

// GetTransactions returns all transactions in the mempool
func (m *Mempool) GetTransactions() []*Transaction {
	m.mu.RLock()
	defer m.mu.RUnlock()

	transactions := make([]*Transaction, 0, len(m.transactions))
	for _, tx := range m.transactions {
		transactions = append(transactions, tx)
	}

	// Sort by fee (highest first)
	sort.Slice(transactions, func(i, j int) bool {
		return transactions[i].Fee > transactions[j].Fee
	})

	return transactions
}

// GetTransactionCount returns the number of transactions in the mempool
func (m *Mempool) GetTransactionCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return len(m.transactions)
}

// Clear removes all transactions from the mempool
func (m *Mempool) Clear() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.transactions = make(map[string]*Transaction)
}

// removeOldestTransaction removes the oldest transaction
func (m *Mempool) removeOldestTransaction() {
	var oldestID string
	var oldestTime time.Time

	for id, tx := range m.transactions {
		if oldestID == "" || tx.Timestamp.Before(oldestTime) {
			oldestID = id
			oldestTime = tx.Timestamp
		}
	}

	if oldestID != "" {
		delete(m.transactions, oldestID)
	}
}
