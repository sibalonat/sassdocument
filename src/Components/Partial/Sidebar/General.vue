<script setup>
import TitleInput from '@/Components/Partial/FormInputs/TitleInput.vue';
import Boolean from '@/Components/Icons/Boolean.vue';
import Text from '@/Components/Icons/Text.vue';
import Integer from '@/Components/Icons/Integer.vue';
import DateTime from '@/Components/Icons/DateTime.vue';

const emit = defineEmits(['type']);

</script>
<template>
    <div class="flex flex-col w-full mt-8">
      <TitleInput />
    </div>
    <div class="flex flex-col w-full mt-8 gap-y-2">
      <p class="mb-1 text-lg font-medium uppercase text-neutral-800">
        data types
      </p>
      <div class="flex flex-row w-full p-2 border rounded-md cursor-pointer group gap-x-4" @click="emit('type', 'boolean')">
        <div class="basis-2/12 opacity-30 group-hover:opacity-100">
          <Boolean />
        </div>
        <div class="my-auto basis-9/12">
          <p class="text-3xl font-semibold uppercase text-neutral-500 group-hover:text-neutral-950">boolean</p>
        </div>
      </div>
      <div class="flex flex-row w-full p-2 border rounded-md cursor-pointer group gap-x-4" @click="emit('type', 'datetime')">
        <div class="basis-2/12 opacity-30 group-hover:opacity-100">
          <DateTime />
        </div>
        <div class="my-auto basis-9/12">
          <p class="text-3xl font-semibold uppercase text-neutral-500 group-hover:text-neutral-950">datetime</p>
        </div>
      </div>
      <div class="flex flex-row w-full p-2 border rounded-md cursor-pointer group gap-x-4" @click="emit('type', 'integer')">
        <div class="basis-2/12 opacity-30 group-hover:opacity-100">
          <Integer />
        </div>
        <div class="my-auto basis-9/12">
          <p class="text-3xl font-semibold uppercase text-neutral-500 group-hover:text-neutral-950">integer</p>
        </div>
      </div>
      <div class="flex flex-row w-full p-2 border rounded-md cursor-pointer group gap-x-4" @click="emit('type', 'text')">
        <div class="basis-2/12 opacity-30 group-hover:opacity-100">
          <Text />
        </div>
        <div class="my-auto basis-9/12">
          <p class="text-3xl font-semibold uppercase text-neutral-500 group-hover:text-neutral-950">Text</p>
        </div>
      </div>
    </div>
</template>

