<script setup>
import ProductCardComponent from "@/components/client/product_card.vue";

const newProducts = ['product_1', 'product_2', 'product_3', 'product_4'];
</script>

<template>
    <div class="container max-w-[80%]">
        <!-- breadcrums -->
        <div class="py-4 flex items-center gap-3">
            <a href="#" class="text-primary text-base">
                <font-awesome-icon :icon="['fas', 'house']" />
            </a>
            <span class="text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </span>
            <p class="text-gray-600 font-medium">Shop</p>
        </div>

        <!-- shop wrapper -->
        <div class="container grid grid-cols-4 gap-6 pt-4 pb-16 items-start">
            <!-- sidebar -->
            <div class="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hidden">
                <div class="divide-y divide-gray-200 space-y-5">
                    <!-- category filter -->
                    <div class="">
                        <h3 class="text-xl text-gray-800 mb-3 uppercase font-medium">categories</h3>
                        <div class="space-y-2">
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                        </div>
                    </div>

                    <!-- brand filter -->
                    <div class="pt-4">
                        <h3 class="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
                        <div class="space-y-2">
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                            <!-- single category -->
                            <div class="flex items-center">
                                <input type="checkbox" id="cat-1"
                                    class="text-primary focus:ring-0 rounded-sm cursor-pointer">
                                <label for="cat-1" class="text-gray-600 ml-3 cursor-pointer">Bedroom</label>
                                <div class="ml-auto text-gray-600 text-sm">(15)</div>
                            </div>
                        </div>
                    </div>

                    <!-- price filter -->
                    <div class="pt-4">
                        <h3 class="text-xl text-gray-800 mb-3 uppercase font-medium">price</h3>
                        <div class="mt-4 flex items-center">
                            <input type="text"
                                class="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="min">
                            <span class="mx-3 text-gray-500">-</span>
                            <input type="text"
                                class="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="max">
                        </div>
                    </div>

                    <!-- size filter -->
                    <div class="pt-4">
                        <h3 class="text-xl text-gray-800 mb-3 uppercase font-medium">size</h3>
                        <div class="flex items-center gap-2">
                            <div class="size-selector">
                                <input type="radio" name="size" class="hidden" id="size-xs">
                                <label for="size-xs"
                                    class="text-xs border border-gray-200 rounded-sm h-6 w-6 
                                flex items-center justify-center cursor-pointer shadow-sm text-gray-600 uppercase transition">xs</label>
                            </div>
                            <div class="size-selector">
                                <input type="radio" name="size" class="hidden" id="size-xs">
                                <label for="size-xs"
                                    class="text-xs border border-gray-200 rounded-sm h-6 w-6 
                                flex items-center justify-center cursor-pointer shadow-sm text-gray-600 uppercase transition">xs</label>
                            </div>
                            <div class="size-selector">
                                <input type="radio" name="size" class="hidden" id="size-xs">
                                <label for="size-xs"
                                    class="text-xs border border-gray-200 rounded-sm h-6 w-6 
                                flex items-center justify-center cursor-pointer shadow-sm text-gray-600 uppercase transition">xs</label>
                            </div>
                            <div class="size-selector">
                                <input type="radio" name="size" class="hidden" id="size-xs">
                                <label for="size-xs"
                                    class="text-xs border border-gray-200 rounded-sm h-6 w-6 
                                flex items-center justify-center cursor-pointer shadow-sm text-gray-600 uppercase transition">xs</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- products -->
            <div class="col-span-3">
                <div class="flex items-center mb-4">
                    <!-- sorting -->
                    <select class="w-44 text-sm text-gray-600 px-4 py-3 border-gray-300 
                    shadow-sm rounded focus:ring-primary focus:border-primary">
                        <option value="">Default sorting</option>
                        <option value="">Price low-high</option>
                        <option value="">Price high-low</option>
                        <option value="">Latest product</option>
                    </select>

                    <!-- grid products -->
                    <div class="flex gap-2 ml-auto">
                        <div class="border border-primary w-10 h-9 flex items-center justify-center text-white bg-primary rounded cursor-pointer">
                            <font-awesome-icon :icon="['fas', 'grip-vertical']" />
                        </div>
                        <div class="border border-gray-300 w-10 h-9 flex items-center justify-center text-gray-600 rounded cursor-pointer">
                            <font-awesome-icon :icon="['fas', 'grip']" />
                        </div>
                    </div>
                </div>

                <ProductCardComponent :newProducts="newProducts" gridSettings="grid grid-cols-3 gap-6" />
            </div>
        </div>
    </div>
</template>