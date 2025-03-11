<script setup lang="ts">
import { definePageMeta, useHead, defineAsyncComponent } from "#imports";
import Navbar from "~/components/Navbar.vue";
import { ref } from "vue";

useHead({
  title: "Panel | Domů",
  meta: [
    { name: "description", content: "Panel Homepage" }
  ],
});

const statisticsData = ref(
    [
      {
        type: "traffic",
        title: "Návštěvnost",
        icon: "material-symbols:footprint",
        value: 140,
        trend: 0
      },
      {
        type: "",
        title: "Strávený čas",
        icon: "material-symbols:access-time",
        value: "540h",
        trend: 21
      },
      {
        type: "",
        title: "Počet nadcházejících událostí",
        icon: "material-symbols:calendar",
        value: 6,
        trend: 11
      }
      // Create trendType for each item by comparing trend value
    ].map(item => ({
      ...item,
      trendType: item.trend > 0 ? "up" : item.trend === 0 ? "neutral" : "down"
    })) as { type: string, title: string, icon: string, value: string | number, trend: number, trendType: "up" | "down" | "neutral" }[]
);
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar :links="[{
        name: 'Domů',
        path: '/panel'
      }]" />
    </template>

    <template #content>
      <div id="home">
        <div class="stats">
          <div class="line">
            <div class="section-head">
              <h3 data-can-edit="true">Statistiky</h3>
              <p>Statistiky pro vaše webové stránky</p>
            </div>
          </div>

          <ul class="cards">
            <li class="card" v-for="(data, index) in statisticsData" :key="index">
              <div class="head">
                <p>{{ data.title }}</p>

                <Icon size="1.5rem" class="icon" :name="data.icon"></Icon>
              </div>

              <div class="footer">
                <h4>{{ data.value }}</h4>
                <p v-if="data.trendType === 'up'" class="up">
                  <Icon size="1rem" class="icon" name="material-symbols:trending-up-rounded"></Icon>
                  +{{ Math.round(data.trend * 100) / 100 }}%
                </p>
                <p v-else-if="data.trendType === 'down'" class="down">
                  <Icon size="1rem" class="icon" name="material-symbols:trending-down-rounded"></Icon>
                  {{ Math.round(data.trend * 100) / 100 }}%
                </p>
                <p v-else class="neutral">
                  <Icon size="1rem" class="icon" name="material-symbols:trending-flat-rounded"></Icon>
                  {{ Math.round(data.trend * 100) / 100 }}%
                </p>
              </div>
            </li>
          </ul>
        </div>

        <!--
        <div class="table">
          <div class="line">
            <div class="section-head">
              <h3>Uživatelé</h3>
              <p>Seznam všech uživatelů používajících tento panel</p>
            </div>

            <div class="search">
              <input type="text" name="searchInput" placeholder="Hledat uživatele" v-model="usersSearch" />
              <Icon class="icon" size="1rem" name="material-symbols:search-rounded"></Icon>
            </div>
          </div>

          <Datatable class="datatable" ref="datatable" :rows="users.map((user) => {
            return {
              id: user.id,
              fullName: `${user.firstName} ${user.secondName}`,
              profilePhoto: user.profilePhoto,
              email: user.email,
              createdAt: user.createdAt,
              permissions: user.permissions,
              hierarchy: user.hierarchy
            };
          })" :columns="cols" :totalRows="5" :pageSize="10" :hasCheckbox="true" :sortable="true" :search="usersSearch">
            <template #fullName="data">
              <div class="user-fullName">
                <img crossorigin="anonymous" class="profile-photo" :src="data.value.profilePhoto" alt="Uživatel" />
                <p>{{ data.value.fullName }}</p>
              </div>
            </template>

            <template #createdAt="data">
              {{ moment(data.value.createdAt).format("DD.MM.YYYY") }}
            </template>

            <template #permissions="data">
              {{ data.value.permissions.split(",").filter((permission: string) => permission).length }}
            </template>

            <template #email="data">
              <a :href="`mailto:${data.value.email}`">{{ data.value.email }}</a>
            </template>
          </Datatable>
        </div>
        -->
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: relative;

  .section-head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
      font-weight: 600;
      font-size: 1.1rem;
      color: var(--title-color);
    }

    p {
      color: var(--description-color);
      font-size: 0.875rem;
    }
  }

  .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
  }

  .table {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
    align-items: flex-start;
    position: relative;

    .search {
      min-width: 100px;
      display: flex;
      align-items: center;
      flex-direction: row;
      position: relative;

      input {
        border: 1px solid var(--border-color);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        outline: none;
        padding: 1rem 2.5rem 0.825rem 1rem;
        width: 100%;
        background: var(--input-background);
        color: var(--input-color);

        &:focus {
          border-color: var(--main-color);
        }
      }

      .icon {
        margin-left: -1.8rem;
        cursor: pointer;
        color: var(--description-color);
        transition: 0.2s;
        font-size: 1rem;

        &:hover {
          color: var(--mini-title-color);
        }
      }
    }
  }

  .datatable .user-fullName {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
  }

  .widgets {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
    flex-wrap: wrap;

    .widget {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      flex: 1;

      .widget-info {
        padding: 2rem;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        height: 350px;

        &::-webkit-scrollbar {
          width: 3px;
        }
      }

      &.widget-1 {
        .widget-info {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;

          &::-webkit-scrollbar {
            height: 3px;
          }
        }
      }

      &.widget-2, &.widget-3 {
        .widget-info {
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
        }
      }
    }
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .cards {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: flex-start;

      .card {
        border-radius: 0.5rem;
        display: flex;
        flex: 1;
        gap: 1rem;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        border: 1px solid var(--border-color);
        padding: 2rem;
        transition: 0.2s;
        cursor: pointer;

        &:hover, &.active {
          background: var(--card-1-hover-background);
        }

        .head {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          justify-content: space-between;
          width: 100%;

          p, .icon {
            color: var(--mini-title-color);
            font-size: 0.875rem;
          }
        }

        .footer {
          display: flex;
          align-items: center;
          gap: 1rem;

          h4 {
            color: var(--title-color);
            font-size: 2rem;
            font-weight: bold;
          }

          p {
            font-size: 0.875rem;
            display: flex;
            gap: 0.5rem;
            align-items: center;
            padding: 0.25rem 0.675rem;
            border-radius: 50px;
            height: fit-content;

            &.up {
              background: var(--stats-trend-up-background);
              color: var(--stats-trend-up-color);

              i {
                margin-top: 3px;
              }
            }

            &.neutral {
              background: var(--stats-trend-neutral-background);
              color: var(--stats-trend-neutral-color);


            }

            &.down {
              background: var(--stats-trend-down-background);
              color: var(--stats-trend-down-color);

              .icon {
                margin-bottom: 3px;
              }
            }
          }
        }
      }
    }
  }

  //ApexCharts
  ::v-deep(.vue-apexcharts) {
    min-width: 700px;
  }

  ::v-deep(.apexcharts-tooltip), ::v-deep(.apexcharts-xaxistooltip), ::v-deep(.apexcharts-menu) {
    background: var(--card-1-background);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--description-color);
    box-shadow: none;
  }

  ::v-deep(.apexcharts-toolbar) {
    z-index: 0;
  }

  ::v-deep(.apexcharts-menu-item:hover) {
    transition: 0.2s;
    background: var(--card-1-hover-background);
    border-radius: 0.1rem;
  }

  ::v-deep(.apexcharts-xaxistooltip::after) {
    border-bottom-color: var(--card-1-background);
  }

  ::v-deep(.apexcharts-xaxistooltip::before) {
    border-bottom-color: var(--border-color);
  }

  ::v-deep(.apexcharts-canvas .apexcharts-zoom-icon.apexcharts-selected svg) {
    fill: var(--main-color);
  }

  ::v-deep(.apexcharts-tooltip-title) {
    background: transparent;
    border-bottom: 1px solid var(--border-color);
    color: var(--description-color);
    box-shadow: none;
  }

  ::v-deep(.apexcharts-element-hidden) {
    display: none;
  }

  ::v-deep(.apexcharts-reset-icon) {
    margin-left: 0;
  }

  ::v-deep(.apexcharts-xcrosshairs.apexcharts-active) {
    stroke: var(--border-color);
  }

  ::v-deep(.apexcharts-marker) {
    fill: var(--main-color);
    stroke: var(--main-color);
  }
}

@media (max-width: 1440px) {
  #home .widgets {
    flex-direction: column;

    .widget {
      width: 100%;
      flex: 1;

      .widget-info {
        width: 100%;
        min-width: 100%;
      }
    }
  }
}
</style>
