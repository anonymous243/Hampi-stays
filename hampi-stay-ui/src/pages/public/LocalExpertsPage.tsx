import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award, Star, ArrowRight, 
  ShieldCheck, Search, Sparkles, CheckCircle2
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

interface Guide {
  id: string;
  bio: string;
  specialties: string[];
  languages: string[];
  pricePerDay: number;
  yearsExperience: number;
  user: {
    name: string;
  };
  experiences: any[];
}

export function LocalExpertsPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await fetch('/api/guides');
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      if (Array.isArray(data)) {
        setGuides(data);
      } else {
        console.warn("API did not return an array:", data);
        setGuides([]);
      }
    } catch (err) {
      console.error("Failed to fetch guides", err);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(guide => 
    guide.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold-200/20 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-100 text-navy-600 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm">
              <Award className="w-3 h-3" /> Hampi Expert Network
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy-950 mb-6">
              Meet the <span className="text-gold-600 italic">Storytellers</span>
            </h1>
            <p className="text-lg text-navy-950/60 max-w-2xl mx-auto leading-relaxed mb-12">
              Our certified local experts are more than just guides—they are historians, 
              archaeologists, and guardians of Hampi's ancient legacy.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-0 bg-gold-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white rounded-2xl shadow-luxury p-2 border border-sand-200">
                <Search className="w-5 h-5 text-navy-950/20 ml-4" />
                <input 
                  type="text" 
                  placeholder="Search by name or specialty (e.g. Architecture)"
                  className="flex-1 h-12 px-4 bg-transparent outline-none text-navy-950 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="rounded-xl px-8 bg-navy-950 text-white h-12">Search</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experts Grid */}
      <section className="container mx-auto px-4 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i} className="h-[600px] bg-white rounded-[3rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGuides.map((guide, i) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3rem] border border-sand-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 flex flex-col"
              >
                {/* Profile Header */}
                <div className="p-10 pb-6 border-b border-sand-50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-24 h-24 rounded-3xl bg-sand-50 border-2 border-sand-100 flex items-center justify-center text-4xl font-serif font-bold text-navy-950 shadow-inner group-hover:bg-navy-950 group-hover:text-white transition-colors duration-500">
                      {guide.user.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gold-500 mb-1 justify-end">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-navy-950">4.9</span>
                      </div>
                      <p className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">48 reviews</p>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-navy-950 mb-2">{guide.user.name}</h3>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> ASI Certified Expert
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-10 flex-1 space-y-8">
                  <p className="text-navy-950/60 text-sm leading-relaxed line-clamp-3">
                    {guide.bio}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-navy-950/40 uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-gold-500" /> Specialties
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map(s => (
                        <span key={s} className="px-4 py-1.5 bg-sand-50 rounded-xl text-[10px] font-bold text-navy-950/70 border border-sand-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-sand-50">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">Experience</span>
                        <span className="text-sm font-bold text-navy-950">12+ Years</span>
                      </div>
                      <div className="w-px h-8 bg-sand-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-navy-950/30 uppercase tracking-widest">Languages</span>
                        <span className="text-sm font-bold text-navy-950">{guide.languages[0]}, {guide.languages[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 pt-0">
                  <Link to="/experiences">
                    <Button className="w-full rounded-2xl h-14 bg-navy-950 text-white group/btn border-none font-bold">
                      View All Tours
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredGuides.length === 0 && (
          <div className="text-center py-40">
            <h3 className="text-3xl font-serif font-bold text-navy-950 mb-4">No Experts Found</h3>
            <p className="text-navy-950/40 mb-8">Try searching for a different name or specialty.</p>
            <Button onClick={() => setSearchQuery("")} variant="outline" className="rounded-2xl">Clear Search</Button>
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="bg-navy-950 py-24 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl">
             <h2 className="text-4xl font-serif font-bold mb-6">Verified for <span className="text-gold-400">Excellence</span></h2>
             <p className="text-white/60 leading-relaxed mb-8">
               Every expert in our network undergoes a rigorous background check and must maintain 
               an active Archaeological Survey of India (ASI) certification.
             </p>
             <div className="grid grid-cols-2 gap-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gold-400">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest">Licensed by ASI</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-gold-400">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest">Background Verified</span>
               </div>
             </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
             <div className="relative">
                <div className="absolute inset-0 bg-gold-500 rounded-full blur-[100px] opacity-20" />
                <img 
                  src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2000" 
                  className="w-80 h-80 object-cover rounded-[3rem] shadow-2xl rotate-3"
                  alt="Hampi Heritage"
                />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
