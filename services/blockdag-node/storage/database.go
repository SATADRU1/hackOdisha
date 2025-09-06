package storage

import (
	"fmt"
	"time"

	"github.com/dgraph-io/badger/v4"
)

// Database interface for storage operations
type Database interface {
	Get(key string) ([]byte, error)
	Set(key string, value []byte) error
	Delete(key string) error
	Close() error
}

// BadgerDB implements Database using BadgerDB
type BadgerDB struct {
	db *badger.DB
}

// NewBadgerDB creates a new BadgerDB instance
func NewBadgerDB(path string) (*BadgerDB, error) {
	opts := badger.DefaultOptions(path)
	opts.Logger = nil // Disable logging for cleaner output

	db, err := badger.Open(opts)
	if err != nil {
		return nil, fmt.Errorf("failed to open BadgerDB: %v", err)
	}

	return &BadgerDB{db: db}, nil
}

// Get retrieves a value by key
func (b *BadgerDB) Get(key string) ([]byte, error) {
	var value []byte
	err := b.db.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(key))
		if err != nil {
			return err
		}

		return item.Value(func(val []byte) error {
			value = make([]byte, len(val))
			copy(value, val)
			return nil
		})
	})

	if err == badger.ErrKeyNotFound {
		return nil, fmt.Errorf("key not found: %s", key)
	}

	return value, err
}

// Set stores a key-value pair
func (b *BadgerDB) Set(key string, value []byte) error {
	return b.db.Update(func(txn *badger.Txn) error {
		return txn.Set([]byte(key), value)
	})
}

// Delete removes a key
func (b *BadgerDB) Delete(key string) error {
	return b.db.Update(func(txn *badger.Txn) error {
		return txn.Delete([]byte(key))
	})
}

// Close closes the database
func (b *BadgerDB) Close() error {
	return b.db.Close()
}

// RunGC runs garbage collection
func (b *BadgerDB) RunGC() error {
	return b.db.RunValueLogGC(0.5)
}

// GetStats returns database statistics
func (b *BadgerDB) GetStats() map[string]interface{} {
	lsmSize, vlogSize := b.db.Size()
	return map[string]interface{}{
		"lsm_size":  lsmSize,
		"vlog_size": vlogSize,
		"timestamp": time.Now().Unix(),
	}
}
