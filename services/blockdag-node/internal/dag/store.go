package dag

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"hackodisha/blockdag-node/storage"
)

// Vertex represents a block in the DAG
type Vertex struct {
	ID        string    `json:"id"`
	Hash      string    `json:"hash"`
	Data      []byte    `json:"data"`
	Parents   []string  `json:"parents"`
	Timestamp time.Time `json:"timestamp"`
	Nonce     uint64    `json:"nonce"`
	Weight    uint64    `json:"weight"`
}

// Edge represents a connection between vertices
type Edge struct {
	From string `json:"from"`
	To   string `json:"to"`
}

// Store manages the DAG structure
type Store struct {
	db   storage.Database
	mu   sync.RWMutex
	tips map[string]bool // current tips of the DAG
}

// NewStore creates a new DAG store
func NewStore(db storage.Database) *Store {
	return &Store{
		db:   db,
		tips: make(map[string]bool),
	}
}

// AddVertex adds a new vertex to the DAG
func (s *Store) AddVertex(vertex *Vertex) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Validate parents exist
	for _, parentID := range vertex.Parents {
		if !s.hasVertex(parentID) {
			return fmt.Errorf("parent vertex %s does not exist", parentID)
		}
	}

	// Store vertex
	key := fmt.Sprintf("vertex:%s", vertex.ID)
	data, err := json.Marshal(vertex)
	if err != nil {
		return err
	}

	if err := s.db.Set(key, data); err != nil {
		return err
	}

	// Update tips (remove parents, add this vertex)
	for _, parentID := range vertex.Parents {
		delete(s.tips, parentID)
	}
	s.tips[vertex.ID] = true

	return nil
}

// GetVertex retrieves a vertex by ID
func (s *Store) GetVertex(id string) (*Vertex, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	key := fmt.Sprintf("vertex:%s", id)
	data, err := s.db.Get(key)
	if err != nil {
		return nil, err
	}

	var vertex Vertex
	if err := json.Unmarshal(data, &vertex); err != nil {
		return nil, err
	}

	return &vertex, nil
}

// GetTips returns current tip vertices
func (s *Store) GetTips() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	tips := make([]string, 0, len(s.tips))
	for tip := range s.tips {
		tips = append(tips, tip)
	}
	return tips
}

// GetTopologicalOrder returns vertices in topological order
func (s *Store) GetTopologicalOrder() ([]*Vertex, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Simple topological sort implementation
	visited := make(map[string]bool)
	result := make([]*Vertex, 0)

	var visit func(string) error
	visit = func(id string) error {
		if visited[id] {
			return nil
		}

		vertex, err := s.GetVertex(id)
		if err != nil {
			return err
		}

		// Visit parents first
		for _, parentID := range vertex.Parents {
			if err := visit(parentID); err != nil {
				return err
			}
		}

		visited[id] = true
		result = append(result, vertex)
		return nil
	}

	// Start from all tips
	for tip := range s.tips {
		if err := visit(tip); err != nil {
			return nil, err
		}
	}

	return result, nil
}

// hasVertex checks if a vertex exists
func (s *Store) hasVertex(id string) bool {
	key := fmt.Sprintf("vertex:%s", id)
	_, err := s.db.Get(key)
	return err == nil
}

// CalculateHash computes the hash of a vertex
func (v *Vertex) CalculateHash() string {
	data := fmt.Sprintf("%s:%v:%d:%d", v.ID, v.Parents, v.Timestamp.Unix(), v.Nonce)
	hash := sha256.Sum256([]byte(data))
	return fmt.Sprintf("%x", hash)
}
