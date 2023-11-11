<template>
<div id="final-git-card">
    <div class="flex flex-row items-center relative justify-end space-x-4 py-3 pr-4">
        <div class="hover:text-accent select-none cursor-pointer transition-colors" @click="showEmbed !== true ? populateEmbedCode() : showEmbed = false">Embed</div>
        <div class="hover:text-accent select-none cursor-pointer transition-colors" @click="showShare = !showShare">Share</div>

        <Transition name="fade-in">
            <div v-if="showEmbed == true" :class="showEmbed == true ? 'opacity-100' : 'opacity-0'" class="transition-all duration-1000 fixed top-0 left-0 z-50 bg-dark/40 backdrop-blur-2xl w-full h-full">
                <div class="hover:text-accent transition-all fixed top-8 z-50 right-20 cursor-pointer text-2xl" @click="showEmbed = false">x</div>
                <div class="absolute m-auto inset-0 w-1/2 h-max flex flex-col justify-center border rounded-md  bg-darkLight px-8 py-6 overflow-hidden">
                    <div class="pb-4 text-xl">Heres your GitCard Code!</div>
                    <textarea id="embed-code" class="resize-none border-0 p-2 h-20 w-full text-sm text-white overflow-hidden appearance-none bg-dark focus:ring-0 focus:border-none"></textarea>
                </div>
            </div>
        </Transition>

        <Transition name="fade-in">
            <div v-if="showShare == true" :class="showShare == true ? 'opacity-100' : 'opacity-0'" class="transition-all duration-1000 fixed top-0 left-0 z-50 bg-dark/40 backdrop-blur-2xl w-full h-full">
                <div class="hover:text-accent transition-all fixed top-8 z-50 right-20 cursor-pointer text-2xl" @click="showShare = false">x</div>
                <div class="absolute m-auto inset-0 w-1/2 h-max flex flex-col justify-center border rounded-md  bg-darkLight px-8 py-6 overflow-hidden">
                    <div class="pb-4 text-xl">Heres your GitCard Code!</div>
                    <div class="flex py-4 flex-row justify-between w-2/3">
                        <a href="#" class="hover:text-accent transition-all">Youtube</a>
                        <a href="#" class="hover:text-accent transition-all">Facebook</a>
                        <a href="#" class="hover:text-accent transition-all">Whatsapp</a>
                        <a href="#" class="hover:text-accent transition-all">Twitter</a>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <div class="overflow-hidden h-max relative user-card shadow-2xl  transition-all duration-1000 w-full rounded-xl border border-white">
        <div class="relative h-full">

            <div class="flex px-6 flex-row relative bg-darkLight justify-between border-b border-white shadow-lg py-4 items-center tracking-wide w-full">
                <div class="flex flex-row space-x-6 items-center">
                    <img class="w-16 rounded-full border-b border-white p-2 h-auto" :src="userData.avatar_url" />
                    <div class="flex flex-col">
                        <a :href="'https://github.com/' + userData.login"> <h3 v-text="userData.login" class="font-bold text-3xl"></h3></a>
                        <a class="hover:text-accent transition-all" :href="'mailto:' + userData.email"><p class="text-[0.7rem] font-thin" v-if="userData.email !== null" v-text="userData.email"></p></a> 
                        <p class="text-[0.7rem] font-thin" v-text="'Member since: ' + dateFormatter(userData.created_at)"></p>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row space-x-2 items-center">
                        <p><span class="font-bold">Followers: </span><span v-text="userData.followers"></span></p>
                    </div>
                    <div class="flex flex-row space-x-2 items-center">
                        <p class="flex flex-row space-x-2"><span class="font-bold">Country: </span><span v-text="userData.location"></span><img class="h-6 w-auto" :src="'https://flagsapi.com/' + getCountryCode(userData.location) + '/flat/64.png'" /></p>
                    </div>
                </div>
            </div>
            <div class="grid  grid-cols-2 h-full bg-darkLight">
                <div class="flex flex-col h-full w-full">
                    <div class="border !border-r-0 border-white rounded-sm h-[397px] flex flex-col">
                        <div class="p-2 px-3 flex flex-row items-center  bg-dark border-white font-bold">Repositories</div>
                        <div class="flex flex-col">

                            <a  v-for="items, index in repoData.slice(0, 5)" :href="items.html_url" class="hover:opacity-80 transition-opacity p-2 px-3 border-b border-white !border-l-0 !border-r-0 flex justify-between flex-row" :class="index == 4 ? '!border-b-0' : ''">
                                <div class="flex flex-col">
                                    <p class="text-sm font-bold" v-text="items.name"></p>
                                    <p class="text-xs max-w-[200px] line-clamp-1" v-text="items.description ?? 'No Description'"></p>
                                    <p class="text-accent text-[0.7rem] capitalize" v-text="items.visibility"></p>
                                    
                                </div>
                                <div class="flex flex-col text-left text-[0.8rem]">
                                    <p>Last Updated:<span class="pl-1" v-text="dateFormatter(items.updated_at)"></span></p>
                                    <p>Forks:<span class="pl-1" v-text="items.forks"></span></p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col h-full w-full">
                    <div class="flex flex-col h-full">
                        <div class="border border-white flex flex-col justify-end overflow-hidden rounded-sm h-[397px]">
                            <div class="w-2/4 relative h-2/4 overflow-hidden !border-l-0 border-r border-t !border-b-0 flex flex-row rounded-tr-lg justify-start items-end space-x-1">
                                <h3 class="p-2 absolute top-0 left-0 text-xs w-full bg-dark">Contributions</h3>
                                <div v-for="items, index in contributionData" class="w-10" :class="items.length > 0 ? 'bg-accent' : 'bg-accent/70'"  :style="{ height: items.length * 20 + 'px' }"></div>
                            </div>
                            <div class="grid grid-cols-2 text-xs space-x-2 border-t border-r !border-b-0 !border-l-0 overflow-hidden">
                                <div class="flex flex-row space-x-2 p-2 text-[0.6rem] border !border-b-0 !border-l-0 !border-t-0">
                                    
                                    <div v-for="items, index in contributionData">
                                        <div v-text="index"></div>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>                       
             </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { getCountryCode } from "@/githubAPI";

const props = defineProps({
    username: {
        type: String,
    },
    apiResponse: {
        type: Object,
    },
    contributionData: {
        type: Array,
    },
    userData: {
        type: Object,
    },
    repoData: {
        type: Array,
    },
})

const userData = ref(props.userData);
const contributionData = ref(props.contributionData);
const apiResponse = ref(props.apiResponse);

const showEmbed = ref(false);
const showShare = ref(false);

const dateFormatter = () => {
    const date = new Date(userData.value.created_at);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-GB", options);
};

const populateEmbedCode = () => {
    showEmbed.value = true;
    
    nextTick(() => {
        const embedCode = document.getElementById("embed-code");
        embedCode.value = `<iframe src="https://github-card-creator.netlify.app/${props.userData.login}"></iframe>`;
    });
};
</script>

<style scoped>

    .fade-in-enter-active,
    .fade-in-leave-active {
        transition: all 0.5s ease;
    }

    .fade-in-enter-from,
    .fade-in-leave-to {
        opacity: 0;
    }

    .fade-in-enter-to,
    .fade-in-leave-from {
        opacity: 1;
    }
</style>
