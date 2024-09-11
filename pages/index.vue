<template>
  <header
    class="flex items-center justify-between h-20 rounded-2xl bg-[#18181b] mb-5 px-9"
  >
    <h1 class="text-4xl" id="logo">Logo</h1>
    <ul class="flex items-center [&>li]:text-lg [&>li:hover]:underline">
      <li class="cursor-pointer" @click="closeModal = false">ImportAPI</li>
      <li class="ml-4">
        <NuxtLink to="https://imagga.com/" target="_blank">GetAPI</NuxtLink>
      </li>
      <li class="ml-4">
        <NuxtLink to="https://github.com/ngocxhoi" target="_blank"
          >GitHub</NuxtLink
        >
      </li>
    </ul>
  </header>

  <!-- Modal -->
  <div
    class="fixed top-40 left-1/2 -translate-x-1/2 flex flex-col items-center min-h-40 p-4 min-w-[400px] bg-[#262626] rounded-2xl transition-all duration-1000"
    :class="{ 'top-[-100%]': closeModal }"
  >
    <div class="flex items-center justify-between w-full">
      <h3 class="text-xl hover:text-red-500 transition-colors duration-300">
        Import API Key
      </h3>
      <button
        @click="closeModal = true"
        class="px-4 py-2 text-white border-white border hover:border-[#d5224e] rounded transition-all duration-300 hover:bg-[#d5224e]"
      >
        X
      </button>
    </div>

    <input
      v-model="authHeader"
      class="w-full my-8 bg-transparent border rounded-full border-white h-10 outline-none px-4 focus:border-red-500 text-red-500"
      type="text"
    />

    <button
      @click="setApi()"
      class="px-3 py-2 hover:bg-red-500 bg-transparent border border-white hover:border-red-500 rounded-xl transition-colors"
    >
      Save
    </button>
  </div>

  <!-- Image Analysis -->
  <div class="grid md:grid-cols-3 gap-5 min-w-[300px]">
    <div class="bg-[#18181b] p-8 rounded-2xl">
      <h3 class="mb-6 text-2xl">Upload Your Image</h3>
      <div class="flex gap-2">
        <div class="flex flex-col flex-grow">
          <label
            for="imageInput"
            class="py-2 px-4 bg-[#27292e] text-white text-center mb-4 rounded cursor-pointer transition-all duration-300 hover:bg-[#d5224e]"
          >
            Chose File
          </label>
          <button
            :disabled="isAnalyze"
            @click="handleAnalyzeImage()"
            class="py-2 px-4 bg-[#27292e] text-white rounded transition-all duration-300"
            :class="[
              !isAnalyze
                ? 'hover:bg-[#d5224e] cursor-pointer'
                : 'cursor-not-allowed',
            ]"
            id="uploadButton"
          >
            Analyze Image
          </button>
        </div>
        <input
          @input="onChange()"
          type="file"
          ref="file"
          hidden
          id="imageInput"
          accept="image/*"
        />
      </div>
      <div class="w-full overflow-hidden">
        <img
          :src="fileDisplay || '/no-file-chosen.png'"
          class="w-full h-full object-cover mt-8 rounded-lg"
          id="imagePreview"
          alt=""
        />
      </div>
    </div>

    <div class="bg-[#18181b] p-8 rounded-2xl flex flex-col gap-5 md:col-span-2">
      <p v-if="!dataColors" class="text-xl">Nothing to show ...</p>
      <div v-else class="flex flex-col">
        <p class="text-2xl text-white mb-6">Background colors</p>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div
            v-for="color in dataColors?.result.colors.background_colors"
            class="flex justify-between mb-3 group cursor-pointer last:mb-0 bg-[#262626] py-2 px-3 rounded"
          >
            <div
              class="flex items-center"
              @click="
                copyToClipboard(
                  color.html_code,
                  color.closest_palette_color_parent
                )
              "
            >
              <div
                class="size-6 rounded-full mr-2"
                :style="`background-color:${color.html_code}`"
              />
              <p class="font-light text-gray-400 group-hover:text-gray-200">
                {{ color.html_code }} -
                {{ color.closest_palette_color_parent }}
              </p>
            </div>

            <div class="flex items-center w-1/2">
              <div class="bg-white w-full h-3 rounded-full my-auto py-0.5 mr-2">
                <div
                  :style="`width: ${color.percent.toFixed(2)}%`"
                  class="bg-red-500 rounded-full h-2 float-right"
                />
              </div>
              <p class="w-20">{{ color.percent.toFixed(2) }}%</p>
            </div>
          </div>
        </div>
        <p class="text-2xl text-white my-6">Foreground colors</p>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div
            v-for="color in dataColors?.result?.colors?.foreground_colors"
            class="flex justify-between mb-3 group cursor-pointer last:mb-0 bg-[#262626] py-2 px-3 rounded"
          >
            <div
              class="flex items-center"
              @click="
                copyToClipboard(
                  color.html_code,
                  color.closest_palette_color_parent
                )
              "
            >
              <div
                class="size-6 rounded-full mr-2"
                :style="`background-color:${color.html_code}`"
              />
              <p class="font-light text-gray-400 group-hover:text-gray-200">
                {{ color.html_code }} -
                {{ color.closest_palette_color_parent }}
              </p>
            </div>

            <div class="flex items-center w-1/2">
              <div class="bg-white w-full h-3 rounded-full my-auto py-0.5 mr-2">
                <div
                  :style="`width: ${color.percent.toFixed(2)}%`"
                  class="bg-red-500 rounded-full h-2 float-right"
                />
              </div>
              <p class="w-20">{{ color.percent.toFixed(2) }}%</p>
            </div>
          </div>
        </div>
        <p class="text-2xl text-white my-6">Image colors</p>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div
            v-for="color in dataColors?.result?.colors?.image_colors"
            class="flex justify-between mb-3 group cursor-pointer last:mb-0 bg-[#262626] py-2 px-3 rounded"
          >
            <div
              class="flex items-center"
              @click="
                copyToClipboard(
                  color.html_code,
                  color.closest_palette_color_parent
                )
              "
            >
              <div
                class="size-6 rounded-full mr-2"
                :style="`background-color:${color.html_code}`"
              />
              <p class="font-light text-gray-400 group-hover:text-gray-200">
                {{ color.html_code }} -
                {{ color.closest_palette_color_parent }}
              </p>
            </div>

            <div class="flex items-center w-1/2">
              <div class="bg-white w-full h-3 rounded-full my-auto py-0.5 mr-2">
                <div
                  :style="`width: ${color.percent.toFixed(2)}%`"
                  class="bg-red-500 rounded-full h-2 float-right"
                />
              </div>
              <p class="w-20">{{ color.percent.toFixed(2) }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tags -->
  <div class="mt-5 bg-[#18181b] p-8 rounded-2xl min-w-[300px]">
    <h3 class="text-2xl mb-8">Image Tags</h3>
    <p v-if="!dataTags" class="text-xl">Nothing to show ...</p>
    <div v-else class="results flex flex-wrap justify-center">
      <div
        v-for="tag in showDataTags"
        class="bg-black text-white rounded-xl m-1 py-2 px-3"
      >
        <span>{{ tag.tag.en }}</span>
      </div>
    </div>
    <div class="w-full flex justify-center mt-4">
      <button
        @click="tagsPerPage += 20"
        :disabled="seeMoreDisabled"
        class="py-2 px-4 mr-4 bg-[#27292e] text-white rounded transition-all duration-300"
        :class="[
          !seeMoreDisabled
            ? 'hover:bg-[#d5224e] cursor-pointer'
            : 'cursor-not-allowed',
        ]"
        id="seeMoreButton"
      >
        See More
      </button>
      <button
        @click="exportTags()"
        class="py-2 px-4 bg-[#27292e] text-white rounded cursor-pointer transition-all duration-300 hover:bg-[#d5224e]"
        id="exportTagsButton"
      >
        Export Tags
      </button>
    </div>
  </div>

  <!-- Upload Modal -->
  <div
    id="uploadModal"
    class="fixed z-50 left-0 top-0 size-full overflow-auto bg-black/70"
    :class="{ hidden: !isUploading }"
  >
    <div
      class="bg-[#333] my-[20%] p-5 max-w-[400px] text-center mx-auto rounded-xl cursor-progress"
    >
      <h3>Uploading Image...</h3>
      <div>
        <div ref="progressBar" id="progress-bar"></div>
      </div>
    </div>
  </div>

  <div
    id="ToastContainer"
    class="fixed bottom-20 right-20 transition-all"
  ></div>
