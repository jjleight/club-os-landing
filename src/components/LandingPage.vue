<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BrandLogo from './BrandLogo.vue';
import { 
  ShieldAlert, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Zap,
  LayoutGrid,
  Minus
} from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const loading = ref(false);
const submitted = ref(false);
const activeDemoTab = ref('selection');

const handleSubmit = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    submitted.value = true;
    email.value = '';
  }, 1500);
};

const goToDemo = () => {
  router.push('/selection');
};

// The 3-Way Comparison Data
const competitors = [
  { feature: "Team App & Chat", pitchero: true, spond: true, clubos: true },
  { feature: "Club Website Builder", pitchero: true, spond: false, clubos: true },
  { feature: "Match Fee Collection", pitchero: true, spond: true, clubos: true },
  { feature: "League Eligibility Engine", pitchero: false, spond: false, clubos: true },
  { feature: "Family Wallet (Consolidated)", pitchero: false, spond: false, clubos: true },
  { feature: "Asset Management (Pitches)", pitchero: false, spond: false, clubos: true },
];
</script>

<template>
  <div class="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
    
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/')">
          <div class="w-10 h-10 transition-transform group-hover:scale-110 duration-300">
            <BrandLogo />
          </div>
          <span class="text-2xl font-bold tracking-tight text-slate-900">
            Club<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">OS</span>
          </span>
        </div>
        
        <div class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" class="hover:text-indigo-600 transition">Features</a>
          <a href="#comparison" class="hover:text-indigo-600 transition">Comparison</a>
          <a href="#" class="hover:text-indigo-600 transition">Pricing</a>
        </div>

        <div class="flex gap-4">
            <button @click="goToDemo" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                Log In
            </button>
            <button @click="goToDemo" class="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5">
            Launch Demo
            </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="container mx-auto px-6 pt-20 pb-32 text-center relative">
      
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[120px] -z-10 mix-blend-multiply animate-pulse-slow"></div>
      <div class="absolute top-20 right-1/4 w-[500px] h-[500px] bg-rose-300/30 rounded-full blur-[100px] -z-10 mix-blend-multiply animate-pulse-slow" style="animation-delay: 2s;"></div>
      
      <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-wide text-indigo-700 uppercase bg-white rounded-full border border-indigo-100 shadow-sm">
        <Zap class="w-3 h-3 fill-current text-rose-500" />
        The Operating System for Grassroots Sport
      </div>
      
      <h1 class="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight text-slate-900">
        The Pulse of<br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Your Entire Club.</span>
      </h1>
      
      <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
        Stop managing twenty separate teams. Start managing <strong>one unified ecosystem</strong>. 
        Automate payments, prevent fines, and connect your community.
      </p>

      <div class="flex flex-col md:flex-row justify-center items-center gap-4">
          <button @click="goToDemo" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 text-lg">
            Try the Interactive Demo
            <ArrowRight class="w-5 h-5" />
          </button>
          <p class="text-sm text-slate-500">No sign up required</p>
      </div>
      
      <!-- Logos Placeholder -->
      <div class="mt-16 pt-8 border-t border-slate-200/60 max-w-2xl mx-auto opacity-60">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Designed for the Surrey Premier League</p>
        <div class="flex flex-wrap items-center justify-center gap-8 grayscale">
           <!-- Placeholder boxes for club logos -->
           <div class="h-8 w-24 bg-slate-300 rounded-md"></div>
           <div class="h-8 w-24 bg-slate-300 rounded-md"></div>
           <div class="h-8 w-24 bg-slate-300 rounded-md"></div>
        </div>
      </div>
    </header>

    <!-- Feature Section -->
    <section id="features" class="bg-white py-24 relative z-10 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          
          <div class="space-y-4">
            <h2 class="text-3xl font-bold mb-2 text-slate-900">Why Clubs Switch</h2>
            <p class="text-slate-500 mb-8 text-lg">Spond handles the chat. We handle the compliance and cash.</p>
            
            <button @click="activeDemoTab = 'selection'" 
                 class="w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group"
                 :class="activeDemoTab === 'selection' ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-slate-50'">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl shadow-sm" :class="activeDemoTab === 'selection' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'">
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
          </div>

          <!-- Phone Mockup (Marketing Version - Static Data) -->
          <div class="relative mx-auto">
            <div class="relative border-slate-900 bg-slate-900 border-[12px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl shadow-slate-900/20 overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
              <div class="bg-slate-50 w-full h-full pt-12 pb-4 overflow-y-auto no-scrollbar">
                
                <!-- Eligibility View -->
                <div v-if="activeDemoTab === 'selection'" class="px-4 animate-fade-in">
                  <div class="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
                    <div>
                      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">2nd XI Selection</div>
                      <div class="text-xl font-bold text-slate-900">vs. Ashford Town</div>
                    </div>
                    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <LayoutGrid class="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">JD</div>
                        <div>
                          <div class="font-bold text-slate-900 text-sm">John Doe</div>
                          <div class="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded inline-block">Available</div>
                        </div>
                      </div>
                      <CheckCircle2 class="w-5 h-5 text-slate-300" />
                    </div>

                    <div class="bg-white p-3 rounded-xl border-2 border-rose-100 shadow-sm relative overflow-hidden">
                      <div class="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">INELIGIBLE</div>
                      <div class="flex items-center gap-3 opacity-60">
                        <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">HK</div>
                        <div>
                          <div class="font-bold text-slate-900 text-sm">Harry Kane</div>
                          <div class="text-[10px] text-slate-500">1st XI Apps: 8 (Limit: 5)</div>
                        </div>
                      </div>
                      <div class="mt-3 bg-rose-50 p-3 rounded-lg border border-rose-100 flex gap-2">
                        <AlertTriangle class="w-4 h-4 text-rose-500 shrink-0" />
                        <div class="text-[10px] text-rose-700 leading-tight">
                          <strong>League Violation:</strong> Selecting Harry may result in a £50 fine.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Wallet View -->
                <div v-else class="px-4 animate-fade-in">
                  <div class="bg-slate-900 rounded-2xl p-6 text-white mb-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                    <div class="relative z-10">
                      <div class="text-slate-400 text-xs font-medium uppercase mb-1">Total Outstanding</div>
                      <div class="text-3xl font-bold">£45.00</div>
                      <div class="text-xs text-indigo-300 mt-2">Due: 28 Nov 2025</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="text-xs font-bold text-slate-400 uppercase px-1">Breakdown</div>
                    <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs">👶</div>
                        <div>
                          <div class="text-sm font-bold text-slate-900">Jack (U10)</div>
                          <div class="text-[10px] text-slate-500">Match Fee vs Ashford</div>
                        </div>
                      </div>
                      <div class="font-bold text-slate-700">£5.00</div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-xs">👧</div>
                        <div>
                          <div class="text-sm font-bold text-slate-900">Sarah (U12)</div>
                          <div class="text-[10px] text-slate-500">Annual Subs</div>
                        </div>
                      </div>
                      <div class="font-bold text-slate-700">£30.00</div>
                    </div>
                  </div>
                  <button @click="goToDemo" class="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg">Pay All</button>
                </div>

              </div>
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
          <h2 class="text-4xl font-extrabold mb-4 text-slate-900">The "Club" Standard</h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            Most apps are built for casual teams. We are built for professional administration.
          </p>
        </div>
        
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-200/60 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 bg-slate-50/80">
                <th class="p-6 font-bold text-slate-400 text-xs uppercase tracking-wider w-1/3">Feature</th>
                <th class="p-6 font-bold text-center text-slate-500 text-xs uppercase tracking-wider w-1/5">Pitchero</th>
                <th class="p-6 font-bold text-center text-emerald-600 text-xs uppercase tracking-wider w-1/5">Spond</th>
                <th class="p-6 font-bold text-center text-indigo-600 text-xs uppercase tracking-wider w-1/5 bg-indigo-50/40">ClubOS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in competitors" :key="item.feature" class="hover:bg-slate-50 transition group">
                <td class="p-5 font-medium text-slate-700 group-hover:text-indigo-900 transition">{{ item.feature }}</td>
                
                <!-- Pitchero Column -->
                <td class="p-5 text-center border-l border-slate-50">
                  <CheckCircle2 v-if="item.pitchero" class="w-5 h-5 text-slate-400 mx-auto" />
                  <Minus v-else class="w-4 h-4 text-slate-200 mx-auto" />
                </td>

                <!-- Spond Column -->
                <td class="p-5 text-center border-l border-slate-50">
                  <CheckCircle2 v-if="item.spond" class="w-5 h-5 text-emerald-500 mx-auto" />
                  <Minus v-else class="w-4 h-4 text-slate-200 mx-auto" />
                </td>

                <!-- ClubOS Column -->
                <td class="p-5 text-center bg-indigo-50/20 group-hover:bg-indigo-50/40 transition border-l border-indigo-100/50">
                  <div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm shadow-indigo-200">
                    <CheckCircle2 class="w-4 h-4" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-8 text-center text-sm text-slate-400">
          Comparison based on public feature lists as of Nov 2025.
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
          <span class="text-2xl font-bold tracking-tight text-white">
            Club<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">OS</span>
          </span>
        </div>
        <p class="text-sm mb-8 max-w-sm mx-auto">© 2025 ClubOS UK. Built for the love of the game.</p>
        <div class="flex justify-center gap-8 text-sm font-medium">
          <a href="#" class="hover:text-white transition">Privacy Policy</a>
          <a href="#" class="hover:text-white transition">Terms of Service</a>
          <a href="#" class="hover:text-white transition">Contact Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
}
.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
