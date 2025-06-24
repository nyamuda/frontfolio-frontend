<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-1">
          <h5 class="card-title mb-0 text-secondary">Card title</h5>
          <Tag severity="primary" value="Published"></Tag>
        </div>
        <p class="card-text">
          This is a wider card with supporting text below as a natural lead-in to additional
          content. This content is a little bit longer.
        </p>
        <div class="">
          <Button label="View more" severity="contrast" size="small" />
        </div>
      </div>
      <img
        src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp"
        class="card-img-bottom"
        alt="Camera"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from "primevue/tag";
import Button from "primevue/button";
</script>
