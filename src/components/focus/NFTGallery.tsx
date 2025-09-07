'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gallery, 
  Download, 
  Eye, 
  Calendar, 
  Sparkles, 
  Grid3x3, 
  List,
  Search,
  Filter,
  ChevronRight,
  Trophy
} from "lucide-react";
import { useNFTStorage, StoredNFT } from "@/hooks/use-nft-storage";
import { downloadNFT } from "@/lib/nft-generator";
import { useToast } from "@/hooks/use-toast";

interface NFTGalleryProps {
  userId?: string;
  compact?: boolean;
}

export function NFTGallery({ userId, compact = false }: NFTGalleryProps) {
  const { nfts, isLoading, getTotalNFTs, getRecentNFTs } = useNFTStorage(userId);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNFT, setSelectedNFT] = useState<StoredNFT | null>(null);
  const { toast } = useToast();

  const handleDownloadNFT = (nft: StoredNFT) => {
    try {
      downloadNFT(nft);
      toast({
        title: "Download Started",
        description: `"${nft.name}" is being downloaded!`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const displayNFTs = compact ? getRecentNFTs(6) : nfts;

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gallery className="h-5 w-5" />
            NFT Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (nfts.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gallery className="h-5 w-5" />
            NFT Collection
            <Badge variant="outline" className="ml-auto">
              0
            </Badge>
          </CardTitle>
          <CardDescription>
            Complete focus sessions to earn NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No NFTs earned yet</p>
            <p className="text-xs text-muted-foreground">
              Complete a 25+ minute focus session to earn your first NFT!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gallery className="h-5 w-5" />
            NFT Collection
            <Badge variant="outline" className="ml-2">
              {getTotalNFTs()}
            </Badge>
          </CardTitle>
          
          {!compact && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <CardDescription>
          {compact 
            ? `Recent NFT rewards from focus sessions`
            : `Your collection of ${getTotalNFTs()} unique focus achievement NFTs`
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {compact && getTotalNFTs() > 6 && (
          <div className="mb-4">
            <Button variant="outline" size="sm" className="w-full">
              View All {getTotalNFTs()} NFTs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {viewMode === 'grid' ? (
          // Grid View
          <div className={`grid gap-3 ${compact ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {displayNFTs.map((nft) => (
              <div
                key={nft.id}
                className="group relative bg-card/30 rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-200"
              >
                {/* NFT Image */}
                <div className="aspect-square bg-muted/50 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownloadNFT(nft)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedNFT(nft)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="p-3">
                  <h4 className="font-medium text-sm line-clamp-1 mb-1">
                    {nft.name}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDuration(nft.sessionData.duration)}</span>
                    <span>{formatDate(nft.timestamp)}</span>
                  </div>
                  
                  {!compact && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {nft.traits.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {nft.traits.shape}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {displayNFTs.map((nft) => (
              <div
                key={nft.id}
                className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                {/* NFT Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* NFT Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 mb-1">
                    {nft.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDuration(nft.sessionData.duration)} session</span>
                    <span>•</span>
                    <span>{formatDate(nft.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadNFT(nft)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!compact && nfts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{getTotalNFTs()}</div>
                <div className="text-xs text-muted-foreground">Total NFTs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {nfts.reduce((total, nft) => total + nft.sessionData.duration, 0)}m
                </div>
                <div className="text-xs text-muted-foreground">Focus Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Achievement Indicator */}
        {compact && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 text-center">
            <Sparkles className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-xs text-primary font-medium">
              Keep focusing to earn more unique NFTs!
            </p>
          </div>
        )}
      </CardContent>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNFT(null)}
        >
          <div 
            className="bg-card/95 backdrop-blur-lg border border-primary/20 rounded-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={selectedNFT.image} 
                alt={selectedNFT.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{selectedNFT.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{selectedNFT.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-muted-foreground">Session Duration</div>
                <div className="font-semibold">{formatDuration(selectedNFT.sessionData.duration)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Earned On</div>
                <div className="font-semibold">{formatDate(selectedNFT.timestamp)}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{selectedNFT.traits.style} Style</Badge>
              <Badge variant="outline">{selectedNFT.traits.shape} Shape</Badge>
              <Badge variant="outline">{selectedNFT.traits.background} BG</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDownloadNFT(selectedNFT)}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedNFT(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
