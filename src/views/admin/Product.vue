<script setup>
import categoryService from "@/services/category";
import productService from "@/services/product";
import { onBeforeMount, ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const categories = ref();
const products = ref();

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1)
const search = ref();

const editor = ref(ClassicEditor)
const editorConfig = ref({});

const editedItem = ref({
    id: '',
    name: '',
    price: '',
    author: '',
    quantity: '',
    description: '',
    category: '',
    images: [],
})
const defaultItem = ref({
    id: '',
    name: '',
    price: '',
    author: '',
    quantity: '',
    description: '',
    category: '',
    images: []
});

const required = (v) => {
    return !!v || 'Field is required'
}

const limitChar = (v, limited) => {
    return v.length < limited || `Tối đa ${limited} kí tự`
}

const notNegative = () => {
    if (editedItem.value.price < 0) editedItem.value.price = 0;
    if (editedItem.value.quantity < 0) editedItem.value.quantity = 0;
}

const formTitle = ref('add');

const columns = [
    {
        key: "name",
        title: "Tên sản phẩm",
    },
    {
        key: "author",
        title: "Tác giả",
    },
    {
        key: "price",
        title: "Giá ($)",
    },
    {
        key: "quantity",
        title: "Số lượng",
    },
    {
        key: "category",
        value: "category.title",
        sortable: false,
        title: "Danh mục",
    },
    {
        key: "createdAt",
        title: "Ngày tạo",
    },
    {
        key: "actions",
        title: "",
        sortable: false,
    }
]

const cateList = async () => {
    const result = await categoryService.getCategories();
    if (result.status == 200) categories.value = result.data.data;
    if (search.value) search.value = '';
};

const productList = async () => {
    const result = await productService.adminGet();
    if (result.status == 200) products.value = result.data.products;
    if (search.value) search.value = '';
}

const close = () => {
    dialog.value = false;
    editedItem.value = defaultItem.value;
    editedIndex.value = -1;
    formTitle.value = "add";
}

const closeDelete = () => {
    dialogDelete.value = false;
    editedItem.value = defaultItem.value;
    editedIndex.value = -1;
}

const editItem = (item) => {
    editedIndex.value = products.value.indexOf(item);
    formTitle.value = 'edit';
    editedItem.value = {
        id: item._id,
        name: item.name,
        price: item.price,
        author: item.author,
        quantity: item.quantity,
        category: item.category,
        description: item.description,
    };
    dialog.value = true;
}

const save = async () => {
    try {
        const isNullish = Object.values(editedItem.value).some(value => {
            if(!value.id) return false;
            if (!value) return true;
            return false
        })
        if (isNullish) return toast.warn('Bạn chưa điền đầy đủ thông tin', { position: 'top-center' });
        if (editedItem.value.images.length > 4) {
            return toast.warn('Tối đa 4 ảnh', { position: 'top-center' })
        };

        if (formTitle.value == 'add') {
            const formData = new FormData();

            editedItem.value.images.forEach(image => {
                formData.append('photos', image)
            })
            formData.append('name', editedItem.value.name)
            formData.append('price', editedItem.value.price)
            formData.append('author', editedItem.value.author)
            formData.append('quantity', editedItem.value.quantity)
            formData.append('category', editedItem.value.category)
            formData.append('description', editedItem.value.description)

            const result = await productService.addNew(formData);

            if (result.status == 201) {
                close();
                toast.success(result.data.msg);
            }

            if (result.status == 200 || result.status == 202) toast.warn(result.data.msg, { position: 'top-center' });
        } else {
            const result = await productService.updateProduct(editedItem.value);
            if (result.status == 201) {
                close();
                toast.success(result.data.msg);
            }

            if (result.status == 200 || result.status == 202) toast.warn(result.data.msg, { position: 'top-center' });
            if (result.status == 203) toast.error(result.data.msg, { position: 'top-center' });
        }
        productList();
    } catch (err) {
        console.log(err);
    }
}

const deleteItem = (item) => {
    editedIndex.value = products.value.indexOf(item);
    editedItem.value = {
        id: item._id,
        name: item.name
    };
    dialogDelete.value = true;
}

const deleteConfirm = async () => {
    const result = await productService.deleteProduct(editedItem.value.id);

    if (result.status == 202) toast.error(result.data.msg);
    if (result.status == 200) {
        toast.success(result.data.msg);
    }
    closeDelete();
    productList();
}

onBeforeMount(() => {
    cateList();
    productList();
});

watch(search, () => {
    products.value = products.value.filter(pro => pro.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1);
    if (search.value == '') productList();
});

;

</script>

<template>
    <v-data-table :headers="columns" :items="products" :sort-by="[{ key: 'createdAt', order: 'desc' }]" items-per-page="5">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Sản phẩm</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Tìm kiếm" single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-divider class="mx-4" inset vertical></v-divider>
                <!-- Modal -->
                <v-dialog v-model="dialog" fullscreen persistent :scrim="false" transition="dialog-bottom-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mb-2" v-bind="props">Thêm mới</v-btn>
                    </template>
                    <v-card>
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="close()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ formTitle == 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'
                            }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn variant="text" @click="save()">
                                    Lưu
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-card-text>
                            <v-container>
                                <v-row cols="12">
                                    <span id="errorMsg"></span>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.name" label="Tên sản phẩm *"
                                            :rules="[required, limitChar(editedItem.description, 100)]"
                                             >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.author" label="Tác giả *" :rules="[required]"
                                            ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.price" prefix="$" @change="notNegative()"
                                            type="number" label="Giá *" :rules="[required]" ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field v-model="editedItem.quantity" @change="notNegative()" type="number"
                                            label="Số lượng *" :rules="[required]" ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select v-model="editedItem.category" :items="categories" item-text="title" item-value="_id" label="Danh mục *"
                                            :rules="[required]"></v-select>
                                    </v-col>
                                    <v-col cols="12">
                                        <p class="text-gray-500 text-sm">Mô tả sản phẩm *</p>
                                        <ckeditor :editor="editor" v-model="editedItem.description" :config="editorConfig"></ckeditor>
                                    </v-col>
                                    <v-col v-if="formTitle == 'add'" cols="12">
                                        <v-file-input v-model="editedItem.images" chips show-size counter multiple label="Ảnh sản phẩm (tối đa 4 ảnh) *"></v-file-input>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small class="text-red">* Mục bắt buộc phải nhập</small>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                    <v-card>
                        <v-card-title class="text-h5">Bạn có muốn xóa sản phẩm '{{ editedItem.name }}'?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete()">Hủy</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteConfirm()">Xóa</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <div class="flex items-center gap-3">
                <font-awesome-icon :icon="['fas', 'pencil']" @click="editItem(item.raw)"
                    class="cursor-pointer text-gray-600 hover:text-gray-800 transition" />
                <font-awesome-icon :icon="['fas', 'trash']" @click="deleteItem(item.raw)"
                    class="cursor-pointer text-gray-600 hover:text-gray-800 transition" />
            </div>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="productList()">
                Reset
            </v-btn>
        </template>
    </v-data-table>
</template>