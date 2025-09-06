// Dynamic ECharts loader for better performance
import { defineAsyncComponent } from 'vue'
import EChartsLoading from './EChartsLoading.vue'
import EChartsError from './EChartsError.vue'

// Lazy load ECharts components only when needed
export const VChart = defineAsyncComponent({
  loader: async () => {
    // Dynamic imports for tree-shaking
    const [
      { use },
      { CanvasRenderer },
      { LineChart, BarChart, PieChart },
      {
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        GridComponent,
        DataZoomComponent,
        ToolboxComponent
      },
      VChartComponent
    ] = await Promise.all([
      import('echarts/core'),
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
      import('vue-echarts')
    ])

    // Register components
    use([
      CanvasRenderer,
      LineChart,
      BarChart,
      PieChart,
      TitleComponent,
      TooltipComponent,
      LegendComponent,
      GridComponent,
      DataZoomComponent,
      ToolboxComponent
    ])

    return VChartComponent.default
  },
  loadingComponent: EChartsLoading,
  errorComponent: EChartsError,
  delay: 100,
  timeout: 10000
})
