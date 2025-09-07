'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, X, Share2, Trophy, Sparkles } from "lucide-react";
import { GeneratedNFT, downloadNFT } from "@/lib/nft-generator";
import { useToast } from "@/hooks/use-toast";

interface NFTRewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  nft: GeneratedNFT | null;
  sessionDuration: number;
}

export function NFTRewardPopup({ isOpen, onClose, nft, sessionDuration }: NFTRewardPopupProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!nft) return;
    
    setIsDownloading(true);
    try {
      downloadNFT(nft);
      toast({
        title: "Download Started",
        description: "Your NFT is being downloaded!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (!nft) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Check out my Focus NFT: ${nft.name}`,
        text: nft.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I just earned "${nft.name}" - ${nft.description}`);
      toast({
        title: "Copied to Clipboard",
        description: "NFT details copied! Share your achievement.",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!nft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-lg border border-primary/20">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Trophy className="h-12 w-12 text-yellow-500" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            🎉 Congratulations! NFT Earned! 🎉
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            You've successfully completed a {formatDuration(sessionDuration)} focus session and earned a unique NFT!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* NFT Display */}
          <Card className="bg-card/50 backdrop-blur-sm border border-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* NFT Image */}
                <div className="relative group">
                  <div className="w-80 h-80 rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* NFT Details */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {nft.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {nft.description}
                    </p>
                  </div>

                  {/* Traits */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Visual Traits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {nft.traits.style} Style
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {nft.traits.shape} Shape
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {nft.traits.background} Background
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {nft.traits.pattern} Pattern
                      </Badge>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Session Duration</div>
                        <div className="font-semibold">{formatDuration(sessionDuration)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Earned</div>
                        <div className="font-semibold">{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial min-w-[140px]"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download NFT'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 sm:flex-initial min-w-[120px]"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-w-[100px]"
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              🌟 <strong>Well done!</strong> This unique NFT represents your commitment to focused productivity. 
              Keep completing sessions to earn more amazing digital collectibles!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
