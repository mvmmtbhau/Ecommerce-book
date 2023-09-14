<script setup>

</script>

<template>
    <footer class="bg-white pt-16 pb-12 border-t border-gray-100">
        <div class="container max-w-[80%] grid grid-cols-3">
            <!-- footer text -->
            <div class="col-span-1 space-y-8">
                <img src="../../assets/images/logo.svg" class="w-30">
                <p class="text-gray-500 w-[80%]">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <div class="flex space-x-6">
                    <a href="#" class="text-gray-400 hover:text-gray-500">
                        <font-awesome-icon :icon="['fab', 'facebook']" />
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-500">
                        <font-awesome-icon :icon="['fab', 'twitter']" />
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-500">
                        <font-awesome-icon :icon="['fab', 'facebook']" />
                    </a>
                    <a href="#" class="text-gray-400 hover:text-gray-500">
                        <font-awesome-icon :icon="['fab', 'facebook']" />
                    </a>
                </div>
            </div>
            <!-- footer links -->
            <div class="col-span-2 grid grid-cols-2 gap-8">
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Solutions</h3>
                        <div class="mt-4 space-y-4">
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Marketing</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Analytics</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Commerce</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Insights</a>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
                        <div class="mt-4 space-y-4">
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Pricing</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Documentation</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Guides</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">API Status</a>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
                        <div class="mt-4 space-y-4">
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">About</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Blog</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Jobs</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Press</a>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
                        <div class="mt-4 space-y-4">
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Claim</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Privacy</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Policy</a>
                            <a href="#" class="text-base text-gray-500 hover:text-gray-900 block">Terms</a>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    </footer>
</template>