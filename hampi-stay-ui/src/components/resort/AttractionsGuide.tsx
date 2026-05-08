import { ArrowRight } from "lucide-react";
import type { NearbyAttraction } from "../../types/resort";

interface AttractionsGuideProps {
  attractions: NearbyAttraction[];
}

export function AttractionsGuide({ attractions }: AttractionsGuideProps) {
  if (!attractions || attractions.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold font-serif text-navy-950 mb-6">Explore the Neighborhood</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attractions.map((place) => (
          <div 
            key={place.name}
            className="group flex items-center gap-5 p-5 bg-white rounded-3xl border border-sand-100 hover:border-gold-300 transition-all hover:shadow-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-sand-100 flex-shrink-0 overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1590050752117-23aae2968b20?auto=format&fit=crop&q=80&w=200`} 
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-navy-950 group-hover:text-gold-600 transition-colors">{place.name}</h4>
                <span className="text-[10px] font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-100">
                  {place.distanceKm}
                </span>
              </div>
              <p className="text-xs text-navy-950/50 line-clamp-2 leading-relaxed">
                Discover the architectural marvels of the Vijayanagara Empire located just a short journey from your sanctuary.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-navy-950/20 group-hover:text-gold-600 transition-all group-hover:translate-x-1" />
          </div>
        ))}
      </div>
    </section>
  );
}
