<script setup>
import { init } from '@/githubAPI.js'
import { computed, onMounted, ref, nextTick } from "vue";
import { useForm } from "@inertiajs/vue3";
import Card from "@/Components/Card.vue";
import GitCard from '@/Components/GitCard.vue';

const typing = ref('');
const text = "JoeBloggs1992";
const textArray = text.split("");

const typeIn = (i = 0) => {
    if (i < textArray.length) {
        setTimeout(() => {
            typing.value += textArray[i];
            typeIn(i + 1);
        }, 200);
    } else {
        setTimeout(typeOut, 2000); // Wait for 2 seconds before starting to type out
    }
};

const typeOut = (i = textArray.length - 1) => {
    if (i >= 0) {
        setTimeout(() => {
            typing.value = typing.value.slice(0, -1);
            typeOut(i - 1);
        }, 300);
    } else {
        setTimeout(typeIn, 2000); // Wait for 2 seconds before starting to type in again
    }
};


const form = useForm({
    username: "",
});

const apiResponse = ref(null);
const userData = ref(null);
const repoData = ref(null);
const contributionData = ref(null);

let errors = ref("");
let showErrors = ref(false);

const handleAPI = async (username) => {
    apiResponse.value = await init(username);
    console.log(apiResponse.value)

    userData.value = apiResponse.value.userData;
    repoData.value = apiResponse.value.allRepoData;
    contributionData.value = apiResponse.value.userContributions;

    setTimeout(() => {
        console.log(contributionData.value);
        scrollToCard();
    }, 2000)
}

const scrollToCard = () => {
    const card = document.querySelector('.user-card');
    const cardPosition = card.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const offset = window.innerHeight / 2 - card.offsetHeight / 2; // Offset to center the card
    const distance = cardPosition - startPosition - offset;
    const duration = 1000; // Duration of the scroll in milliseconds
    let start = null;

    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(0, easeInOutQuad(progress, startPosition, distance, duration));
        if (progress < duration) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
};

const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

const setError = (errMsg) => {
    showErrors.value = true;
    errors.value = errMsg;

    setTimeout(() => {
        showErrors.value = false;
    }, 3000);
};


onMounted(typeIn);
</script>

<template>
    <div class="bg-dark h-full min-h-screen pb-20 flex flex-col space-y-20 text-white w-full">
        <div class="container h-full flex flex-col space-y-[100px]">
            <div class="flex relative flex-row items-center w-full">

                <div
                class="pt-12 w-full flex flex-col items-center justify-center"
                >
                <h1 class="text-6xl tracking-widest">gitCard</h1>
                <p class="pt-8 uppercase tracking-wide">
                    Create a reusable, clean card to show off your GitHub
                    Account!
                </p>
            </div>
            <a href="#" class="absolute tracking-widest uppercase text-accent right-0 flex flex-row h-full items-center hover:text-white transition-all">Donate here</a>
        </div>

            <div class="w-full flex flex-row items-start justify-center">
                <div class="w-1/2 relative">
                    <input
                        type="text"
                        spellcheck="false"
                        class="rounded-lg py-3 z-20 focus:ring-0 h-full relative focus:outline-none focus:border-white/40 shadow-xl border-white border w-full appearance-none bg-darkLight"
                        placeholder="Enter your github username"
                        v-model="form.username"
                        @keydown.enter="$event.target.nextSibling.click()"
                    />
                    <button @click="form.username !== '' && form.username !== undefined ? handleAPI(form.username) : setError('Please enter a username')"
                        class="absolute z-30 transition-transform hover:rotate-180 cursor-pointer py-8 right-4 inset-y-0 text-xl leading-tight my-auto h-max"
                    >
                        +
                </button>
                <div  :class="showErrors == true ? 'translate-y-full opacity-100' : 'translate-y-0 opacity-0'" v-text="errors" class="overflow-hidden absolute right-0 -bottom-2 z-10 transition-all duration-1000  text-sm py-2 px-6 flex flex-col border justify-center bg-dark border-accent rounded-xl shadow-xl"></div>
                </div>
            </div>

            <Transition name="grow">
                <GitCard v-if="apiResponse !== null" :repoData="repoData" :apiResponse="apiResponse" :username="username" :userData="userData" :contributionData="contributionData"></GitCard>
            </Transition>
                
            <div id="gitCard" class="w-full grid grid-cols-1 gap-4">
                <h4 class="text-accent text-2xl font-bold">
                    How does it work?
                </h4>
                <Card>
                    <div class="flex space-y-4 w-full flex-col p-4">
                        <div class="flex w-full flex-col space-y-2">
                            <div class="flex flex-col w-full">
                                <p>Enter your <span class="text-accent">GitHub</span> username</p>
                                <div class="py-2">
                                    <input
                                        id="example-text"
                                        :value="typing !== null ? typing : ''"
                                        type="text"
                                        class="pointer-events-none rounded-xl shadow-xl border-white border w-2/3 !mx-auto text-xxs text-white appearance-none bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border-l w-full h-full border-white p-4">
                        <div class="flex flex-col">
                            <p>Click to <span class="text-accent">search</span></p>
                            <div class="py-3">
                                <button
                                    class="shadow-xl hover:scale-[1.03] transition-transform bg-transparent border border-white rounded-2xl px-4 py-1"
                                >
                                    Click me
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="border-l w-full h-full border-white p-4">
                        Choose your <span class="text-accent">style</span> of card
                    </div>
                    <div class="border-l w-full h-full rounded-br-xl rounded-tr-xl border-white p-4">
                        <div class="flex flex-col">
                            <p>Share your <span class="text-accent">gitCard</span></p>
                            <div class="text-sm h-full w-full mx-auto py-4 flex flex-col justify-center flex-nowrap">&lt;iframe src="github.io/JoeBloggs1992"&gt;&lt;ifra...</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grow-enter-active,
.grow-leave-active {
    transition: all 0.8s ease;
}

.grow-enter-from,
.grow-leave-to {
    opacity: 0;
    height: 0;
}

.grow-enter-to,
.grow-leave-from {
    opacity: 1;
    height: 600px;
}

</style>
```