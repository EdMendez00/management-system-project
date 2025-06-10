const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'empleados', component: () => import('pages/EmpleadosPage.vue') },
      { path: 'prestaciones', component: () => import('pages/PrestacionesPage.vue') },
      { path: 'ausencias', component: () => import('pages/AusenciasPage.vue') },
      { path: 'boletapago', component: () => import('pages/BoletaPagoPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
