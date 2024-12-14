<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
        <!-- Header -->
        <div class="sm:flex sm:items-center mb-8">
            <div class="sm:flex-auto">
                <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
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
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                                        class="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                    >
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr
                                    v-for="product in products.data"
                                    :key="product.id"
                                    class="hover:bg-gray-50"
                                >
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
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
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                    >
                                        <button
                                            @click="editProduct(product)"
                                            class="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            @click="deleteProduct(product.id)"
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

        <!-- Pagination -->
        <div class="mt-6">
            <pagination
                :links="products.links"
                @page="fetchProducts"
                class="flex justify-center"
            />
        </div>
    </div>

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
                            >
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
                                        @click="createOrUpdateProduct"
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
import { ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { usePage, router, Link } from "@inertiajs/vue3";
import axios from "axios";

// Reactive state to hold products
const products = ref([]);
const showCreateProductModal = ref(false);
const modalTitle = ref("");
const toast = useToast();
const initial_form = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
};
const form = ref(initial_form);

const createProduct = () => {
    form.value = initial_form;
    showCreateProductModal.value = true;
    modalTitle.value = "Create";
};

const editProduct = (product) => {
    // form.value = initial_form;
    form.value = product;
    modalTitle.value = "Edit";
    showCreateProductModal.value = true;
};

const fetchProducts = () => {
    axios.get(`/products`).then((response) => {
        products.value = response.data;
        console.log(products);
    });
};

const createOrUpdateProduct = () => {
    if (form.value.id) {
        axios
            .put(`/products/${form.value.id}`, form.value)
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
