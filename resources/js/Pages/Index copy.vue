<template>
    <AuthenticatedLayout>
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            <!-- Header -->
            <div class="sm:flex sm:items-center mb-8">
                <div class="sm:flex-auto">
                    <h1 class="text-2xl font-semibold text-gray-900">
                        Products
                    </h1>
                    <p class="mt-2 text-sm text-gray-700">
                        A list of all products in your inventory including their
                        name, price, and current stock levels.
                    </p>
                </div>
            </div>
            <button
                @click="createProduct"
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
                Create Product
            </button>
            <!-- Table -->
            <div class="mt-8 flex flex-col">
                <div class="-mx-4 my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle">
                        <div
                            class="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg"
                        >
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            Image
                                        </th>
                                        <th
                                            scope="col"
                                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Stock
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Created At
                                        </th>
                                        <th
                                            scope="col"
                                            class="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                        >
                                            <span class="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <tr
                                        v-for="product in products.data"
                                        :key="product.id"
                                        class="hover:bg-gray-50"
                                    >
                                        <td
                                            class="whitespace-nowrap py-1 text-sm font-medium text-gray-900 sm:pl-6"
                                        >
                                            <img
                                                class="w-12 h-auto rounded"
                                                :src="product.image_url"
                                                alt=""
                                            />
                                        </td>
                                        <td
                                            class="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                        >
                                            {{ product.name }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                        >
                                            {{ product.price }}
                                        </td>

                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-sm"
                                        >
                                            <span
                                                :class="[
                                                    product.stock > 10
                                                        ? 'text-green-600 bg-green-100'
                                                        : 'text-red-600 bg-red-100',
                                                    'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                                                ]"
                                            >
                                                {{ product.stock }}
                                            </span>
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                        >
                                            {{
                                                format(
                                                    new Date(
                                                        product.created_at
                                                    ),
                                                    "dd MMM yyyy"
                                                )
                                            }}
                                        </td>
                                        <td
                                            class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                        >
                                            <button
                                                @click="editProduct(product)"
                                                class="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                @click="
                                                    deleteProduct(product.id)
                                                "
                                                class="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ======================================== Pagination =============================================== -->
            <div v-if="products.current_page" class="">
                <div class="max-w-none -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                    <div class="bg-white overflow-hidden shadow sm:rounded-lg">
                        <div
                            class="bg-white px-4 py-3 flex items-center justify-between"
                        >
                            <div
                                class="flex-1 flex justify-between sm:hidden"
                            />
                            <div
                                class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
                            >
                                <div class="flex items-center space-x-4">
                                    <!-- Records per page dropdown moved to the left -->
                                    <div class="flex items-center space-x-2">
                                        <label
                                            for="recordsPerPage"
                                            class="text-sm text-gray-700"
                                            >Records per page:</label
                                        >
                                        <select
                                            id="recordsPerPage"
                                            v-model="perPage"
                                            @change="handlePerPageChange"
                                            class="border border-gray-300 rounded-md text-sm px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="3">3</option>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                    <!-- Divider between dropdown and results text -->
                                    <div class="h-4 w-px bg-gray-300"></div>
                                    <!-- Showing results text -->
                                    <p
                                        class="text-sm text-gray-700 text-primary"
                                    >
                                        Showing
                                        <span class="font-medium">{{
                                            products.from
                                        }}</span>
                                        to
                                        <span class="font-medium">{{
                                            products.to
                                        }}</span>
                                        of
                                        <span class="font-medium">{{
                                            products.total
                                        }}</span>
                                        results
                                    </p>
                                </div>
                                <div>
                                    <button
                                        @click.prevent="updatePageNumber(link)"
                                        v-for="(link, index) in products.links"
                                        :key="index"
                                        :disabled="link.active || !link.url"
                                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        :class="{
                                            'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':
                                                link.active,
                                            'bg-white border-gray-300 text-gray-500 hover:bg-gray-50':
                                                !link.active,
                                        }"
                                    >
                                        <span
                                            v-html="link.label"
                                            class="text-primary"
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ======================================== Pagination Ends Here ===================================== -->
        </div>
    </AuthenticatedLayout>
    <!-- ==================================== Create or Update Shipment Modal ================================== -->
    <div v-if="showCreateProductModal">
        <!-- Modal backdrop with blur effect -->
        <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
        ></div>

        <!-- Modal container -->
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
                <div
                    class="relative w-full max-w-2xl transform rounded-xl bg-white shadow-2xl transition-all"
                >
                    <!-- Modal Header with decorative element -->
                    <div
                        class="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    ></div>

                    <div class="p-6">
                        <div class="space-y-6">
                            <div>
                                <h3
                                    class="text-2xl font-semibold text-gray-900 flex items-center gap-2"
                                >
                                    <span
                                        class="h-8 w-1 bg-indigo-500 rounded-full"
                                    ></span>
                                    {{ modalTitle }} Product
                                </h3>
                                <p class="mt-2 text-sm text-gray-500">
                                    Fill in the details below to
                                    {{ modalTitle.toLowerCase() }} your product
                                </p>
                            </div>

                            <form
                                @submit.prevent="createOrUpdateProduct"
                                class="space-y-6"
                                enctype="multipart/form-data"
                            >
                                <!-- File Upload Input -->
                                <div class="space-y-2">
                                    <label
                                        for="product_image"
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Product Image
                                    </label>
                                    <div class="flex items-center gap-4">
                                        <!-- Image Preview -->
                                        <div
                                            v-if="imagePreview"
                                            class="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300"
                                        >
                                            <img
                                                :src="imagePreview"
                                                class="w-full h-full object-cover"
                                                alt="Product preview"
                                            />
                                            <button
                                                @click="clearImage"
                                                type="button"
                                                class="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <span class="sr-only"
                                                    >Remove image</span
                                                >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="h-4 w-4 text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <!-- Upload Input -->
                                        <div class="flex-1">
                                            <label
                                                for="product_image"
                                                class="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                                            >
                                                <div
                                                    class="space-y-1 text-center"
                                                >
                                                    <svg
                                                        class="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        />
                                                    </svg>
                                                    <div
                                                        class="text-sm text-gray-600"
                                                    >
                                                        <span
                                                            class="font-medium text-indigo-600 hover:text-indigo-500"
                                                        >
                                                            Click to upload
                                                        </span>
                                                        or drag and drop
                                                    </div>
                                                    <p
                                                        class="text-xs text-gray-500"
                                                    >
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                                <input
                                                    @change="handleImageUpload"
                                                    id="product_image"
                                                    name="product_image"
                                                    type="file"
                                                    accept="image/*"
                                                    class="sr-only"
                                                />
                                            </label>
                                            <p
                                                v-if="errors.image"
                                                class="mt-2 text-sm text-red-600"
                                            >
                                                {{ errors.image }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <!-- Product Name -->
                                <div class="space-y-2">
                                    <label
                                        for="product_name"
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Product Name
                                    </label>
                                    <input
                                        v-model="form.name"
                                        type="text"
                                        id="product_name"
                                        placeholder="Enter product name"
                                        class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    />
                                    <p
                                        v-if="errors.name"
                                        class="mt-2 text-sm text-red-600"
                                    >
                                        {{ errors.name }}
                                    </p>
                                </div>

                                <!-- Description - Now a textarea -->
                                <div class="space-y-2">
                                    <label
                                        for="description"
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        v-model="form.description"
                                        id="description"
                                        rows="4"
                                        placeholder="Provide a detailed description of your product"
                                        class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                    ></textarea>
                                    <p
                                        v-if="errors.description"
                                        class="mt-2 text-sm text-red-600"
                                    >
                                        {{ errors.description }}
                                    </p>
                                </div>

                                <!-- Price with currency symbol -->
                                <div class="space-y-2">
                                    <label
                                        for="product_price"
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Price
                                    </label>
                                    <div class="relative rounded-lg">
                                        <div
                                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                                        >
                                            <span
                                                class="text-gray-500 sm:text-sm"
                                                >Rs</span
                                            >
                                        </div>
                                        <input
                                            v-model="form.price"
                                            type="number"
                                            step="0.01"
                                            id="product_price"
                                            placeholder="0.00"
                                            class="w-full rounded-lg border-gray-300 pl-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <p
                                        v-if="errors.price"
                                        class="mt-2 text-sm text-red-600"
                                    >
                                        {{ errors.price }}
                                    </p>
                                </div>

                                <!-- Stock with number input -->
                                <div class="space-y-2">
                                    <label
                                        for="stock"
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Available Stock
                                    </label>
                                    <div class="relative rounded-lg">
                                        <input
                                            v-model="form.stock"
                                            type="number"
                                            min="0"
                                            id="stock"
                                            placeholder="Enter available quantity"
                                            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <p
                                        v-if="errors.stock"
                                        class="mt-2 text-sm text-red-600"
                                    >
                                        {{ errors.stock }}
                                    </p>
                                </div>

                                <!-- Action Buttons with improved styling -->
                                <div
                                    class="flex items-center justify-end gap-4 pt-4"
                                >
                                    <button
                                        type="button"
                                        @click="showCreateProductModal = false"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                                    >
                                        {{ modalTitle }} Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue";
import { format } from "date-fns";
import axios from "axios";

// Reactive state to hold products
const products = ref([]);
const showCreateProductModal = ref(false);
const modalTitle = ref("");
const toast = useToast();
const errors = ref({});
const pageNumber = ref(1);
const perPage = ref(3);
const imagePreview = ref(null);
const initial_form = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null,
};
const form = ref(initial_form);

