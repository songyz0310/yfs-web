/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const bpmnRouter = {
    path: '/bpmn',
    component: Layout,
    redirect: '/bpmn/create',
    name: 'Bpmn',
    meta: {
        title: 'bpmn',
        icon: 'bpmn-io'
    },
    children: [{
            path: 'create',
            component: () =>
                import ('@/views/bpmn/create'), // Parent router-view
            name: 'CreateBpmn',
            meta: {
                title: 'createBpmn',
                icon: 'tree'
            }
        },
        {
            path: 'watch',
            component: () =>
                import ('@/views/bpmn/watch'),
            name: 'WatchBpmn',
            meta: {
                title: 'watchBpmn',
                icon: 'open-eye'
            }
        }
    ]
}

export default bpmnRouter