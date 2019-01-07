/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const bpmnRouter = {
  path: '/bpmn',
  component: Layout,
  redirect: '/bpmn/create',
  name: '流程图',
  meta: {
    title: '流程图',
    icon: 'tree'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/bpmn/create'), // Parent router-view
      name: '创建流程图',
      meta: {
        title: '创建流程图',
        icon: 'tree'
      }
    },
    {
      path: 'update',
      component: () => import('@/views/bpmn/update'),
      name: '修改流程图',
      meta: {
        title: '修改流程图',
        icon: 'tree'
      }
    }
  ]
}

export default bpmnRouter
