<template>
  <div class="container-fluid mt-5">
    <h1 class="text-center mb-4">User Information Form</h1>
    <form @submit.prevent="submitForm">
      <div class="row mb-3">
        <div class="col-6">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            @blur="() => validateName(true)"
            @input="() => validateName(false)"
            v-model="formData.username"
          />
          <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
        </div>
        <div class="col-6">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            @blur="() => validatePassword(true)"
            @input="() => validatePassword(false)"
            v-model="formData.password"
          />
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6 d-flex align-items-center">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="isAustralian"
              v-model="formData.isAustralian"
              name="isAustralian"
              @change="() => validateResident(true)"
            />
            <label class="form-check-label ms-2" for="isAustralian">Australian Resident?</label>
          </div>
          <div v-if="errors.resident" class="text-danger ms-2">{{ errors.resident }}</div>
        </div>
        <div class="col-6">
          <label for="gender" class="form-label">Gender</label>
          <select
            class="form-select"
            id="gender"
            v-model="formData.gender"
            @change="() => validateGender(true)"
          >
            <option value="">Choose gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
        </div>
      </div>
      <div class="mb-3">
        <label for="reason" class="form-label">Reason for joining</label>
        <textarea
          class="form-control"
          id="reason"
          v-model="formData.reason"
          rows="3"
          @blur="() => validateReason(true)"
          @input="() => validateReason(false)"
        ></textarea>
        <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary me-2">Submit</button>
        <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
      </div>
    </form>
    <!-- PrimeVue DataTable 展示用户数据 -->
    <div v-if="submittedCards.length" class="mt-5">
      <DataTable :value="submittedCards" responsiveLayout="scroll" stripedRows>
        <PrimeColumn field="username" header="Username"></PrimeColumn>
        <PrimeColumn field="password" header="Password"></PrimeColumn>
        <PrimeColumn field="isAustralian" header="Australian Resident">
          <template #body="slotProps">
            {{ slotProps.data.isAustralian ? 'true' : 'false' }}
          </template>
        </PrimeColumn>
        <PrimeColumn field="gender" header="Gender"></PrimeColumn>
        <PrimeColumn field="reason" header="Reason"></PrimeColumn>
      </DataTable>
    </div>
    <!-- User Info Cards -->
    <div v-if="submittedCards.length" class="cards-row mt-5">
      <div
        v-for="(card, index) in submittedCards"
        :key="index"
        class="card mx-2 mb-4"
        style="min-width: 16rem; max-width: 100%"
      >
        <div class="card-header">User Information</div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Username: {{ card.username }}</li>
          <li class="list-group-item">Password: {{ card.password }}</li>
          <li class="list-group-item">
            Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
          </li>
          <li class="list-group-item">Gender: {{ card.gender }}</li>
          <li class="list-group-item">Reason: {{ card.reason }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: '',
})

const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)
  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: '',
  }
}

const errors = ref({
  username: null,
  password: null,
  reason: null,
  gender: null,
  resident: null,
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be a least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUpperCase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowerCase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.resident = 'You must be an Australian resident to register'
  } else {
    errors.value.resident = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select your gender'
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  if (!formData.value.reason.trim()) {
    if (blur) errors.value.reason = 'Please provide a reason for joining'
  } else if (formData.value.reason.length < 10) {
    if (blur) errors.value.reason = 'Reason description must be at least 10 characters long'
  } else {
    errors.value.reason = null
  }
}
</script>

<style scoped>
.cards-row {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}


:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #e069bd;
  color: #fff;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #1a3a7c;
  padding: 14px 24px;
}


:deep(.p-datatable .p-datatable-tbody > tr > td) {
  background: #f8faff;
  color: #222;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 24px;
}


:deep(.p-datatable .p-datatable-tbody > tr:hover > td) {
  background: #e6f0ff;
}


:deep(.p-datatable) {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(39, 95, 218, 0.08);
  border: 1px solid #d0d7e5;
  margin-top: 24px;
}


:deep(.p-paginator) {
  background: #f8faff;
  border-radius: 0 0 10px 10px;
  border-top: 1px solid #d0d7e5;
}
</style>