</template>

<script setup lang="ts">
interface APIRes {
  result?: {
    upload_id: string;
  };
  status: {
    text: string;
    type: string;
  };
}

useHead({
  title: "Image Detector",
});

const authHeader = ref("");

onMounted(() => {
  const token = useCookie("auth_header").value;
  if (token) {
    authHeader.value = token;
  }
});

const tagsPerPage = ref(20);
const file = ref();
const progressBar = ref();
const fileDisplay = ref();
const fileData = ref();
const showToast = ref(false);
const isUploading = ref(false);
const uploadId = ref("");
const dataTags = ref();
const dataColors = ref();
const textError = ref("");
const isAnalyze = ref(false);
const closeModal = ref(true);

const onChange = () => {
  resetStatus();
  fileDisplay.value = URL.createObjectURL(file.value.files[0]);
  fileData.value = file.value.files[0];
  isAnalyze.value = false;
};

function setApi() {
  useCookie("auth_header").value = authHeader.value;
  closeModal.value = true;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetStatus() {
  tagsPerPage.value = 20;
  progressBar.value = null;
  showToast.value = false;
  isUploading.value = false;
  uploadId.value = "";
  dataTags.value = null;
  dataColors.value = null;
  isAnalyze.value = false;
}

function copyToClipboard(str: string, name: string): void {
  addToast(`Color ${name} is copied to clipboard!`);
  navigator.clipboard.writeText(str);
  showToast.value = true;
  textError.value = `You are copy color ${name} to clipboard`;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function removeToast(toast: HTMLElement) {
  toast.remove();
}
function addToast(message: string): void {
  const notifications = document.getElementById("ToastContainer");
  const toast = document.createElement("div");
  toast.classList.add(
    "animate-[show-toast_3s_ease_forwards]",
    "my-2",
    "bg-[#262626]"
  );
  toast.innerHTML = `<div class="border-2 border-red-500 px-4 py-2 rounded-lg text-red-500">
        ${message}
      </div>`;
  notifications?.appendChild(toast);

  setTimeout(() => {
    removeToast(toast);
  }, 3000);
}

function exportTags() {
  if (!dataTags.value) {
    addToast("No data tags to export");
    return;
  }
  const tagsText = dataTags.value.result.tags
    .map((tag: { tag: { confidence: number; en: string } }) => tag.tag.en)
    .join("\n");

  const blob = new Blob([tagsText], {
    type: "text/plain",
  });

  // download function
  const tags = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = tags;
  a.download = "tags.txt";
  a.click();
  a.remove();
}

const handleAnalyzeImage = async () => {
  if (!fileData.value) {
    addToast("Please chose an image first.");
    return;
  }
  if (authHeader.value == "") {
    addToast("Please click to GetAPI to get an api first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileData.value);
  try {
    isUploading.value = true;
    const { data } = await useFetch<APIRes>(
      "https://api.imagga.com/v2/uploads",
      {
        method: "POST",
        headers: {
          Authorization: authHeader.value,
        },
        body: formData,
      }
    );

    if (data.value?.status.type != "success") throw data.value;

    uploadId.value = data.value.result?.upload_id ?? "";

    useCookie("upload_id").value = uploadId.value;

    const [resultTags, resultColors] = await Promise.all([
      useFetch<APIRes>(
        `https://api.imagga.com/v2/tags?image_upload_id=${uploadId.value}`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader.value,
          },
        }
      ),
      useFetch<APIRes>(
        `https://api.imagga.com/v2/colors?image_upload_id=${uploadId.value}`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader.value,
          },
        }
      ),
    ]).catch((err) => {
      throw err;
    });

    const { data: dataTagsFetch, error: errorTags } = resultTags;
    dataTags.value = dataTagsFetch.value;
    if (errorTags.value) throw errorTags.value;

    const { data: dataColorsFetch, error: errorColors } = resultColors;
    dataColors.value = dataColorsFetch.value;
    if (errorColors.value) throw errorColors.value;

    isAnalyze.value = true;
  } catch (error: any) {
    console.log(error);
    createError(error);
  } finally {
    isUploading.value = false;
  }
};

const showDataTags = computed(() => {
  const tags = dataTags.value?.result?.tags;
  if (tags.length > tagsPerPage.value) return tags.slice(0, tagsPerPage.value);
  else return tags;
});

const seeMoreDisabled = computed(() => {
  const tags = dataTags.value?.result?.tags;
  return Boolean(tags?.length <= tagsPerPage.value);
});
</script>

<style>
@keyframes show-toast {
  0% {
    opacity: 0;
    transform: translateX(calc(100% + 5rem));
  }
  10% {
    opacity: 1;
    transform: translateX(-5%);
  }
  20% {
    transform: translateX(0%);
  }
  30%,
  70% {
    transform: translateX(-10px);
    transform: translateY(0px);
  }

  80% {
    transform: translateY(10px);
    opacity: 1;
  }

  99% {
    transform: translateY(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(calc(100% + 5rem));
    opacity: 0;
  }
}
</style>
