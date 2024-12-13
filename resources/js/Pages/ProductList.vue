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
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            products: {},
        };
    },
    methods: {
        fetchProducts(page = 1) {
            axios.get(`/api/products?page=${page}`).then((response) => {
                this.products = response.data;
            });
        },
        deleteProduct(id) {
            if (confirm("Are you sure you want to delete this product?")) {
                axios
                    .delete(`/api/products/${id}`)
                    .then(() => {
                        this.fetchProducts();
                    })
                    .catch((error) => {
                        console.error("Error deleting product:", error);
                    });
            }
        },
        editProduct(product) {
            // Implement edit functionality
            console.log("Edit product:", product);
        },
    },
    mounted() {
        this.fetchProducts();
    },
};
</script>
