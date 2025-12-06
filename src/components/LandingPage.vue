<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';
import { useToast } from '../composables/useToast';
import BrandLogo from './BrandLogo.vue';
import { 
  ShieldAlert, Wallet, Gavel, CheckCircle2, 
  Zap, Minus, ArrowRight, Users, Building2, Mail, User
} from 'lucide-vue-next';

const router = useRouter();
const { showToast } = useToast();

// Demo State (For the feature showcase below)
const activeDemoTab = ref('selection'); 

// Lead Form State
const leadForm = ref({
  name: '',
  clubName: '',
  clubSize: '',
  email: ''
});
const loading = ref(false);
const submitted = ref(false);

// Submit Logic
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

// Competitor Data
const competitors = [
  { feature: "Team App & Chat", pitchero: true, spond: true, sportos: true },
  { feature: "Club Website Builder", pitchero: true, spond: false, sportos: true },
  { feature: "Match Fee Collection", pitchero: true, spond: true, sportos: true },
  { feature: "League Compliance Engine", pitchero: false, spond: false, sportos: true },
  { feature: "Family Wallet", pitchero: false, spond: false, sportos: true },
  { feature: "Asset Management", pitchero: false, spond: false, sportos: true },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
    
    <!-- Navbar (Simplified) -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3 select-none">
          <div class="w-10 h-10">
            <BrandLogo />
          </div>
          <span class="text-2xl font-bold tracking-tight text-slate-900">
            Sport<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">OS</span>
          </span>
        </div>
        
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" class="hover:text-indigo-600 transition">Killer Features</a>
          <a href="#comparison" class="hover:text-indigo-600 transition">Why Us?</a>
        </div>

        <!-- Hidden Pilot Login (Subtle) -->
        <button @click="router.push('/login')" class="text-xs font-bold text-slate-400 hover:text-indigo-600 transition">
            Pilot Login
        </button>
      </div>
    </nav>

    <!-- Hero Section: The "Coming Soon" Hook -->
    <header class="container mx-auto px-6 pt-16 pb-24 relative">
      
      <div class="grid lg:grid-cols-2 gap-16 items-center">
          
          <!-- Left: The Pitch -->
          <div class="text-center lg:text-left relative z-10">
             <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-wide text-indigo-700 uppercase bg-white rounded-full border border-indigo-100 shadow-sm animate-pulse-slow">
                <Zap class="w-3 h-3 fill-current text-rose-500" />
                Coming Q1 2026
             </div>
             
             <h1 class="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-slate-900">
                The Future of <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Grassroots.</span>
             </h1>
             
             <p class="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                We are building the operating system your Club has been dreaming of. 
                Automated compliance, unified ecosystem, family wallet and zero admin headaches.
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
                    <p class="text-sm text-slate-500 mb-6">Join 200+ clubs on the priority waiting list.</p>

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
                                    <input v-model="leadForm.clubName" type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Ashford FC" />
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

    <!-- Killer Features (Visual Demo) -->
    <section id="features" class="bg-white py-24 relative z-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
           <h2 class="text-3xl font-bold mb-4 text-slate-900">What's Coming?</h2>
           <p class="text-slate-500 max-w-2xl mx-auto">We are piloting with select clubs in Surrey. Here is a sneak peek at the features that are changing the game.</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Feature List -->
          <div class="space-y-4">
            <button @click="activeDemoTab = 'selection'" 
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'selection' ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-slate-50'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'selection' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'">
                  <ShieldAlert class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-1" :class="activeDemoTab === 'selection' ? 'text-indigo-900' : 'text-slate-700'">The Eligibility Engine</h3>
                  <p class="text-sm text-slate-500 leading-relaxed">Stop accidental fines. The app alerts captains if a player is ineligible (Cup Tied / Too many apps).</p>
                </div>
              </div>
            </button>

            <button @click="activeDemoTab = 'wallet'"
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'wallet' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-slate-50'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'wallet' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'">
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
                 :class="activeDemoTab === 'rules' ? 'border-rose-500 bg-rose-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-slate-50'">
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

          <!-- Phone Mockup (Static Demo - Kept for visual proof) -->
          <div class="relative mx-auto">
            <div class="relative border-slate-900 bg-slate-900 border-[12px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl shadow-slate-900/20 overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
               
               <!-- Mockup Content: Eligibility -->
               <div v-if="activeDemoTab === 'selection'" class="bg-slate-50 w-full h-full pt-12 px-4">
                  <div class="bg-white p-4 rounded-xl border border-rose-100 shadow-lg mb-4 relative overflow-hidden">
                      <div class="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">INELIGIBLE</div>
                      <div class="flex items-center gap-3 mb-2">
                           <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">AL</div>
                           <div>
                              <div class="font-bold text-slate-900">Arthur Leeton</div>
                              <div class="text-xs text-slate-500">1st XI Apps: 8 (Limit: 5)</div>
                           </div>
                      </div>
                      <div class="bg-rose-50 p-3 rounded-lg border border-rose-100 text-[10px] text-rose-800 font-medium">
                        Warning: Selection breaches League Rule 4.2. Points deduction likely.
                      </div>
                  </div>
                  <!-- Fake List -->
                  <div class="space-y-2 opacity-40">
                      <div class="h-14 bg-white rounded-xl border border-slate-200"></div>
                      <div class="h-14 bg-white rounded-xl border border-slate-200"></div>
                      <div class="h-14 bg-white rounded-xl border border-slate-200"></div>
                  </div>
               </div>

               <!-- Mockup Content: Wallet -->
               <div v-else-if="activeDemoTab === 'wallet'" class="bg-slate-50 w-full h-full pt-12 px-4">
                  <div class="bg-slate-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
                      <div class="text-3xl font-bold">£35.00</div>
                      <div class="text-xs text-slate-400">Total Outstanding</div>
                  </div>
                  <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-2 flex justify-between">
                      <span class="font-bold text-sm">Jack (U10)</span><span>£5.00</span>
                  </div>
                  <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between">
                      <span class="font-bold text-sm">Sarah (U12)</span><span>£30.00</span>
                  </div>
                  <div class="w-full h-12 bg-indigo-600 rounded-xl mt-8 shadow-lg"></div>
               </div>

               <!-- Mockup Content: Rules -->
               <div v-else class="bg-slate-50 w-full h-full pt-12 px-4">
                  <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
                      <h3 class="font-bold text-slate-900 mb-2">Higher Level Apps</h3>
                      <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                           <span class="text-xs font-bold text-slate-400 pl-2">LIMIT</span>
                           <span class="text-xl font-bold text-slate-900">5</span>
                           <div class="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold shadow-sm">Edit</div>
                      </div>
                  </div>
               </div>
               
               <!-- Dynamic Island -->
               <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section id="comparison" class="py-24 bg-slate-100">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold mb-4 text-slate-900">The "Professional" Standard</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            Why clubs are waiting for SportOS.
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
                <td class="p-5 text-center bg-indigo-50/20 border-l border-indigo-100/50"><div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm"><CheckCircle2 class="w-4 h-4" /></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-16 text-center border-t border-slate-800">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-center gap-3 mb-8 opacity-80 hover:opacity-100 transition duration-500">
           <div class="w-8 h-8">
            <BrandLogo />
          </div>
          <span class="text-2xl font-bold text-white tracking-tight">SportOS</span>
        </div>
        <p class="text-sm mb-8 max-w-sm mx-auto">© 2025 SportOS UK. Built for the love of the game.</p>
        <div class="flex justify-center gap-8 text-sm font-medium">
            <a href="#" class="hover:text-white">Privacy</a>
            <button @click="router.push('/login')" class="hover:text-white">Pilot Login</button>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
