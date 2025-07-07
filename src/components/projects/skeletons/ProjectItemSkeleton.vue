<template>
  <div>
    <div class="card">
      <div class="card-body">
        <!-- title and tag -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-1">
          <Skeleton width="10rem" height="1.5rem" borderRadius="4px" />
          <Skeleton width="5rem" height="1.5rem" borderRadius="20px" />
        </div>
        <!-- short summary & other info -->
        <Skeleton width="100%" height="3rem" class="mb-2" borderRadius="4px" />
        <!-- button -->
        <div class="mt-3">
          <Skeleton width="6rem" height="2rem" borderRadius="6px" />
        </div>
      </div>
      <!-- image -->
      <Skeleton width="100%" height="150px" borderRadius="0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from "primevue/skeleton";
</script>
