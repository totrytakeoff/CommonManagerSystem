// 定义 CountData 接口
export interface CountData {
  name: string
  value: number
  icon: string // 如果图标组件是动态加载的，可以暂时保留 any，后续优化
  color: string
}

// 定义 TableData 接口
export interface TableData {
  name: string
  todayBuy: number
  monthBuy: number
  totalBuy: number
}

// src/types.ts
export interface ChartData {
  code: number
  data: {
    orderData: {
      date: string[]
      data: OrderDataItem[]
    }
    videoData: VideoDataItem[]
    userData: UserDataItem[]
  }
}

export interface OrderDataItem {
  [key: string]: number // 动态键值对，键为品牌名称，值为数量
}

export interface VideoDataItem {
  name: string
  value: number
}

export interface UserDataItem {
  date: string
  new: number
  active: number
}

// 在 src/types/index.ts 或其他合适的地方添加这些接口

export interface XOptions {
  textStyle: {
    color: string
  }
  legend: {}
  grid: {
    left: string
    top?: string
  }
  tooltip: {
    trigger: string
  }
  xAxis: {
    type: string
    data: string[]
    axisLine: {
      lineStyle: {
        color: string
      }
    }
    axisLabel: {
      interval?: number
      rotate?: number
      color?: string
    }
  }
  yAxis: {
    type: string
    axisLine?: {
      lineStyle: {
        color: string
      }
    }
    name?: string
  }[]
  color: string[]
  series: {
    name: string
    data: number[]
    type: string
  }[]
}

export interface LineSeriesOption {
  name: string
  data: number[]
  type: 'line'
}

export interface BarSeriesOption {
  name: string
  data: number[]
  type: 'bar'
}

export interface PieOptions {
  tooltip: {
    trigger: string
  }
  legend: {}
  color: string[]
  series: {
    data: {
      value: number
      name: string
    }[]
    type: string
  }[]
}

export interface Config {
  url: string
  name: string
  total: number
  curPage: number
  body?: User[]
}

export interface User {
  id: string
  name: string
  addr: string
  age: number
  birth: string
  sex: number
}

// export type{ User}
