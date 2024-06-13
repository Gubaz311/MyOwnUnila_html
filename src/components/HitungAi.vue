<script setup>
import { StoreData } from '@/Data/StoringData';
const store = StoreData();

//Getting values from memory
const f = store.memory.fakultas
const t = store.memory.tahun

const calc = () => {
    if(confirm("this will might take some time and memory")){
        store.fetchDataLulus(f, t)
    }
}
</script>

<template>
    <div class="container rounded-md my-2 bg-lightMain dark:bg-darkMain flex justify-end">
        <button class="bg-lightIcon dark:bg-darkIcon text-lightText dark:text-darkText shadow-md rounded-md p-2 mr-10 w-32 text-xl" @click="calc" >
            Calc by Ai
        </button>
    </div> 
</template>