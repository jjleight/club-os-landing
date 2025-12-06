<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { useToast } from '../composables/useToast';
import BrandLogo from './BrandLogo.vue';
import { 
  ShieldAlert, Wallet, Gavel, ArrowRight, CheckCircle2, 
  XCircle, Zap, LayoutGrid, Calculator, Check, Minus, 
  Users, Calendar, Shirt, BarChart3, CreditCard, User, Mail, Building2
} from 'lucide-vue-next';

const router = useRouter();
const { showToast } = useToast();
const activeDemoTab = ref('selection'); 

// --- WAITLIST LOGIC ---
const leadForm = ref({
  name: '',
  clubName: '',
  clubSize: '',
  email: ''
});
const loading = ref(false);
const submitted = ref(false);

const joinWaitlist = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.from('leads').insert({
      name: leadForm.value.name,
      club_name: leadForm.value.clubName,
      club_size: leadForm.value.clubSize,
      email: leadForm.value.email
    });

    if (error) throw error;

    submitted.value = true;
    showToast('You are on the list!', 'We will be in touch for the Q1 2026 launch.', 'success');
  } catch (err) {
    showToast('Error', 'Something went wrong. Please try again.', 'error');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Navigation Actions
const goToLogin = () => router.push('/login');
const goToRegister = () => router.push('/register'); 
const startOnboarding = () => router.push('/onboarding');
const goToDemo = () => router.push('/selection');

// Basic Features Data
const coreFeatures = [
  {
    title: "Team Management",
    desc: "Organise teams, assign coaches, and maintain a secure, GDPR-compliant member database.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Fixture Control",
    desc: "Schedule matches, manage pitch locations, and track results across your entire club calendar.",
    icon: Calendar,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    title: "Tactical Selection",
    desc: "Drag-and-drop squad builder. Assign positions (GK, DEF, FWD) and visualise formations.",
    icon: Shirt,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Smart Payments",
    desc: "Collect annual subs, weekly match fees, and fines. Split payments by team or individual.",
    icon: CreditCard,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    title: "Player Data & Stats",
    desc: "Track appearances, goals, and history. Build a digital passport for every player's career.",
    icon: BarChart3,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    title: "League Compliance",
    desc: "Automated checks for cup-tying and squad limits. Never field an ineligible player again.",
    icon: ShieldAlert,
    color: "text-amber-500",
    bg: "bg-amber-50"
  }
];

const competitors = [
  { feature: "Team App & Chat", pitchero: true, spond: true, sportos: true },
  { feature: "Club Website Builder", pitchero: true, spond: false, sportos: true },
  { feature: "Match Fee Collection", pitchero: true, spond: true, sportos: true },
  { feature: "League Eligibility Engine", pitchero: false, spond: false, sportos: true },
  { feature: "Family Wallet (Consolidated)", pitchero: false, spond: false, sportos: true },
  { feature: "Asset Management (Pitches)", pitchero: false, spond: false, sportos: true },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
    
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/')">
          <div class="w-10 h-10 transition-transform group-hover:scale-110 duration-300">
            <BrandLogo />
          </div>
          <span class="text-2xl font-bold tracking-tight text-slate-900">
            Sport<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">OS</span>
          </span>
        </div>
        
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" class="hover:text-indigo-600 transition">Features</a>
          <a href="#comparison" class="hover:text-indigo-600 transition">Comparison</a>
        </div>

        <div class="flex gap-4 items-center">
            <!-- RESTRICTED LOGIN -->
            <button @click="goToLogin" class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5">
                Pilot Login
            </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="container mx-auto px-6 pt-16 pb-24 relative">
      
      <div class="grid lg:grid-cols-2 gap-16 items-center">
          
          <!-- Left: The Pitch -->
          <div class="text-center lg:text-left relative z-10">
             <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-wide text-indigo-700 uppercase bg-white rounded-full border border-indigo-100 shadow-sm animate-pulse-slow">
                <Zap class="w-3 h-3 fill-current text-rose-500" />
                Coming end of Q1 2026
             </div>
             
             <h1 class="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900">
                The Future of <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Grassroots.</span>
             </h1>
             
             <p class="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                We are building the operating system your Club has been dreaming of. 
                Automated compliance, unified ecosystem, family wallets, and zero admin headaches.
             </p>

             <div class="flex flex-wrap gap-4 justify-center lg:justify-start text-sm font-bold text-slate-500">
                <span class="flex items-center gap-1"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> League Compliance</span>
                <span class="flex items-center gap-1"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Asset Mgmt</span>
                <span class="flex items-center gap-1"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Family Payments</span>
             </div>
          </div>

          <!-- Right: The Waitlist Form -->
          <div class="relative">
              <!-- Glow behind form -->
              <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-3xl blur-2xl opacity-20"></div>
              
              <div class="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-8 overflow-hidden">
                 
                 <div v-if="!submitted">
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Get Early Access</h3>
                    <p class="text-sm text-slate-500 mb-6">Join 50+ clubs on the priority waiting list.</p>

                    <form @submit.prevent="joinWaitlist" class="space-y-4">
                        <div>
                            <label class="text-xs font-bold text-slate-400 uppercase mb-1 block">Your Name</label>
                            <div class="relative">
                                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input v-model="leadForm.name" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Steve Clarke" />
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase mb-1 block">Club Name</label>
                                <div class="relative">
                                    <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input v-model="leadForm.clubName" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Laleham FC" />
                                </div>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase mb-1 block">Club Size</label>
                                <div class="relative">
                                    <Users class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select v-model="leadForm.clubSize" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none text-slate-600">
                                        <option value="" disabled selected>Select...</option>
                                        <option>1-5 Teams</option>
                                        <option>6-15 Teams</option>
                                        <option>16-40 Teams</option>
                                        <option>40+ Teams</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs font-bold text-slate-400 uppercase mb-1 block">Email Address</label>
                            <div class="relative">
                                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input v-model="leadForm.email" type="email" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="secretary@club.com" />
                            </div>
                        </div>

                        <button type="submit" :disabled="loading" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 mt-2">
                            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span v-else>Request Access</span>
                            <ArrowRight v-if="!loading" class="w-5 h-5" />
                        </button>
                    </form>
                    <p class="text-[10px] text-center text-slate-400 mt-4">No commitment required.</p>
                 </div>

                 <!-- Success State -->
                 <div v-else class="text-center py-12 animate-fade-in">
                    <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 class="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h3>
                    <p class="text-slate-500 mb-8">We will reach out to <strong>{{ leadForm.email }}</strong> shortly.</p>
                    <button @click="submitted = false" class="text-sm font-bold text-indigo-600 hover:underline">Register another club</button>
                 </div>

              </div>
          </div>
      </div>
    </header>

    <!-- Killer Feature Demo (Visual Only) -->
    <section class="bg-slate-50 py-24 border-t border-slate-200">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          
          <!-- Feature Selection -->
          <div class="space-y-4">
            <h2 class="text-3xl font-bold mb-6 text-slate-900">Why Treasurers Switch</h2>
            <p class="text-slate-500 mb-8 text-lg">Basic apps manage lists. We manage <strong>Solvency and Compliance</strong>.</p>
            
            <button @click="activeDemoTab = 'selection'" 
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'selection' ? 'border-indigo-600 bg-white shadow-lg shadow-indigo-100' : 'border-slate-200 hover:border-slate-300 bg-white'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'selection' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'">
                  <ShieldAlert class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1" :class="activeDemoTab === 'selection' ? 'text-indigo-900' : 'text-slate-700'">The Eligibility Engine</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Stop accidental fines. The app alerts captains if a player is ineligible.</p>
                </div>
              </div>
            </button>

            <button @click="activeDemoTab = 'wallet'"
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'wallet' ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100' : 'border-slate-200 hover:border-slate-300 bg-white'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'wallet' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'">
                  <Wallet class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1" :class="activeDemoTab === 'wallet' ? 'text-emerald-900' : 'text-slate-700'">The Family Wallet</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">One invoice for the whole house. Parents pay for siblings and themselves in a single tap.</p>
                </div>
              </div>
            </button>

            <button @click="activeDemoTab = 'rules'"
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'rules' ? 'border-rose-500 bg-rose-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'rules' ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'">
                  <Gavel class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1" :class="activeDemoTab === 'rules' ? 'text-rose-900' : 'text-slate-700'">League Compliance</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Configure rules instantly. Change the "Starring" limit and update every captain's app in real-time.</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Phone Mockup -->
          <div class="relative mx-auto">
            <div class="relative border-slate-900 bg-slate-900 border-[12px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl shadow-slate-900/20 overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
              <div class="bg-slate-50 w-full h-full pt-12 pb-4 overflow-y-auto no-scrollbar">
                 
                 <!-- Eligibility View -->
                 <div v-if="activeDemoTab === 'selection'" class="px-4 pt-4">
                    <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4">
                        <div class="flex items-center gap-3">
                             <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">AL</div>
                             <div>
                                <div class="font-bold text-slate-900">Arthur Leeton</div>
                                <div class="text-xs text-rose-500 font-bold">Ineligible (8 Apps)</div>
                             </div>
                        </div>
                    </div>
                    <!-- Visual Filler -->
                    <div class="space-y-2 opacity-50">
                        <div class="h-12 bg-white rounded-xl border border-slate-100"></div>
                        <div class="h-12 bg-white rounded-xl border border-slate-100"></div>
                    </div>
                 </div>

                 <!-- Wallet View (UPDATED) -->
                 <div v-else-if="activeDemoTab === 'wallet'" class="px-4 pt-4">
                    <div class="bg-slate-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
                        <div class="text-3xl font-bold">£155.00</div>
                        <div class="text-xs text-slate-400">Total Outstanding</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-2 flex justify-between items-center">
                        <div>
                            <div class="font-bold text-sm">Arthur (U16)</div>
                            <div class="text-[10px] text-slate-400">Annual Subs</div>
                        </div>
                        <span class="font-bold">£120.00</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                            <div class="font-bold text-sm">Training Kit</div>
                            <div class="text-[10px] text-slate-400">Jacket & Shorts</div>
                        </div>
                        <span class="font-bold">£35.00</span>
                    </div>
                    <div class="w-full h-12 bg-indigo-600 rounded-xl mt-8 shadow-lg"></div>
                 </div>

                 <!-- Rules View -->
                 <div v-else class="px-4 pt-4">
                    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
                        <h3 class="font-bold text-slate-900 mb-2">Higher Level Apps</h3>
                        <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                             <span class="text-xs font-bold text-slate-400 pl-2">LIMIT</span>
                             <span class="text-xl font-bold text-slate-900">5</span>
                             <div class="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold shadow-sm">Edit</div>
                        </div>
                    </div>
                 </div>

              </div>
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Killer Features Grid -->
    <section id="features" class="py-24 bg-white relative z-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-4xl font-extrabold text-slate-900 mb-4">The Complete OS</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            From the U7s to the Vets, we handle every aspect of club operations.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div v-for="feat in coreFeatures" :key="feat.title" 
                class="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" :class="feat.bg">
                 <component :is="feat.icon" class="w-7 h-7" :class="feat.color" />
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition">{{ feat.title }}</h3>
              <p class="text-slate-500 leading-relaxed">{{ feat.desc }}</p>
           </div>
        </div>
      </div>
    </section>

    <!-- Comparison Table (Existing) -->
    <section id="comparison" class="py-24 bg-slate-50">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold mb-4 text-slate-900">The "Club" Standard</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            See why Treasurers are upgrading from chat apps.
          </p>
        </div>
        
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-200/60 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/80">
                <th class="p-6 font-bold text-slate-400 text-xs uppercase tracking-wider w-1/3">Feature</th>
                <th class="p-6 font-bold text-center text-slate-500 text-xs uppercase tracking-wider w-1/5">Pitchero</th>
                <th class="p-6 font-bold text-center text-emerald-600 text-xs uppercase tracking-wider w-1/5">Spond</th>
                <th class="p-6 font-bold text-center text-indigo-600 text-xs uppercase tracking-wider w-1/5 bg-indigo-50/40">SportOS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in competitors" :key="item.feature" class="hover:bg-slate-50 transition group">
                <td class="p-5 font-medium text-slate-700 group-hover:text-indigo-900 transition">{{ item.feature }}</td>
                <td class="p-5 text-center border-l border-slate-50"><CheckCircle2 v-if="item.pitchero" class="w-5 h-5 text-slate-400 mx-auto" /><Minus v-else class="w-4 h-4 text-slate-200 mx-auto" /></td>
                <td class="p-5 text-center border-l border-slate-50"><CheckCircle2 v-if="item.spond" class="w-5 h-5 text-emerald-500 mx-auto" /><Minus v-else class="w-4 h-4 text-slate-200 mx-auto" /></td>
                <td class="p-5 text-center bg-indigo-50/20 group-hover:bg-indigo-50/40 transition border-l border-indigo-100/50">
                  <div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm shadow-indigo-200">
                    <CheckCircle2 class="w-4 h-4" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Footer (Existing) -->
    <footer class="bg-slate-900 text-slate-400 py-16 text-center border-t border-slate-800 mt-12">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-center gap-3 mb-8 opacity-80 hover:opacity-100 transition duration-500">
           <div class="w-8 h-8">
            <BrandLogo />
          </div>
          <span class="text-2xl font-bold text-white tracking-tight">SportOS</span>
        </div>
        <p class="text-sm mb-8 max-w-sm mx-auto">© 2025 SportOS UK. Built for the love of the game.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
@keyframes pulse-slow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
