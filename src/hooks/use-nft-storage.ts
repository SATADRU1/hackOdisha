import { useState, useEffect } from 'react';
import { GeneratedNFT } from '@/lib/nft-generator';
import { useToast } from './use-toast';

const NFT_STORAGE_KEY = 'hackodisha_user_nfts';

export interface StoredNFT extends GeneratedNFT {
  userId?: string;
  earnedAt: string;
}

export function useNFTStorage(userId?: string) {
  const [nfts, setNfts] = useState<StoredNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load NFTs from localStorage on mount
  useEffect(() => {
    loadNFTs();
  }, [userId]);

  const loadNFTs = () => {
    try {
      setIsLoading(true);
      const storedNFTs = localStorage.getItem(NFT_STORAGE_KEY);
      
      if (storedNFTs) {
        const parsedNFTs: StoredNFT[] = JSON.parse(storedNFTs);
        
        // Filter NFTs for current user if userId provided
        const userNFTs = userId 
          ? parsedNFTs.filter(nft => nft.userId === userId)
          : parsedNFTs;
        
        setNfts(userNFTs.sort((a, b) => b.timestamp - a.timestamp)); // Latest first
      } else {
        setNfts([]);
      }
    } catch (error) {
      console.error('Error loading NFTs from storage:', error);
      setNfts([]);
      toast({
        title: "Storage Error",
        description: "Could not load your NFT collection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNFT = (nft: GeneratedNFT): StoredNFT => {
    try {
      const storedNFT: StoredNFT = {
        ...nft,
        userId,
        earnedAt: new Date().toISOString(),
      };

      // Get existing NFTs from storage
      const existingNFTs: StoredNFT[] = [];
      const storedData = localStorage.getItem(NFT_STORAGE_KEY);
      
      if (storedData) {
        existingNFTs.push(...JSON.parse(storedData));
      }

      // Add new NFT
      const updatedNFTs = [storedNFT, ...existingNFTs];
      
      // Save to localStorage
      localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(updatedNFTs));
      
      // Update local state
      const userNFTs = userId 
        ? updatedNFTs.filter(nft => nft.userId === userId)
        : updatedNFTs;
      
      setNfts(userNFTs.sort((a, b) => b.timestamp - a.timestamp));
      
      toast({
        title: "NFT Saved",
        description: `"${nft.name}" has been added to your collection!`,
      });

      return storedNFT;
    } catch (error) {
      console.error('Error saving NFT:', error);
      toast({
        title: "Save Failed",
        description: "Could not save NFT to your collection",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteNFT = (nftId: string) => {
    try {
      // Get all NFTs from storage
      const storedData = localStorage.getItem(NFT_STORAGE_KEY);
      if (!storedData) return;
      
      const allNFTs: StoredNFT[] = JSON.parse(storedData);
      
      // Remove the specific NFT
      const updatedAllNFTs = allNFTs.filter(nft => nft.id !== nftId);
      
      // Save back to localStorage
      localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(updatedAllNFTs));
      
      // Update local state
      const userNFTs = userId 
        ? updatedAllNFTs.filter(nft => nft.userId === userId)
        : updatedAllNFTs;
      
      setNfts(userNFTs.sort((a, b) => b.timestamp - a.timestamp));
      
      toast({
        title: "NFT Removed",
        description: "NFT has been removed from your collection",
      });
    } catch (error) {
      console.error('Error deleting NFT:', error);
      toast({
        title: "Delete Failed",
        description: "Could not remove NFT from collection",
        variant: "destructive",
      });
    }
  };

  const clearAllNFTs = () => {
    try {
      if (userId) {
        // Get all NFTs and remove only current user's NFTs
        const storedData = localStorage.getItem(NFT_STORAGE_KEY);
        if (storedData) {
          const allNFTs: StoredNFT[] = JSON.parse(storedData);
          const otherUsersNFTs = allNFTs.filter(nft => nft.userId !== userId);
          localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(otherUsersNFTs));
        }
      } else {
        // Clear all NFTs
        localStorage.removeItem(NFT_STORAGE_KEY);
      }
      
      setNfts([]);
      
      toast({
        title: "Collection Cleared",
        description: "All NFTs have been removed from your collection",
      });
    } catch (error) {
      console.error('Error clearing NFTs:', error);
      toast({
        title: "Clear Failed",
        description: "Could not clear NFT collection",
        variant: "destructive",
      });
    }
  };

  const getNFTById = (nftId: string): StoredNFT | undefined => {
    return nfts.find(nft => nft.id === nftId);
  };

  const getTotalNFTs = (): number => {
    return nfts.length;
  };

  const getRecentNFTs = (limit: number = 5): StoredNFT[] => {
    return nfts.slice(0, limit);
  };

  const exportNFTs = (): string => {
    return JSON.stringify(nfts, null, 2);
  };

  const importNFTs = (jsonData: string) => {
    try {
      const importedNFTs: StoredNFT[] = JSON.parse(jsonData);
      
      // Validate imported data
      const validNFTs = importedNFTs.filter(nft => 
        nft.id && nft.name && nft.image && nft.timestamp
      );
      
      if (validNFTs.length === 0) {
        throw new Error('No valid NFTs found in import data');
      }
      
      // Get existing NFTs
      const storedData = localStorage.getItem(NFT_STORAGE_KEY);
      const existingNFTs: StoredNFT[] = storedData ? JSON.parse(storedData) : [];
      
      // Merge with existing, avoiding duplicates
      const existingIds = new Set(existingNFTs.map(nft => nft.id));
      const newNFTs = validNFTs.filter(nft => !existingIds.has(nft.id));
      
      if (newNFTs.length === 0) {
        toast({
          title: "Import Complete",
          description: "No new NFTs to import (duplicates detected)",
        });
        return;
      }
      
      const allNFTs = [...newNFTs, ...existingNFTs];
      localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(allNFTs));
      
      // Update local state
      const userNFTs = userId 
        ? allNFTs.filter(nft => nft.userId === userId)
        : allNFTs;
      
      setNfts(userNFTs.sort((a, b) => b.timestamp - a.timestamp));
      
      toast({
        title: "Import Successful",
        description: `Imported ${newNFTs.length} new NFTs to your collection`,
      });
    } catch (error) {
      console.error('Error importing NFTs:', error);
      toast({
        title: "Import Failed",
        description: "Could not import NFTs. Please check the data format.",
        variant: "destructive",
      });
    }
  };

  return {
    nfts,
    isLoading,
    saveNFT,
    deleteNFT,
    clearAllNFTs,
    getNFTById,
    getTotalNFTs,
    getRecentNFTs,
    exportNFTs,
    importNFTs,
    refreshNFTs: loadNFTs,
  };
}
