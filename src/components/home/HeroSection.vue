<template>
  <!-- Header -->
  <header id="header" class="header">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 text-center text-md-start">
          <div class="text-container">
            <h1 class="h1-large">
              The #1 CRM app for
              <span class="replace-me">small business, young startups, bootstrappers</span>
            </h1>
            <p class="p-large">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dignissim, neque ut vanic
              barem ultrices sollicitudin
            </p>
            <Button
              label="Add projects for free"
              icon="pi pi-check"
              size="large"
              severity="primary"
            />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="image-container">
            <img
              class="img-fluid"
              src="https://images.unsplash.com/vector-1740835853238-233633b61af2?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="alternative"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from "primevue/button";
</script>

<style lang="scss">
/* Animation for rotating text */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation: fadeIn 0.6s;
  animation: fadeIn 0.6s;
}

/* Header Styles */
#header {
  padding-top: 6rem;
  padding-bottom: 9rem;
  background-color: #fff2dc;
}

.header .h1-large {
  margin-bottom: 1.25rem;
  color: #272556;
  font-weight: 600;
  font-size: 2.5rem;
  line-height: 3.25rem;
  letter-spacing: -0.4px;
}

.header .replace-me {
  color: #f25c05;
}

.header .replace-me span {
  text-decoration: underline;
}

.header .p-large {
  margin-bottom: 2.75rem;
  color: #565578;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.header .btn-solid-lg {
  display: block;
  margin-bottom: 1.75rem;
  padding: 1.625rem 2.625rem;
  border: 1px solid #272556;
  border-radius: 30px;
  background-color: #272556;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
}

.header .btn-solid-lg:hover {
  background-color: transparent;
  color: #272556;
  text-decoration: none;
}

.header .text-container {
  margin-bottom: 5rem;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .header {
    padding-top: 9rem;
  }

  .header .h1-large {
    font-size: 3.75rem;
    line-height: 4.625rem;
  }
}

@media (min-width: 992px) {
  .header {
    padding-top: 12rem;
    padding-bottom: 12rem;
    text-align: left;
  }

  .header .text-container {
    margin-bottom: 0;
  }

  .header .btn-solid-lg {
    display: inline-block;
    margin-bottom: 0;
  }
}

@media (min-width: 1200px) {
  .header {
    overflow: hidden;
    padding-top: 18.5rem;
    padding-bottom: 18rem;
  }

  .header .image-container {
    position: relative;
  }

  .header .image-container img {
    position: absolute;
    top: -180px;
    left: -10px;
    width: 840px;
    max-width: none;
  }
}
</style>
