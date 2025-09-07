package rpc

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"hackodisha/blockdag-node/internal/consensus"
	"hackodisha/blockdag-node/internal/dag"
	"hackodisha/blockdag-node/internal/mempool"
	"hackodisha/blockdag-node/internal/miner"
	"hackodisha/blockdag-node/internal/p2p"
)

// Server provides JSON-RPC and WebSocket endpoints
type Server struct {
	dagStore        *dag.Store
	consensusEngine *consensus.Engine
	mempool         *mempool.Mempool
	miner           *miner.Miner
	p2pNode         *p2p.Node
	server          *http.Server
}

// NewServer creates a new RPC server
func NewServer(dagStore *dag.Store, consensusEngine *consensus.Engine, mempool *mempool.Mempool, miner *miner.Miner, p2pNode *p2p.Node) *Server {
	return &Server{
		dagStore:        dagStore,
		consensusEngine: consensusEngine,
		mempool:         mempool,
		miner:           miner,
		p2pNode:         p2pNode,
	}
}

// Start starts the RPC server
func (s *Server) Start(address string) error {
	mux := http.NewServeMux()

	// JSON-RPC endpoints
	mux.HandleFunc("/rpc", s.handleJSONRPC)
	mux.HandleFunc("/rpc/", s.handleJSONRPC)

	// REST endpoints
	mux.HandleFunc("/api/v1/status", s.handleStatus)
	mux.HandleFunc("/api/v1/peers", s.handlePeers)
	mux.HandleFunc("/api/v1/mempool", s.handleMempool)
	mux.HandleFunc("/api/v1/vertices", s.handleVertices)
	mux.HandleFunc("/api/v1/vertex/", s.handleVertex)

	// WebSocket endpoint
	mux.HandleFunc("/ws", s.handleWebSocket)

	s.server = &http.Server{
		Addr:    address,
		Handler: mux,
	}

	log.Printf("RPC server starting on %s", address)
	return s.server.ListenAndServe()
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown(ctx context.Context) error {
	if s.server != nil {
		return s.server.Shutdown(ctx)
	}
	return nil
}

// handleJSONRPC handles JSON-RPC requests
func (s *Server) handleJSONRPC(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		JSONRPC string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params"`
		ID      interface{} `json:"id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		s.sendJSONRPCError(w, request.ID, -32700, "Parse error", nil)
		return
	}

	// Handle different methods
	var result interface{}
	var err error

	switch request.Method {
	case "blockdag_getStatus":
		result, err = s.getStatus()
	case "blockdag_getPeers":
		result, err = s.getPeers()
	case "blockdag_getMempool":
		result, err = s.getMempool()
	case "blockdag_getVertices":
		result, err = s.getVertices()
	case "blockdag_getVertex":
		if params, ok := request.Params.(map[string]interface{}); ok {
			if id, ok := params["id"].(string); ok {
				result, err = s.getVertex(id)
			} else {
				err = fmt.Errorf("missing or invalid vertex ID")
			}
		} else {
			err = fmt.Errorf("invalid parameters")
		}
	case "blockdag_getHeaviestPath":
		result, err = s.getHeaviestPath()
	case "blockdag_submitTransaction":
		if params, ok := request.Params.(map[string]interface{}); ok {
			if data, ok := params["data"].(string); ok {
				result, err = s.submitTransaction(data)
			} else {
				err = fmt.Errorf("missing or invalid transaction data")
			}
		} else {
			err = fmt.Errorf("invalid parameters")
		}
	default:
		err = fmt.Errorf("unknown method: %s", request.Method)
	}

	if err != nil {
		s.sendJSONRPCError(w, request.ID, -32603, "Internal error", err.Error())
		return
	}

	s.sendJSONRPCSuccess(w, request.ID, result)
}

// handleStatus handles status requests
func (s *Server) handleStatus(w http.ResponseWriter, r *http.Request) {
	status, err := s.getStatus()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

// handlePeers handles peer list requests
func (s *Server) handlePeers(w http.ResponseWriter, r *http.Request) {
	peers, err := s.getPeers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(peers)
}

// handleMempool handles mempool requests
func (s *Server) handleMempool(w http.ResponseWriter, r *http.Request) {
	mempool, err := s.getMempool()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mempool)
}

// handleVertices handles vertex list requests
func (s *Server) handleVertices(w http.ResponseWriter, r *http.Request) {
	vertices, err := s.getVertices()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vertices)
}

// handleVertex handles individual vertex requests
func (s *Server) handleVertex(w http.ResponseWriter, r *http.Request) {
	// Extract vertex ID from URL path
	vertexID := r.URL.Path[len("/api/v1/vertex/"):]
	if vertexID == "" {
		http.Error(w, "Missing vertex ID", http.StatusBadRequest)
		return
	}

	vertex, err := s.getVertex(vertexID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vertex)
}

// handleWebSocket handles WebSocket connections
func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// For now, return a simple JSON response to avoid 501 errors
	// This allows Studio service to connect without crashing
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := map[string]interface{}{
		"status":    "WebSocket endpoint available but not fully implemented",
		"message":   "This is a placeholder response to prevent connection errors",
		"timestamp": time.Now().Unix(),
	}

	json.NewEncoder(w).Encode(response)
}

// JSON-RPC helper methods
func (s *Server) sendJSONRPCSuccess(w http.ResponseWriter, id interface{}, result interface{}) {
	response := map[string]interface{}{
		"jsonrpc": "2.0",
		"result":  result,
		"id":      id,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) sendJSONRPCError(w http.ResponseWriter, id interface{}, code int, message string, data interface{}) {
	response := map[string]interface{}{
		"jsonrpc": "2.0",
		"error": map[string]interface{}{
			"code":    code,
			"message": message,
		},
		"id": id,
	}

	if data != nil {
		response["error"].(map[string]interface{})["data"] = data
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// RPC method implementations
func (s *Server) getStatus() (map[string]interface{}, error) {
	miningStats := s.miner.GetMiningStats()
	peers := s.p2pNode.GetPeers()

	return map[string]interface{}{
		"status":       "running",
		"timestamp":    time.Now().Unix(),
		"mining":       miningStats["mining"],
		"peers_count":  len(peers),
		"mempool_size": miningStats["mempool_size"],
		"current_tips": miningStats["current_tips"],
	}, nil
}

func (s *Server) getPeers() ([]map[string]interface{}, error) {
	peers := s.p2pNode.GetPeers()
	result := make([]map[string]interface{}, len(peers))

	for i, peer := range peers {
		result[i] = map[string]interface{}{
			"id":        peer.ID,
			"address":   peer.Address,
			"last_seen": peer.LastSeen.Unix(),
		}
	}

	return result, nil
}

func (s *Server) getMempool() (map[string]interface{}, error) {
	transactions := s.mempool.GetTransactions()
	txList := make([]map[string]interface{}, len(transactions))

	for i, tx := range transactions {
		txList[i] = map[string]interface{}{
			"id":        tx.ID,
			"size":      tx.Size,
			"fee":       tx.Fee,
			"timestamp": tx.Timestamp.Unix(),
		}
	}

	return map[string]interface{}{
		"count":        len(transactions),
		"transactions": txList,
	}, nil
}

func (s *Server) getVertices() ([]map[string]interface{}, error) {
	vertices, err := s.dagStore.GetTopologicalOrder()
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, len(vertices))
	for i, vertex := range vertices {
		result[i] = map[string]interface{}{
			"id":        vertex.ID,
			"hash":      vertex.Hash,
			"parents":   vertex.Parents,
			"timestamp": vertex.Timestamp.Unix(),
			"weight":    vertex.Weight,
		}
	}

	return result, nil
}

func (s *Server) getVertex(id string) (map[string]interface{}, error) {
	vertex, err := s.dagStore.GetVertex(id)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"id":        vertex.ID,
		"hash":      vertex.Hash,
		"data":      string(vertex.Data),
		"parents":   vertex.Parents,
		"timestamp": vertex.Timestamp.Unix(),
		"nonce":     vertex.Nonce,
		"weight":    vertex.Weight,
	}, nil
}

func (s *Server) getHeaviestPath() ([]map[string]interface{}, error) {
	path, err := s.consensusEngine.GetHeaviestPath()
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, len(path))
	for i, vertex := range path {
		result[i] = map[string]interface{}{
			"id":        vertex.ID,
			"hash":      vertex.Hash,
			"timestamp": vertex.Timestamp.Unix(),
			"weight":    vertex.Weight,
		}
	}

	return result, nil
}

func (s *Server) submitTransaction(data string) (map[string]interface{}, error) {
	// Create transaction
	tx := &mempool.Transaction{
		ID:        fmt.Sprintf("tx_%d", time.Now().UnixNano()),
		Data:      []byte(data),
		Timestamp: time.Now(),
		Fee:       1000, // Default fee
		Size:      len(data),
	}

	// Add to mempool
	if err := s.mempool.AddTransaction(tx); err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"txid":    tx.ID,
		"status":  "accepted",
		"message": "Transaction added to mempool",
	}, nil
}
