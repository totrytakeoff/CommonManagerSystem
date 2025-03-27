import { fa } from 'element-plus/es/locales.mjs'
import {defineStore} from 'pinia'
import { computed, ref } from 'vue'






export const useAllDataStore = defineStore('allData',()=>{
    
    const isCollapse = ref(false)
    function toggleCollapse(){
        isCollapse.value = !isCollapse.value
    }

    
    
    return {isCollapse,
        toggleCollapse,
    }
        

})