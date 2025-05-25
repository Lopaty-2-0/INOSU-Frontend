<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../../stores/account";

useHead({
  title: "Panel | Domů",
  meta: [{ name: "description", content: "Panel Homepage" }],
});

definePageMeta({
  roles: ["admin"],
});

const { getAccountData: userData } = storeToRefs(useAccountStore());

const infoCards = ref<
  {
    title: string;
    icon: string;
    value: string | number;
  }[]
>([
  {
    title: "Počet pracího prášku",
    icon: "material-symbols:footprint",
    value: 140,
  },
  {
    title: "Počet pracího prášku",
    icon: "material-symbols:numbers-rounded",
    value: "540h",
  },
  {
    title: "Počet pracího prášku",
    icon: "material-symbols:adb",
    value: 6,
  },
]);
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar
        :links="[
          {
            name: 'Domů',
            path: '/panel',
          },
        ]"
      />
    </template>

    <template #content>
      <div id="home">
        <div class="info">
          <div class="line">
            <div class="section-head">
              <h3>Informativní karty</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
          </div>

          <ul class="cards">
            <li class="card" v-for="(data, index) in infoCards" :key="index">
              <div class="content">
                <div class="data">
                  <h6>{{ data.title }}</h6>
                  <p>{{ data.value }}</p>
                </div>

                <Icon size="40px" class="icon" :name="data.icon"></Icon>
              </div>
            </li>
          </ul>

          {{ userData }}
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  position: relative;

  .section-head {
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      font-weight: 700;
      font-size: 24px;
      color: var(--title-color);
    }

    p {
      color: rgba(var(--description-color), 1);
      font-size: 16px;
    }
  }

  .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    width: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 30px;

    .cards {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: flex-start;

      .card {
        border-radius: var(--normal-border-radius);
        display: flex;
        flex: 1;
        gap: 30px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        border: var(--border-width) solid rgba(var(--border-color), 0.5);
        padding: 30px;
        transition: 0.2s;
        cursor: pointer;
        min-width: 200px;
        background: var(--card-1-background);

        &:hover,
        &.active {
          background: var(--card-1-hover-background);
        }

        .content {
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          flex-wrap: wrap;

          .data {
            display: flex;
            flex-direction: column;
            gap: 20px;
            order: 0;

            h6 {
              color: rgba(var(--description-color), 1);
              font-size: 16px;
              font-weight: 600;
            }

            p {
              color: var(--mini-title-color);
              font-weight: 800;
              font-size: 28px;
            }
          }

          span {
            font-size: 40px;
            color: rgba(var(--description-color), 1);
            order: 1;
          }
        }
      }
    }
  }
}

@media (max-width: 400px) {
  #home .info .cards .card .content .data {
    order: 2;
  }
}
</style>
