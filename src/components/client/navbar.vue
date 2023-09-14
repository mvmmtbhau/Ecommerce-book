<script setup></script>

<template>
    <nav class="bg-gray-800">
        <div class="container max-w-[80%] flex">
            <!-- all category -->
            <div class="px-8 py-4 bg-primary flex items-center cursor-pointer relative group">
                <span class="text-white">
                    <font-awesome-icon :icon="['fas', 'bars']" />
                </span>
                <span class="capitalize ml-2 text-white">All categories</span>

                <div class="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed 
                opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
                    <a href="#" class="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                        <span class="ml-6 text-gray-600 text-sm">Sofa</span>
                    </a>
                    <a href="#" class="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                        <span class="ml-6 text-gray-600 text-sm">Sofa</span>
                    </a>
                    <a href="#" class="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                        <span class="ml-6 text-gray-600 text-sm">Sofa</span>
                    </a>
                    <a href="#" class="flex items-center px-6 py-3 hover:bg-gray-100 transition">
                        <span class="ml-6 text-gray-600 text-sm">Sofa</span>
                    </a>
                </div>
            </div>

            <!-- navbar links -->
            <div class="flex items-center justify-between flex-grow pl-12">
                <div class="flex items-center space-x-6 capitalize">
                    <a href="#" class="text-gray-200 hover:text-white transition">Home</a>
                    <a href="#" class="text-gray-200 hover:text-white transition">Shop</a>
                    <a href="#" class="text-gray-200 hover:text-white transition">About Us</a>
                    <a href="#" class="text-gray-200 hover:text-white transition">Contact Us</a>
                </div>
                <a href="#" class="text-gray-200 hover:text-white transition">Login/Register</a>
            </div>
        </div>
    </nav>
</template>