<template>
  <Button
    @click="confirmDelete"
    severity="danger"
    label="Delete project"
    size="small"
    icon="pi pi-trash"
    :loading="isDeleting"
    :disabled="isDeleting"
  />
  <ConfirmDialog group="deleteItem"></ConfirmDialog>
</template>

<script setup lang="ts">
import { useConfirm, useToast } from "primevue";
import Button from "primevue/button";
import ConfirmDialog from "primevue/confirmdialog";

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  title: {
    type: String,
    default: "Delete Item",
  },
  message: {
    type: String,
    default: "Do you want to delete this item?",
  },
  buttonAcceptLabel: {
    type: String,
    default: "Delete",
  },
  buttonRejectLabel: {
    type: String,
    default: "Cancel",
  },
  //used to show the loader
  isDeleting: {
    type: Boolean,
    default: false,
  },
  //callback to call if the delete is confirmed
  deleteCallback: {
    type: Function,
    required: true,
  },
});

const confirmDelete = () => {
  confirm.require({
    group: "deleteItem",
    message: props.message,
    header: props.title,
    icon: "pi pi-info-circle",
    position: "right",
    rejectProps: {
      label: props.buttonRejectLabel,
      severity: "secondary",
      outlined: true,
      size: "small",
    },
    acceptProps: {
      label: props.buttonAcceptLabel,
      severity: "danger",
      size: "small",
    },
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "You have accepted",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};
</script>
