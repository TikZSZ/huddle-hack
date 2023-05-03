import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiscoverViewVue from '@/views/DiscoverView.vue'
import DashboardViewVue from '@/views/DashboardView.vue'
import ExperienceViewVue from '@/views/ExperienceView.vue'
import WrapUpViewVue from "@/views/WrapUp.vue"
import useStore from '@/stores/store'
import store from '@/stores/store'


const router = createRouter( {
  history: createWebHistory( import.meta.env.BASE_URL ),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/discover',
      name: 'discover',
      component: DiscoverViewVue,
    },
    {
      path: '/experience/:id',
      name: 'ExperienceDetails',
      component: ExperienceViewVue,
    },
    {
      path: '/wrapup/:id',
      name: 'WrapUp',
      component: WrapUpViewVue,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DashboardViewVue,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( '../views/AboutView.vue' )
    }
  ]
} )

router.beforeEach( async ( to, from, next ) =>
{
  const store = useStore()
  if ( to.matched.every( ( match ) => match.meta.requiresAuth )){
    try {
      await store.sVerifyUser()
    }catch(err){
      next({path:'/'})
      return
    }
    if(store.isLoggedIn()) {
      next()
      return
    }
    next({path:'/'})
    return
  }
  next()
  return
} )

export default router
