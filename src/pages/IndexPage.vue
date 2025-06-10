<template>
  <q-page class="q-pa-lg">
    <!-- Título principal -->
    <div class="q-mb-lg">
      <h3 class="text-h4 text-weight-bold text-black q-my-md">Panel de Control</h3>
      <p class="text-h6 text-grey-7 q-mb-xl">
        Bienvenido al Sistema de Gestión Empresarial. Seleccione un módulo para comenzar.
      </p>
    </div>

    <!-- Cards de estadísticas principales -->
    <div class="row gap-2 q-gutter-md q-mb-xl">
      <div class="col-4 col-sm-5 col-xs-6 col-md-3 col-lg-2">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-weight-bold">Empleados</div>
                <div class="text-h4 text-[#0250DC] q-mt-sm">{{ stats.empleados }}</div>
                <div class="text-caption text-grey-6">Empleados activos</div>
              </div>
              <q-icon name="people" size="48px" style="color: #0250dc" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-sm-5 col-xs-6 col-md-3 col-lg-2">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-weight-bold">Boletas de Pago</div>
                <div class="text-h4 text-[#f7bc20] q-mt-sm">{{ stats.boletas }}</div>
                <div class="text-caption text-grey-6">Boletas generadas</div>
              </div>
              <q-icon name="receipt_long" size="48px" style="color: #f7bc20" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-sm-5 col-xs-6 col-md-3 col-lg-2">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-weight-bold">Prestaciones</div>
                <div class="text-h4 text-[#f7bc20] q-mt-sm">{{ stats.prestaciones }}</div>
                <div class="text-caption text-grey-6">Prestaciones pendientes</div>
              </div>
              <q-icon name="card_giftcard" size="48px" style="color: #f7bc20" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-sm-5 col-xs-6 col-md-3 col-lg-2">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-weight-bold">Ausencias</div>
                <div class="text-h4 text-[#0250DC] q-mt-sm">{{ stats.ausencias }}</div>
                <div class="text-caption text-grey-6">Por revisar</div>
              </div>
              <q-icon name="event_busy" size="48px" style="color: #0250dc" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Sección inferior: Actividad reciente y Resumen mensual -->
    <div class="row q-gutter-md">
      <!-- Actividad reciente -->
      <div class="col-12 col-md-5">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="schedule" class="q-mr-sm" />
              Actividad Reciente
            </div>
            <div class="text-base q-mb-md font-light">
              Últimas acciones realizadas en el sistema
            </div>
            <q-separator class="q-mb-md" />
            <q-list>
              <q-item v-for="(activity, index) in recentActivity" :key="index">
                <q-item-section avatar>
                  <q-icon :name="activity.icon" :color="activity.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ activity.description }}</q-item-label>
                  <q-item-label caption>{{ activity.time }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resumen mensual -->
      <div class="col-12 col-md-5">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-sm">
              <q-icon name="bar_chart" class="q-mr-sm" />
              Resumen Mensual
            </div>
            <div class="text-base q-mb-md font-light">Estadísticas del mes actual</div>
            <q-separator class="q-mb-md" />
            <div class="q-gutter-md">
              <div class="row items-center justify-between">
                <span class="text-weight-medium">Nómina procesada:</span>
                <q-chip color="positive" text-color="white" icon="check">
                  ${{ monthlyStats.nomina.toLocaleString() }}
                </q-chip>
              </div>
              <div class="row items-center justify-between">
                <span class="text-weight-medium">Nuevos empleados:</span>
                <q-chip color="primary" text-color="white" icon="person_add">
                  {{ monthlyStats.nuevosEmpleados }}
                </q-chip>
              </div>
              <div class="row items-center justify-between">
                <span class="text-weight-medium">Ausencias totales:</span>
                <q-chip color="warning" text-color="white" icon="event_busy">
                  {{ monthlyStats.ausenciasTotales }}
                </q-chip>
              </div>
              <div class="row items-center justify-between">
                <span class="text-weight-medium">Prestaciones pagadas:</span>
                <q-chip color="info" text-color="white" icon="payment">
                  {{ monthlyStats.prestacionesPagadas }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Datos de estadísticas principales
const stats = ref({
  empleados: 248,
  boletas: 1543,
  prestaciones: 12,
  ausencias: 8,
})

// Actividad reciente
const recentActivity = ref([
  {
    icon: 'receipt_long',
    color: 'green',
    description: 'Nueva boleta de pago generada para Juan Pérez',
    time: 'Hace 15 minutos',
  },
  {
    icon: 'person_add',
    color: 'primary',
    description: 'Nuevo empleado registrado: María González',
    time: 'Hace 1 hora',
  },
  {
    icon: 'event_busy',
    color: 'orange',
    description: 'Solicitud de ausencia pendiente de aprobación',
    time: 'Hace 2 horas',
  },
  {
    icon: 'card_giftcard',
    color: 'purple',
    description: 'Prestación procesada para Carlos Ruiz',
    time: 'Hace 3 horas',
  },
  {
    icon: 'edit',
    color: 'info',
    description: 'Actualización de datos de empleado',
    time: 'Hace 4 horas',
  },
])

// Resumen mensual
const monthlyStats = ref({
  nomina: 2450000,
  nuevosEmpleados: 12,
  ausenciasTotales: 45,
  prestacionesPagadas: 8,
})
</script>

<style scoped>
.stat-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.full-height {
  height: 100%;
}
</style>
