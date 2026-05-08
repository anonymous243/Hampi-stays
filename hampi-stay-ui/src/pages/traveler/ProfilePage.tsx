import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function ProfilePage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || ""
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50/50 pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">My Profile</h1>
          <p className="text-navy-950/50">Manage your personal information and preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 border border-sand-100 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-sand-50">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    formData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-navy-950 border-4 border-white shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-navy-950 mb-1">{formData.name}</h3>
              <p className="text-sm text-navy-950/40 mb-6 uppercase tracking-widest font-bold">
                {user?.role === "RESORT_OWNER" ? "Resort Owner" : "Traveller"}
              </p>
              
              <div className="pt-6 border-t border-sand-50 flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-green-50 rounded-2xl py-2">
                <ShieldCheck className="w-4 h-4" />
                Verified Account
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleUpdate}
              className="bg-white rounded-[2.5rem] p-10 border border-sand-100 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Input 
                  label="Email Address"
                  value={formData.email}
                  disabled
                />
                <Input 
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
                <Input 
                  label="Location"
                  placeholder="e.g. Bangalore, India"
                />
              </div>

              <Input 
                label="Avatar URL (Paste image link)"
                placeholder="https://images.unsplash.com/photo-..." 
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              />

              <div className="pt-6 border-t border-sand-50">
                <Button 
                  className="rounded-xl px-10 h-12 shadow-gold" 
                  type="submit"
                  isLoading={isUpdating}
                >
                  Save Changes
                </Button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}
