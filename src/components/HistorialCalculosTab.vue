<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Historial de Prestaciones</div>
      <p>Registro de todas las prestaciones calculadas</p>
    </q-card-section>

    <q-card-section>
      <q-table
        :rows="prestacionesHistory"
        :columns="columns"
        row-key="id"
        flat
        bordered
      >
        <template v-slot:body-cell-Estado="props">
          <q-td :props="props">
            <q-badge :color="props.row.estado === 'Pendiente' ? 'orange' : 'blue'">
              {{ props.row.estado }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-Acciones="props">
          <q-td :props="props">
            <q-btn
              icon="description"
              flat
              round
              dense
              color="primary"
              @click="viewComprobante(props.row)"
              title="Ver Comprobante"
            />
            </q-td>
        </template>
        </q-table>
    </q-card-section>

    <q-dialog v-model="dialogBoletaPreview">
      <q-card style="width: 700px; max-width: 80vw;">
        <BoletaPagoComponent
          v-if="selectedBoleta"
          :boletaData="selectedBoleta"
          @close="dialogBoletaPreview = false"
        />
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue';

const prestacionesHistory = ref([
  // Datos de ejemplo para el historial
  {
    id: 1, empleado: 'Juan Pérez', tipo: 'Salario y Bonos', fecha: '01/06/2025', monto: '1164.0', estado: 'Pagado',
    boletaDetails: {
      calculoNo: 1, fecha: '01/06/2025', periodo: 'Junio de 2025', salarioBaseMostrado: 1200,
      informacionEmpleado: { nombre: 'Juan Pérez', id: '1', puesto: 'Desarrollador', salarioBase: 1200, departamento: 'IT' },
      conceptos: [
        { concepto: 'Salario Base', cantidad: '-', monto: 1200 },
        { concepto: 'Bono Productividad', cantidad: '-', monto: 100 }
      ],
      deducciones: [
        { concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 36 },
        { concepto: 'AFP Empleado', porcentaje: '7.25%', monto: 87 },
      ],
      aportesPatronales: [
        { concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 90 },
        { concepto: 'AFP Patronal', porcentaje: '8.75%', monto: 105 },
      ],
      totalIngresos: 1300, totalDeducciones: 123, totalAportesPatronales: 195, montoADepositarAlEmpleado: 1177, montoADepositarEnPlanillaUnica: 318,
    }
  },
  {
    id: 2, empleado: 'Maria Lopez', tipo: 'Aguinaldo', fecha: '05/04/2025', monto: '1000.0', estado: 'Pagado',
    boletaDetails: {
      calculoNo: 2, fecha: '05/04/2025', periodo: 'Abril de 2025', salarioBaseMostrado: 1000,
      informacionEmpleado: { nombre: 'Maria López', id: '2', puesto: 'Asistente', salarioBase: 1000, departamento: 'HR' },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1000 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 30 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 75 }],
      totalIngresos: 1000, totalDeducciones: 30, totalAportesPatronales: 75, montoADepositarAlEmpleado: 970, montoADepositarEnPlanillaUnica: 75,
    }
  },
  {
    id: 3, empleado: 'Carlos Ramirez', tipo: 'Vacaciones', fecha: '10/05/2025', monto: '500.0', estado: 'Pendiente',
    boletaDetails: {
      calculoNo: 3, fecha: '10/05/2025', periodo: 'Mayo de 2025', salarioBaseMostrado: 1500,
      informacionEmpleado: { nombre: 'Carlos Ramirez', id: '3', puesto: 'Gerente', salarioBase: 1500, departamento: 'Ventas' },
      conceptos: [{ concepto: 'Salario Base', cantidad: '-', monto: 1500 }],
      deducciones: [{ concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: 45 }],
      aportesPatronales: [{ concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: 112.5 }],
      totalIngresos: 1500, totalDeducciones: 45, totalAportesPatronales: 112.5, montoADepositarAlEmpleado: 1455, montoADepositarEnPlanillaUnica: 112.5,
    }
  }
]);

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo de Prestación', field: 'tipo', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha de Cálculo', field: 'fecha', align: 'left', sortable: true },
  { name: 'monto', label: 'Monto Total ($)', field: 'monto', align: 'right', format: val => `${parseFloat(val).toFixed(2)}`, sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'Acciones', label: 'Acciones', field: 'Acciones', align: 'center' },
];

const dialogBoletaPreview = ref(false);
const selectedBoleta = ref(null);

const viewComprobante = (prestacion) => {
  selectedBoleta.value = prestacion.boletaDetails;
  dialogBoletaPreview.value = true;
};
</script>