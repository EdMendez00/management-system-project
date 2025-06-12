<template>
  <q-page class="q-pa-lg">
    <!-- Título principal -->
    <div class="q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <h3 class="text-h4 text-weight-bold text-black q-my-md">Panel de Control</h3>
          <p class="text-h6 text-grey-7 q-mb-xl">
            Bienvenido al Sistema de Gestión Empresarial. Seleccione un módulo para comenzar.
          </p>
        </div>
        <q-btn
          color="primary"
          icon="refresh"
          label="Actualizar Datos"
          @click="actualizarDatos"
          outline
        />
      </div>
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
                <div class="text-caption text-grey-6">
                  {{ stats.empleados === 0 ? 'Sin empleados registrados' : 'Empleados activos' }}
                </div>
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
                <div class="text-caption text-grey-6">
                  {{ stats.boletas === 0 ? 'Sin boletas generadas' : 'Boletas generadas' }}
                </div>
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
                <div class="text-caption text-grey-6">
                  {{
                    stats.prestaciones === 0
                      ? 'Sin prestaciones pendientes'
                      : 'Prestaciones pendientes'
                  }}
                </div>
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
                <div class="text-caption text-grey-6">
                  {{ stats.ausencias === 0 ? 'Sin ausencias pendientes' : 'Por revisar' }}
                </div>
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
import { ref, onMounted, computed } from 'vue'

// Datos reactivos que se cargarán desde localStorage
const empleados = ref([])
const historialPrestaciones = ref([])
const ausencias = ref([])

// Función para cargar datos desde localStorage
const cargarDatos = () => {
  // Cargar empleados
  const empleadosGuardados = localStorage.getItem('empleados')
  empleados.value = empleadosGuardados ? JSON.parse(empleadosGuardados) : []

  // Cargar historial de prestaciones
  const prestacionesGuardadas = localStorage.getItem('historialPrestaciones')
  historialPrestaciones.value = prestacionesGuardadas ? JSON.parse(prestacionesGuardadas) : []

  // Cargar ausencias
  const ausenciasGuardadas = localStorage.getItem('ausencias')
  ausencias.value = ausenciasGuardadas ? JSON.parse(ausenciasGuardadas) : []

  console.log('Datos cargados:', {
    empleados: empleados.value.length,
    prestaciones: historialPrestaciones.value.length,
    ausencias: ausencias.value.length,
  })
}

// Estadísticas calculadas dinámicamente
const stats = computed(() => {
  const ausenciasPendientes = ausencias.value.filter((a) => a.estado === 'Pendiente').length
  const prestacionesPendientes = historialPrestaciones.value.filter(
    (p) => p.estado === 'Pendiente',
  ).length

  return {
    empleados: empleados.value.length,
    boletas: historialPrestaciones.value.length, // Total de boletas generadas
    prestaciones: prestacionesPendientes,
    ausencias: ausenciasPendientes,
  }
})

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos()
})

// Actividad reciente dinámica basada en datos reales
const recentActivity = computed(() => {
  const activities = []

  // Agregar actividades de prestaciones recientes
  const prestacionesRecientes = historialPrestaciones.value.slice(0, 2).map((p) => ({
    icon: 'receipt_long',
    color: 'green',
    description: `Nueva boleta de pago generada para ${p.empleado}`,
    time: `${p.fecha}`,
  }))

  // Agregar actividades de empleados recientes (últimos 2)
  const empleadosRecientes = empleados.value.slice(0, 1).map((e) => ({
    icon: 'person_add',
    color: 'primary',
    description: `Empleado registrado: ${e.nombre}`,
    time: 'Reciente',
  }))

  // Agregar actividades de ausencias pendientes
  const ausenciasPendientes = ausencias.value
    .filter((a) => a.estado === 'Pendiente')
    .slice(0, 2)
    .map((a) => ({
      icon: 'event_busy',
      color: 'orange',
      description: `Solicitud de ausencia de ${a.empleado} pendiente`,
      time: `${a.fechaInicio}`,
    }))

  // Combinar todas las actividades
  activities.push(...prestacionesRecientes, ...empleadosRecientes, ...ausenciasPendientes)

  // Si no hay actividades, mostrar mensaje por defecto
  if (activities.length === 0) {
    return [
      {
        icon: 'info',
        color: 'grey',
        description: 'No hay actividad reciente',
        time: 'Sistema iniciado',
      },
    ]
  }

  return activities.slice(0, 5) // Mostrar máximo 5 actividades
})

// Resumen mensual dinámico
const monthlyStats = computed(() => {
  const totalNomina = historialPrestaciones.value.reduce((sum, p) => sum + (p.monto || 0), 0)
  const nuevosEmpleados = empleados.value.length // Simplificado - en un sistema real sería por mes
  const ausenciasTotales = ausencias.value.length
  const prestacionesPagadas = historialPrestaciones.value.filter(
    (p) => p.estado === 'Pagado',
  ).length

  return {
    nomina: totalNomina,
    nuevosEmpleados: nuevosEmpleados,
    ausenciasTotales: ausenciasTotales,
    prestacionesPagadas: prestacionesPagadas,
  }
})

// Función para actualizar datos manualmente
const actualizarDatos = () => {
  cargarDatos()
  console.log('Datos actualizados desde localStorage')
}
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
