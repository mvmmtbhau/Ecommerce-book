<script setup>
import CategoryService from "@/services/category";
import { onBeforeMount, ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";

const categories = ref();

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1)
const search = ref();

const editedItem = ref({
    id: '',
    title: ''
})
const defaultItem = ref({
    id: '',
    title: ''
});

const required = (v) => {
    return !!v || 'Field is required'
}

const formTitle = ref('add');

const columns = [
    {
        key: "title",
        title: "Tên danh mục",
    },
    {
        key: "num",
        title: "Tổng sản phẩm",
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
    const result = await CategoryService.getCategories();
    if (result.status == 200) categories.value = result.data.data;
    if (search.value) search.value = '';
};

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
    editedIndex.value = categories.value.indexOf(item);
    formTitle.value = 'edit';
    editedItem.value = {
        id: item._id,
        title: item.title
    };
    dialog.value = true;
}

const save = async () => {
    if (formTitle.value == 'add') {
        const result = await CategoryService.addNew(editedItem.value);

        if (result.status == 201) {
            toast.success(result.data.message);
            close();
            cateList();
        }

        if (result.status == 200 || result.status == 202) toast.warn(result.data.message);
    } else {
        const result = await CategoryService.updateCate(editedItem.value);
        if (result.status == 201) {
            toast.success(result.data.message);
            close();
            cateList();
        }

        if (result.status == 200 || result.status == 202) toast.warn(result.data.message);
        if (result.status == 203) toast.error(result.data.message);
    }


}

const deleteItem = (item) => {
    editedIndex.value = categories.value.indexOf(item);
    editedItem.value = {
        id: item._id,
        title: item.title
    };
    dialogDelete.value = true;
}

const deleteConfirm = async () => {
    const result = await CategoryService.deleteCate(editedItem.value.id);

    if (result.status == 202) toast.error(result.data.message);
    if (result.status == 200) {
        toast.success(result.data.message);
        closeDelete();
        cateList();
    }
}

onBeforeMount(() => {
    cateList();
});

watch(search, () => {
    categories.value = categories.value.filter(cate => cate.title.toLowerCase().indexOf(search.value.toLowerCase()) > -1);
    if (search.value == '') cateList();
});

</script>

<template>
    <v-data-table :headers="columns" :items="categories" :sort-by="[{ key: 'title', order: 'desc' }]" items-per-page="5">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Danh mục</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Tìm kiếm" single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-divider class="mx-4" inset vertical></v-divider>
                <!-- Modal -->
                <v-dialog v-model="dialog" max-width="500px" persistent>
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" dark class="mb-2" v-bind="props">Thêm mới</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field :rules="[required]" v-model="editedItem.title"
                                            label="Tên danh mục"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="close">Hủy</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="save">Lưu</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                    <v-card>
                        <v-card-title class="text-h5">Bạn có muốn xóa danh mục '{{ editedItem.title }}'?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Hủy</v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteConfirm">Xóa</v-btn>
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
            <v-btn color="primary" @click="cateList">
                Reset
            </v-btn>
        </template>
    </v-data-table>
</template>