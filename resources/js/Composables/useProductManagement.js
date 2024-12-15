
import { ref, onMounted, watch, computed, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

export function useProductManagement() {
    // Reactive state to hold products
    const products = ref([]);
    const showCreateProductModal = ref(false);
    const modalTitle = ref("");
    const toast = useToast();
    const errors = ref({});
    const imagePreview = ref(null);
    const initial_form = {
        name: "",
        description: "",
        price: 0,
        stock: 0,
        image: null,
    };
    const form = ref(initial_form);

    // Pagination state
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalProducts = ref(0);
    const perPageOptions = [5, 10, 20, 50];


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

    // Fetch products with pagination
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/products`, {
                params: { page: currentPage.value, perPage: perPage.value },
            });
            products.value = response.data.data; // Assuming `data` contains products
            totalProducts.value = response.data.total; // Assuming `total` contains the total count
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const changePage = (page) => {
        currentPage.value = page;
        fetchProducts();
    };

    const changePerPage = (rows) => {
        perPage.value = rows;
        currentPage.value = 1; // Reset to first page
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
    return {
        products,
        showCreateProductModal,
        modalTitle,
        errors,
        imagePreview,
        form,
        currentPage,
        perPage,
        totalProducts,
        perPageOptions,
        handleImageUpload,
        clearImage,
        fetchProducts,
        validateForm,
        createOrUpdateProduct,
        deleteProduct,
        createProduct,
        editProduct,
        changePage,
        changePerPage,
    };
}