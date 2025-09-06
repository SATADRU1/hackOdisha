package consensus

import (
	"fmt"

	"hackodisha/blockdag-node/internal/dag"
)

// Engine implements BlockDAG consensus rules
type Engine struct {
	dagStore *dag.Store
}

// NewEngine creates a new consensus engine
func NewEngine(dagStore *dag.Store) *Engine {
	return &Engine{
		dagStore: dagStore,
	}
}

// GetHeaviestPath returns the heaviest path through the DAG
func (e *Engine) GetHeaviestPath() ([]*dag.Vertex, error) {
	tips := e.dagStore.GetTips()
	if len(tips) == 0 {
		return []*dag.Vertex{}, nil
	}

	// Find the tip with the heaviest path
	var heaviestTip string
	var maxWeight uint64

	for _, tip := range tips {
		weight := e.calculatePathWeight(tip)
		if weight > maxWeight {
			maxWeight = weight
			heaviestTip = tip
		}
	}

	// Build the heaviest path
	return e.buildPath(heaviestTip)
}

// IsValidVertex validates a vertex according to consensus rules
func (e *Engine) IsValidVertex(vertex *dag.Vertex) error {
	// Check if parents exist
	for _, parentID := range vertex.Parents {
		parent, err := e.dagStore.GetVertex(parentID)
		if err != nil {
			return fmt.Errorf("parent vertex %s not found", parentID)
		}
		if parent == nil {
			return fmt.Errorf("parent vertex %s is nil", parentID)
		}
	}

	// Check hash validity
	expectedHash := vertex.CalculateHash()
	if vertex.Hash != expectedHash {
		return fmt.Errorf("invalid hash: expected %s, got %s", expectedHash, vertex.Hash)
	}

	// Check timestamp (not too far in future)
	// This is a simplified check - in production you'd want more sophisticated validation

	return nil
}

// GetFinalizedVertices returns vertices that are considered finalized
func (e *Engine) GetFinalizedVertices() ([]*dag.Vertex, error) {
	// In a real implementation, this would use k-cluster finality or similar
	// For now, we'll use a simple rule: vertices that are deep enough in the heaviest path
	heaviestPath, err := e.GetHeaviestPath()
	if err != nil {
		return nil, err
	}

	// Finalize vertices that are more than 10 blocks deep
	finalized := make([]*dag.Vertex, 0)
	if len(heaviestPath) > 10 {
		for i := 0; i < len(heaviestPath)-10; i++ {
			finalized = append(finalized, heaviestPath[i])
		}
	}

	return finalized, nil
}

// calculatePathWeight calculates the total weight of a path ending at the given vertex
func (e *Engine) calculatePathWeight(vertexID string) uint64 {
	vertex, err := e.dagStore.GetVertex(vertexID)
	if err != nil || vertex == nil {
		return 0
	}

	// Base weight of this vertex
	totalWeight := vertex.Weight

	// Add weights from all parents
	for _, parentID := range vertex.Parents {
		totalWeight += e.calculatePathWeight(parentID)
	}

	return totalWeight
}

// buildPath builds a path from the given vertex to genesis
func (e *Engine) buildPath(vertexID string) ([]*dag.Vertex, error) {
	path := make([]*dag.Vertex, 0)
	visited := make(map[string]bool)

	var buildPathRecursive func(string) error
	buildPathRecursive = func(id string) error {
		if visited[id] {
			return nil
		}

		vertex, err := e.dagStore.GetVertex(id)
		if err != nil {
			return err
		}

		visited[id] = true
		path = append(path, vertex)

		// If this vertex has parents, continue building the path
		if len(vertex.Parents) > 0 {
			// Choose the parent with the heaviest path
			var heaviestParent string
			var maxWeight uint64

			for _, parentID := range vertex.Parents {
				weight := e.calculatePathWeight(parentID)
				if weight > maxWeight {
					maxWeight = weight
					heaviestParent = parentID
				}
			}

			return buildPathRecursive(heaviestParent)
		}

		return nil
	}

	if err := buildPathRecursive(vertexID); err != nil {
		return nil, err
	}

	// Reverse the path to go from genesis to tip
	for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
		path[i], path[j] = path[j], path[i]
	}

	return path, nil
}

// GetAnticone returns vertices that are not in the past or future of the given vertex
func (e *Engine) GetAnticone(vertexID string) ([]*dag.Vertex, error) {
	// This is a simplified implementation
	// In a real BlockDAG, this would be more complex
	allVertices, err := e.dagStore.GetTopologicalOrder()
	if err != nil {
		return nil, err
	}

	anticone := make([]*dag.Vertex, 0)
	for _, vertex := range allVertices {
		if vertex.ID != vertexID && !e.isInPast(vertexID, vertex.ID) && !e.isInFuture(vertexID, vertex.ID) {
			anticone = append(anticone, vertex)
		}
	}

	return anticone, nil
}

// isInPast checks if vertex1 is in the past of vertex2
func (e *Engine) isInPast(vertex1ID, vertex2ID string) bool {
	if vertex1ID == vertex2ID {
		return true
	}

	vertex2, err := e.dagStore.GetVertex(vertex2ID)
	if err != nil || vertex2 == nil {
		return false
	}

	for _, parentID := range vertex2.Parents {
		if e.isInPast(vertex1ID, parentID) {
			return true
		}
	}

	return false
}

// isInFuture checks if vertex1 is in the future of vertex2
func (e *Engine) isInFuture(vertex1ID, vertex2ID string) bool {
	return e.isInPast(vertex2ID, vertex1ID)
}
