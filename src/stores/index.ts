import { fa } from 'element-plus/es/locales.mjs'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAllDataStore = defineStore('allData', () => {
  const isCollapse = ref(false)
  const tags = ref([
    {
      path: '/home',
      name: 'home',
      label: '首页',
      icon: 'home',
    },
  ])
  let currentMenu = null

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  function selectMenu(val: any) {
    if (val.name == 'home') {
      currentMenu = null
    } else {
      currentMenu = val

      //这里添加如果点击的不是home时，先找一下tags中是否存在点击的菜单
      let index = tags.value.findIndex((item) => item.name === val.name)
      //如果不存在则添加到tags中
      index === -1 ? tags.value.push(val) : ''
    }
  }

  function closeTag(val: any) {
    tags.value = tags.value.filter((item) => item.name !== val.name)
  }

  return { isCollapse, toggleCollapse, tags, selectMenu, closeTag }
})
