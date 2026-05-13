import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { apiClient } from '../utils/apiClient';
import type { Resort } from '../types/resort';

interface WishlistContextType {
  wishlist: Resort[];
  isLoading: boolean;
  isFavorite: (resortId: string) => boolean;
  toggleWishlist: (resortId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiClient.get<Resort[]>(`/users/${user.id}/wishlist`);
      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Listen for global updates (e.g. from other tabs or if we still use custom events)
  useEffect(() => {
    const handleUpdate = () => fetchWishlist();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, [fetchWishlist]);

  const isFavorite = useCallback((resortId: string) => {
    return wishlist.some(r => r.id === resortId);
  }, [wishlist]);

  const toggleWishlist = async (resortId: string) => {
    if (!user) {
      toast.error('Please login to save resorts to your wishlist.');
      return;
    }

    try {
      // Optimistic update
      const wasFavorite = isFavorite(resortId);
      if (wasFavorite) {
        setWishlist(prev => prev.filter(r => r.id !== resortId));
      } else {
        // We don't have the full resort object here usually, 
        // so we'll wait for the server response or just re-fetch
      }

      const response = await apiClient.post<{ saved: boolean }>(`/wishlist/toggle`, {
        userId: user.id,
        resortId
      });
      
      if (response.saved) {
        toast.success("Added to wishlist!");
      } else {
        toast.success("Removed from wishlist.");
      }
      
      // Re-fetch to be sure and get full data if added
      await fetchWishlist();
      
      // Dispatch for any component not using context
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
      // Rollback if needed or re-fetch
      await fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      isLoading, 
      isFavorite, 
      toggleWishlist, 
      refreshWishlist: fetchWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
