<script setup>
import OptionButton from './components/OptionButton.vue';
import HitungAi from './components/HitungAi.vue';
import LoadingView from './components/LoadingView.vue';
import { StoreData } from './Data/StoringData';
const store = StoreData();

import footerVue from './components/footerVue.vue';
import ContentWrapper from './components/ContentWrapper.vue';

</script>

<template>
  <main class="bg-lightMain dark:bg-darkMain ">
    <OptionButton/>
    <HitungAi/>
    <div v-if="store.loadingData === true">
      <LoadingView/>
    </div>
    <div v-else>
      <ContentWrapper/>
    </div>
  </main>
  <footerVue/>
</template>

