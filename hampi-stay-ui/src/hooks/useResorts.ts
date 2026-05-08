import { useState, useEffect, useMemo } from "react";
import type { Resort, FilterState, SortOption, SearchParams } from "../types/resort";

interface UseResortsOptions {
  search?: Partial<SearchParams>;
  filters?: Partial<FilterState>;
  sort?: SortOption;
}

const MAX_PRICE = 60000;

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: MAX_PRICE,
  amenities: [],
  types: [],
  minRating: 0,
};

export function useResorts({ search, filters, sort = "popularity" }: UseResortsOptions = {}) {
  const [allResorts, setAllResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/resorts');
        if (!response.ok) throw new Error('Failed to fetch resorts');
        const data = await response.json();
        
        // Map backend data to frontend types (Normalization)
        const normalized = data.map((r: any) => ({
          ...r,
          location: {
            area: r.locationArea,
            district: "Hampi", // Backend doesn't have district yet
            state: "Karnataka",
            lat: r.locationLat,
            lng: r.locationLng,
            distanceFromCenterKm: 5 // Mocked for now
          }
        }));
        
        setAllResorts(normalized);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResorts();
  }, []);

  const f: FilterState = { ...DEFAULT_FILTERS, ...filters };

  const filtered = useMemo(() => {
    return allResorts.filter((resort) => {
      // Text search
      if (search?.location) {
        const q = search.location.toLowerCase();
        // Backend uses 'locationArea' in schema, but mapping might be needed
        const area = (resort as any).locationArea || resort.location?.area || "";
        const haystack = `${resort.name} ${area}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Guest capacity
      const totalGuests = (search?.adults ?? 0) + (search?.children ?? 0);
      if (totalGuests > 0) {
        const hasCapacity = resort.roomTypes.some((rt) => rt.capacity >= totalGuests);
        if (!hasCapacity) return false;
      }

      // Price range
      if (resort.pricePerNight < f.minPrice || resort.pricePerNight > f.maxPrice) {
        return false;
      }

      // Amenity filter
      if (f.amenities.length > 0) {
        const hasAll = f.amenities.every((a) => resort.amenities.includes(a));
        if (!hasAll) return false;
      }

      // Type filter
      if (f.types.length > 0) {
        if (!f.types.includes(resort.type)) return false;
      }

      // Rating filter
      if (resort.rating < f.minRating) return false;

      return true;
    });
  }, [allResorts, search, f]);

  const sorted = useMemo((): Resort[] => {
    const arr = [...filtered];
    switch (sort) {
      case "price_asc":
        return arr.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case "price_desc":
        return arr.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "newest":
        return arr.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popularity":
      default:
        return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filtered, sort]);

  return {
    resorts: sorted,
    total: sorted.length,
    isEmpty: sorted.length === 0,
    isLoading,
    error,
    maxPrice: MAX_PRICE,
  };
}
