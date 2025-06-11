<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Cálculo de Prestaciones</div>
      <p>Seleccione un empleado y el tipo de prestación para realizar el cálculo</p>
    </q-card-section>

    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">Empleado</div>
      <q-select
        outlined
        v-model="selectedEmployee"
        :options="employeeOptions"
        label="Seleccionar empleado"
        emit-value
        map-options
        @update:model-value="fetchEmployeeDetails"
        class="q-mb-md"
      />

      <div v-if="selectedEmployeeDetails" class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.horasExtrasDiurnas" label="Horas extras diurnas (hrs/mes)" type="number" />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.horasExtrasNocturnas" label="Horas extras nocturnas (hrs/mes)" type="number" />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.horasNocturnas" label="Horas nocturnas (hrs/mes)" type="number" />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.subsidioAlimentacion" label="Subsidio por alimentación" type="number" />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.diasVacaciones" label="Días de vacaciones" type="number" />
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input outlined v-model="calculationData.diasAguinaldo" label="Días de aguinaldo" type="number" />
        </div>
      </div>

      <q-btn color="primary" label="Calcular Prestacion" @click="calculatePrestacion" :disable="!selectedEmployee" />
    </q-card-section>

    <q-card-section v-if="selectedEmployeeDetails">
      <div class="text-h6 q-mb-md">Información del Empleado</div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-4">
          <strong>Nombre:</strong> {{ selectedEmployeeDetails.nombre }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Salario Base:</strong> ${{ selectedEmployeeDetails.salarioBase }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Fecha de Ingreso:</strong> {{ selectedEmployeeDetails.fechaIngreso }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Departamento:</strong> {{ selectedEmployeeDetails.departamento }}
        </div>
        <div class="col-xs-12 col-sm-4">
          <strong>Puesto:</strong> {{ selectedEmployeeDetails.puesto }}
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="showBoletaDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <BoletaPagoComponent
          v-if="calculatedBoletaData"
          :boletaData="calculatedBoletaData"
          @close="showBoletaDialog = false"
        />
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BoletaPagoComponent from 'src/components/BoletaPagoComponent.vue'; // Asegúrate de la ruta correcta

// Datos de ejemplo para empleados (reemplazar con datos reales de tu API)
const allEmployees = ref([
  { label: 'Juan Perez M.', value: '1', nombre: 'Juan Pérez', salarioBase: 1500, fechaIngreso: '01/05/2020', departamento: 'IT', puesto: 'Desarrollador' },
  { label: 'Maria Lopez S.', value: '2', nombre: 'Maria López', salarioBase: 1200, fechaIngreso: '15/03/2021', departamento: 'HR', puesto: 'Asistente' },
]);

const employeeOptions = ref([]); // Opciones formateadas para q-select

const selectedEmployee = ref(null);
const selectedEmployeeDetails = ref(null); // Detalles del empleado seleccionado

const calculationData = ref({
  horasExtrasDiurnas: 0,
  horasExtrasNocturnas: 0,
  horasNocturnas: 0,
  subsidioAlimentacion: 0,
  diasVacaciones: 0,
  diasAguinaldo: 0,
});

const showBoletaDialog = ref(false);
const calculatedBoletaData = ref(null);

onMounted(() => {
  // En un caso real, aquí harías una llamada a tu API para obtener los empleados
  employeeOptions.value = allEmployees.value.map(emp => ({
    label: emp.label,
    value: emp.value,
  }));
});

const fetchEmployeeDetails = () => {
  if (selectedEmployee.value) {
    selectedEmployeeDetails.value = allEmployees.value.find(emp => emp.value === selectedEmployee.value);
    // Reiniciar los campos de cálculo al cambiar de empleado
    calculationData.value = {
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasNocturnas: 0,
      subsidioAlimentacion: 0,
      diasVacaciones: 0,
      diasAguinaldo: 0,
    };
  } else {
    selectedEmployeeDetails.value = null;
  }
};

const calculatePrestacion = () => {
  if (!selectedEmployee.value) {
    console.error('No se ha seleccionado ningún empleado.');
    return;
  }

  const baseSalary = selectedEmployeeDetails.value.salarioBase;
  const horasExtrasDiurnasMonto = calculationData.value.horasExtrasDiurnas * 1.5 * (baseSalary / 30 / 8); // Ejemplo simple
  const horasExtrasNocturnasMonto = calculationData.value.horasExtrasNocturnas * 2.0 * (baseSalary / 30 / 8); // Ejemplo
  const horasNocturnasMonto = calculationData.value.horasNocturnas * 0.25 * (baseSalary / 30 / 8); // Recargo nocturno

  const subsidioAlimentacionMonto = calculationData.value.subsidioAlimentacion;
  const diasVacacionesMonto = (baseSalary / 30) * calculationData.value.diasVacaciones;
  const diasAguinaldoMonto = (baseSalary / 30) * calculationData.value.diasAguinaldo;

  // Deducciones
  const isssEmpleadoMonto = baseSalary * 0.03;
  const afpEmpleadoMonto = baseSalary * 0.0725;
  const isrMonto = baseSalary * 0.10; // Ejemplo simple de ISR

  // Aportes Patronales
  const isssPatronalMonto = baseSalary * 0.075;
  const afpPatronalMonto = baseSalary * 0.0875;

  const totalIngresos = baseSalary + horasExtrasDiurnasMonto + horasExtrasNocturnasMonto + horasNocturnasMonto + subsidioAlimentacionMonto + diasVacacionesMonto + diasAguinaldoMonto;
  const totalDeducciones = isssEmpleadoMonto + afpEmpleadoMonto + isrMonto;
  const totalAportesPatronales = isssPatronalMonto + afpPatronalMonto;
  const montoADepositarAlEmpleado = totalIngresos - totalDeducciones;
  const montoADepositarEnPlanillaUnica = totalAportesPatronales; // Puede variar según la lógica real


  calculatedBoletaData.value = {
    calculoNo: Math.floor(Math.random() * 100) + 1, // Número aleatorio
    fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    periodo: 'Mayo de 2025', // O calcula el período real
    salarioBaseMostrado: baseSalary,
    informacionEmpleado: {
      nombre: selectedEmployeeDetails.value.nombre,
      id: selectedEmployee.value,
      puesto: selectedEmployeeDetails.value.puesto,
      salarioBase: selectedEmployeeDetails.value.salarioBase,
      departamento: selectedEmployeeDetails.value.departamento,
    },
    conceptos: [
      { concepto: 'Salario Base', cantidad: '-', monto: baseSalary },
      { concepto: 'Horas Extras Diurnas', cantidad: calculationData.value.horasExtrasDiurnas, monto: horasExtrasDiurnasMonto },
      { concepto: 'Horas Extras Nocturnas', cantidad: calculationData.value.horasExtrasNocturnas, monto: horasExtrasNocturnasMonto },
      { concepto: 'Horas Nocturnas (Recargo)', cantidad: calculationData.value.horasNocturnas, monto: horasNocturnasMonto },
      { concepto: 'Subsidio por Alimentación', cantidad: '-', monto: subsidioAlimentacionMonto },
      { concepto: 'Vacaciones', cantidad: calculationData.value.diasVacaciones, monto: diasVacacionesMonto },
      { concepto: 'Aguinaldo', cantidad: calculationData.value.diasAguinaldo, monto: diasAguinaldoMonto },
    ].filter(item => item.monto > 0), // Filtra conceptos con monto 0

    deducciones: [
      { concepto: 'ISSS Empleado', porcentaje: '3.0%', monto: isssEmpleadoMonto },
      { concepto: 'AFP Empleado', porcentaje: '7.25%', monto: afpEmpleadoMonto },
      { concepto: 'ISR', porcentaje: '-', monto: isrMonto },
    ].filter(item => item.monto > 0),

    aportesPatronales: [
      { concepto: 'ISSS Patronal', porcentaje: '7.5%', monto: isssPatronalMonto },
      { concepto: 'AFP Patronal', porcentaje: '8.75%', monto: afpPatronalMonto },
    ].filter(item => item.monto > 0),

    totalIngresos: totalIngresos,
    totalDeducciones: totalDeducciones,
    totalAportesPatronales: totalAportesPatronales,
    montoADepositarAlEmpleado: montoADepositarAlEmpleado,
    montoADepositarEnPlanillaUnica: montoADepositarEnPlanillaUnica,
  };

  showBoletaDialog.value = true;
};
</script>

<style scoped>
/* Estilos específicos si los necesitas */
</style>