// Image upload handler
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);

        delete errors.value.image;
    }
};

// Clear image
const clearImage = () => {
    form.value.image = null;
    imagePreview.value = null;
    delete errors.value.image;
    // Reset the file input
    const fileInput = document.getElementById("product_image");
    if (fileInput) fileInput.value = "";
};

// Cleanup object URL on component unmount
onBeforeUnmount(() => {
    if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
    }
});

const createProduct = () => {
    form.value = initial_form;
    errors.value = {};
    showCreateProductModal.value = true;
    modalTitle.value = "Create";
    imagePreview.value = null;
};

const editProduct = (product) => {
    form.value = product;
    errors.value = {};
    modalTitle.value = "Edit";
    showCreateProductModal.value = true;
    imagePreview.value = null;
};

const fetchProducts = () => {
    axios
        .get(`/products`, {
            params: { page: pageNumber.value, perPage: perPage.value },
        })
        .then((response) => {
            products.value = response.data;
            console.log(products);
        });
};

//pagination
const updatePageNumber = (link) => {
    pageNumber.value = link.url.split("=")[1];
    fetchProducts();
};

const handlePerPageChange = () => {
    pageNumber.value = 1; //displays the result from page 1
    fetchProducts();
};

const validateForm = () => {
    const newErrors = {};

    // name validation
    if (!form.value.name) {
        newErrors.name = "Product name is required";
    } else if (form.value.name.length > 255) {
        newErrors.name = "Product name must be less than 255 characters";
    }

    // price validation
    if (!form.value.price) {
        newErrors.price = "Price is required";
    } else if (isNaN(Number(form.value.price))) {
        newErrors.price = "Price must be a number";
    } else if (Number(form.value.price) < 0) {
        newErrors.price = "Price cannot be negative";
    }

    // stock validation
    if (!form.value.stock) {
        newErrors.stock = "Stock quantity is required";
    } else if (!Number.isInteger(Number(form.value.stock))) {
        newErrors.stock = "Stock must be a whole number";
    } else if (Number(form.value.stock) < 0) {
        newErrors.stock = "Stock cannot be negative";
    }

    // image validation
    if (form.value.image) {
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/jpg",
        ];
        if (!validTypes.includes(form.value.image.type)) {
            newErrors.image =
                "Please upload a valid image file (JPEG, PNG, GIF, JPG)";
        } else if (form.value.image.size > 2 * 1024 * 1024) {
            newErrors.image = "Image size must be less than 2MB";
        }
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const createOrUpdateProduct = () => {
    //validate form before submission
    if (!validateForm()) {
        toast.error("Please fix the form errors");
        return;
    }

    // Create a new FormData object
    const formData = new FormData();

    // Append form data
    formData.append("name", form.value.name);
    formData.append("description", form.value.description);
    formData.append("price", form.value.price);
    formData.append("stock", form.value.stock);
    if (form.value.image) {
        formData.append("image", form.value.image);
    }

    try {
        if (form.value.id) {
            axios
                .post(`/products/${form.value.id}`, formData)
                .then((response) => {
                    toast.success("Product Updated Successfully!");
                    console.log(response);
                    fetchProducts();
                })
                .catch((err) => {
                    toast.error("Error Updating Product");
                    console.log("Error Updating Product", err);
                })
                .finally((showCreateProductModal.value = false));
        } else {
            axios
                .post(`/products`, form.value)
                .then((response) => {
                    toast.success("Product Created Successfully!");
                    console.log(response);
                    fetchProducts();
                })
                .catch((err) => {
                    toast.error("Error creating Product");
                    console.log("Error creating Product", err);
                })
                .finally((showCreateProductModal.value = false));
        }
    } catch (error) {
        // handle validation errors from the server
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            toast.error("Please fix the form errors");
        } else {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
};

const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
        axios
            .delete(`/products/${id}`)
            .then((response) => {
                toast.success("Product deleted successfully!");
                fetchProducts(); //Refresh product list
            })
            .catch((error) => {
                toast.error("Error deleting product");
                console.log("Error deleting product: ", error);
            });
    }
};

fetchProducts();
// watch(
//     form.value,
//     (newVal) => {
//         console.log(newVal);
//     },
//     { deep: true }
// );
</script>
