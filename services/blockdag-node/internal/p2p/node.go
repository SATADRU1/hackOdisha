package p2p

import (
	"context"
	"fmt"
	"log"
	"net"
	"sync"
	"time"
)

// Node represents a P2P node in the BlockDAG network
type Node struct {
	address string
	peers   map[string]*Peer
	mu      sync.RWMutex
	server  net.Listener
}

// Peer represents a connected peer
type Peer struct {
	ID       string
	Address  string
	Conn     net.Conn
	LastSeen time.Time
}

// NewNode creates a new P2P node
func NewNode(address string) (*Node, error) {
	return &Node{
		address: address,
		peers:   make(map[string]*Peer),
	}, nil
}

// Start starts the P2P node
func (n *Node) Start(ctx context.Context) error {
	// Start listening for incoming connections
	listener, err := net.Listen("tcp", n.address)
	if err != nil {
		return fmt.Errorf("failed to listen on %s: %v", n.address, err)
	}
	n.server = listener

	log.Printf("P2P node listening on %s", n.address)

	// Accept incoming connections
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				conn, err := listener.Accept()
				if err != nil {
					if ctx.Err() != nil {
						return
					}
					log.Printf("Failed to accept connection: %v", err)
					continue
				}

				// Handle new connection
				go n.handleConnection(conn)
			}
		}
	}()

	// Start peer discovery and maintenance
	go n.peerMaintenance(ctx)

	return nil
}

// Stop stops the P2P node
func (n *Node) Stop() error {
	n.mu.Lock()
	defer n.mu.Unlock()

	// Close all peer connections
	for _, peer := range n.peers {
		peer.Conn.Close()
	}

	// Close server
	if n.server != nil {
		return n.server.Close()
	}

	return nil
}

// AddPeer adds a new peer
func (n *Node) AddPeer(address string) error {
	n.mu.Lock()
	defer n.mu.Unlock()

	// Check if peer already exists
	if _, exists := n.peers[address]; exists {
		return nil
	}

	// Connect to peer
	conn, err := net.DialTimeout("tcp", address, 5*time.Second)
	if err != nil {
		return fmt.Errorf("failed to connect to peer %s: %v", address, err)
	}

	peer := &Peer{
		ID:       generatePeerID(),
		Address:  address,
		Conn:     conn,
		LastSeen: time.Now(),
	}

	n.peers[address] = peer

	// Start handling this peer
	go n.handlePeer(peer)

	log.Printf("Connected to peer %s", address)
	return nil
}

// GetPeers returns all connected peers
func (n *Node) GetPeers() []*Peer {
	n.mu.RLock()
	defer n.mu.RUnlock()

	peers := make([]*Peer, 0, len(n.peers))
	for _, peer := range n.peers {
		peers = append(peers, peer)
	}
	return peers
}

// BroadcastMessage broadcasts a message to all peers
func (n *Node) BroadcastMessage(message []byte) error {
	n.mu.RLock()
	peers := make([]*Peer, 0, len(n.peers))
	for _, peer := range n.peers {
		peers = append(peers, peer)
	}
	n.mu.RUnlock()

	// Send message to all peers
	for _, peer := range peers {
		go func(p *Peer) {
			if err := n.sendMessage(p, message); err != nil {
				log.Printf("Failed to send message to peer %s: %v", p.Address, err)
			}
		}(peer)
	}

	return nil
}

// handleConnection handles a new incoming connection
func (n *Node) handleConnection(conn net.Conn) {
	defer conn.Close()

	// Create peer
	peer := &Peer{
		ID:       generatePeerID(),
		Address:  conn.RemoteAddr().String(),
		Conn:     conn,
		LastSeen: time.Now(),
	}

	// Add to peers
	n.mu.Lock()
	n.peers[peer.Address] = peer
	n.mu.Unlock()

	// Handle peer
	n.handlePeer(peer)

	// Remove from peers when done
	n.mu.Lock()
	delete(n.peers, peer.Address)
	n.mu.Unlock()
}

// handlePeer handles communication with a peer
func (n *Node) handlePeer(peer *Peer) {
	buffer := make([]byte, 4096)

	for {
		// Read message
		bytesRead, err := peer.Conn.Read(buffer)
		if err != nil {
			log.Printf("Error reading from peer %s: %v", peer.Address, err)
			return
		}

		// Update last seen
		peer.LastSeen = time.Now()

		// Process message
		message := buffer[:bytesRead]
		if err := n.processMessage(peer, message); err != nil {
			log.Printf("Error processing message from peer %s: %v", peer.Address, err)
		}
	}
}

// sendMessage sends a message to a peer
func (n *Node) sendMessage(peer *Peer, message []byte) error {
	_, err := peer.Conn.Write(message)
	return err
}

// processMessage processes a received message
func (n *Node) processMessage(peer *Peer, message []byte) error {
	// Simple message processing - in production, this would be more sophisticated
	log.Printf("Received message from peer %s: %s", peer.Address, string(message))
	return nil
}

// peerMaintenance maintains peer connections
func (n *Node) peerMaintenance(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			n.cleanupDeadPeers()
		}
	}
}

// cleanupDeadPeers removes peers that haven't been seen recently
func (n *Node) cleanupDeadPeers() {
	n.mu.Lock()
	defer n.mu.Unlock()

	cutoff := time.Now().Add(-5 * time.Minute)
	for address, peer := range n.peers {
		if peer.LastSeen.Before(cutoff) {
			peer.Conn.Close()
			delete(n.peers, address)
			log.Printf("Removed dead peer %s", address)
		}
	}
}

// generatePeerID generates a unique peer ID
func generatePeerID() string {
	return fmt.Sprintf("peer_%d", time.Now().UnixNano())
}
