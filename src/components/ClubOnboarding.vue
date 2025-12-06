<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useClub } from '../composables/useClub';
import { useUser } from '../composables/useUser'; 
import { useToast } from '../composables/useToast';
import BrandLogo from './BrandLogo.vue';

// Import Steps
import StepClubDetails from './onboarding/StepClubDetails.vue';
import StepUserProfile from './onboarding/StepUserProfile.vue';
import StepInviteOfficials from './onboarding/StepInviteOfficials.vue';

const router = useRouter();
const { createClub } = useClub();
const { user, fetchProfile } = useUser(); 
const { showToast } = useToast();

const step = ref(1);
const loading = ref(false);

const form = ref({
  clubName: '',
  sport: 'Football',
  county: '',
  color: '#4F46E5',
  firstName: '',
  lastName: '',
  role: 'Treasurer',
  dob: '',
  phone: '',
  secretaryEmail: '',
  chairmanEmail: ''
});

const progressWidth = computed(() => {
  if (step.value === 1) return '33%';
  if (step.value === 2) return '66%';
  return '100%';
});

const nextStep = () => step.value++;
const prevStep = () => step.value--;

const handleFinalSubmit = async () => {
  loading.value = true;
  try {
    await createClub({
      name: form.value.clubName,
      sport: form.value.sport,
      county: form.value.county,
      color: form.value.color
    }, user.value);
    
    await fetchProfile();
    
    showToast('Club Created', `Welcome to SportOS, ${form.value.firstName}!`, 'success');
    router.push('/admin');
  } catch (error) {
    console.error(error);
    showToast('Error', 'Could not create club. Try again.', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[100px] -z-10"></div>

    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
      
      <!-- Header -->
      <div class="bg-slate-900 p-8 text-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10"></div>
        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 shadow-inner">
          <BrandLogo class="w-10 h-10" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Setup Your Club</h1>
        <p class="text-indigo-200 text-sm">Step {{ step }} of 3</p>
        <div class="w-full h-1 bg-slate-800 mt-6 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-500 transition-all duration-500" :style="{ width: progressWidth }"></div>
        </div>
      </div>

      <!-- Dynamic Step Component -->
      <div class="p-8">
        <StepClubDetails v-if="step === 1" :form="form" @next="nextStep" />
        <StepUserProfile v-if="step === 2" :form="form" @next="nextStep" />
        <StepInviteOfficials v-if="step === 3" :form="form" :loading="loading" @submit="handleFinalSubmit" />
      </div>

    </div>
    
    <button v-if="step > 1" @click="prevStep" class="mt-8 text-slate-400 text-sm font-bold hover:text-slate-600 transition">
      Go Back
    </button>
    <button v-else @click="$router.push('/')" class="mt-8 text-slate-400 text-sm font-bold hover:text-slate-600 transition">
      Cancel
    </button>

  </div>
</template>
