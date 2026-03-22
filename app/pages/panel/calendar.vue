<script setup lang="ts">
import {computed, ref, watch} from "vue";
import Navbar from "~/components/layout/Navbar.vue";
import Breadcrumb from "~/components/ui/Breadcrumb.vue";
import { useAlertsStore } from "~/stores/alerts";
import { useI18n } from "#imports";
import Input from "~/components/ui/Input.vue";
import EditFormFooter from "~/components/manage/Footer.vue";
import InputMenu from "~/components/ui/InputMenu.vue";
import Pagination from "~/components/ui/Pagination.vue";
import type {AccountData} from "~/types/account";
import Textarea from "~/components/ui/Textarea.vue";
import checkPermissions from "~/componsables/checkPermissions";
import {useAccountStore} from "~/stores/account";
import {storeToRefs} from "pinia";
import type {CalendarData, CalendarDotsData, CalendarEventType} from "~/types/calendar";
import moment from "moment";
import type {VDatePicker} from "~/../.nuxt/components";
import Loading from "~/components/ui/Loading.vue";

const { t } = useI18n();

useHead({
  title: t('pages.calendar.title'),
  meta: [{ name: "description", content: t('pages.calendar.description') }],
});
const alertsStore = useAlertsStore();
const accountStore = useAccountStore();
const { getId: userId, getRole: role } = storeToRefs(accountStore);
const datePicker = ref<InstanceType<typeof VDatePicker> | null>(null);
const amountForUsersPaging: number = 5;
const amountForEventsPaging: number = 5;
const loading = ref<boolean>(false);
const loadingEventId = ref<number | null>(null);
const showEventInfoId = ref<number | null>(null);
const usersSearchInput = ref<string>("");
const currentUsersPage = ref<number>(1);
const usersCount = ref<number>(0);
const users = ref<AccountData[]>([]);
const numberOfUsersPages = computed<number>((): number => {
  return Math.ceil(usersCount.value / amountForUsersPaging);
});
const dropDownUsers = computed(() => {
  return users.value.map((user: AccountData) => {
    return {
      label: user.name + " " + user.surname + " - " + user.email,
      value: user.id.toString(),
    };
  });
});
const newEventData = ref<{ name: string | undefined; description: string | undefined; type: string | undefined; day: Date | undefined; startTime: Date | undefined; endTime: Date | undefined; user: string | undefined; }>({
  name: undefined,
  description: undefined,
  type: undefined,
  day: undefined,
  startTime: undefined,
  endTime: undefined,
  user: undefined,
});
const errors = ref<{ name: string; description: string }>({
  name: "",
  description: "",
});
const selectedDate = ref<Date | null>(null);
const selectedDateTime = computed<number | null>(() => {
  return selectedDate.value ? selectedDate.value.getTime() : null;
});
const eventsCount = ref<number>(0);
const events = ref<CalendarData[]>([]);
const numberOfEventsPages = computed<number>(() => {
  return Math.ceil(eventsCount.value / amountForEventsPaging);
});
const eventsPending = ref<boolean>(false);
const authorEventsPending = ref<boolean>(false);
const currentEventsPage = ref<number>(1);
const currentAuthorEventsPage = ref<number>(1);
const authorEventsCount = ref<number>(0);
const authorEvents = ref<CalendarData[]>([]);
const numberOfAuthorEventsPages = computed<number>(() => {
  return Math.ceil(authorEventsCount.value / amountForEventsPaging);
});
const attributes = ref<{ dot: { class: string; }; dates: Date[] }[]>([]);
const weekRange = ref<{ startDate: number | undefined; endDate: number | undefined }>({
  startDate: undefined,
  endDate: undefined,
});

const refreshWeekRange = (): void => {
  if (!datePicker.value || !datePicker.value.calendarRef) return;

  const start = datePicker.value.calendarRef.days[0].startDate.getTime();
  const end = datePicker.value.calendarRef.days[6].endDate.getTime();

  weekRange.value = {
    startDate: start,
    endDate: end,
  };

  if (start && end) {
    refreshDots();
  }
};

const onUsersSearchInputChange = (input: string): void => {
  currentUsersPage.value = 1;

  usersSearchInput.value = input;
};

const toggleEventInfo = (id?: number | null): void => {
  if (!id) return;

  if (showEventInfoId.value === id) {
    showEventInfoId.value = null;
    return;
  }

  showEventInfoId.value = id;
};

const checkForErrors = (): void => {
  if (!newEventData.value.name) {
    errors.value.name = t('calendar.form.errors.nameRequired');
  } else {
    errors.value.name = "";
  }

  if (newEventData.value.description && newEventData.value.description.length > 500) {
    errors.value.description = t('calendar.form.errors.descriptionTooLong');
  } else {
    errors.value.description = "";
  }
};

const onNewEventDaySelect = (day: Date): void => {
  checkForErrors();

  newEventData.value.day = day;
  newEventData.value.endTime = day;
};

const toggleStartTime = (): void => {
  if (newEventData.value.startTime) {
    newEventData.value.startTime = undefined;
  } else {
    newEventData.value.startTime = newEventData.value.day ? new Date(newEventData.value.day) : undefined;
  }

  checkForErrors();
};

const onTypeSelect = (type: string[]): void => {
  newEventData.value.type = type[0] || undefined;

  checkForErrors();
};

const onUserSelect = (user: string[]): void => {
  newEventData.value.user = user[0] || undefined;

  if (newEventData.value.user && newEventData.value.user !== userId.value.toString()) {
    newEventData.value.type = undefined;
  }

  checkForErrors();
};

const getEventTimeText = (startDate: Date | number | string | undefined, endDate: Date | number | string | undefined): string => {
  if (!endDate) return t('calendar.undefined');

  const end = moment(endDate);
  const start = startDate ? moment(startDate) : null;

  if (start && start.isSame(end)) {
    return t('calendar.timeAt', { time: end.format("HH:mm") });
  }

  if (!start) {
    return t('calendar.timeUntil', { time: end.format("HH:mm") });
  }

  return t('calendar.timeFromTo', { start: start.format("HH:mm"), end: end.format("HH:mm") });
};

const resetNewEventData = (): void => {
  newEventData.value = {
    name: undefined,
    description: undefined,
    type: undefined,
    day: undefined,
    startTime: undefined,
    endTime: undefined,
    user: undefined,
  };

  errors.value = {
    name: "",
    description: "",
  };
};

const getIconByEventType = (type?: CalendarEventType | null): string => {
  if (!type) {
    return "material-symbols:question-mark-rounded";
  }

  switch (type) {
    case "byOther":
      return "material-symbols:add-reaction-rounded";

    case "maturita":
      return "material-symbols:book-2-rounded";

    case "own":
      return "material-symbols:person-rounded";

    case "task":
      return "material-symbols:folder-copy-rounded";

    default:
      return "material-symbols:question-mark-rounded";
  }
};

const removeEvent = async (idEvent?: number | null): Promise<void> => {
  if (!idEvent) return;

  loadingEventId.value = idEvent;

  await $fetch("/api/event/delete", {
    method: "delete",
    body: {
      idEvent: idEvent,
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "93010":
          alertsStore.addAlert({type: "error", title: t('calendar.alerts.removeEvent.title'), message: t('calendar.alerts.removeEvent.noId')});
          break;

        case "93021":
          alertsStore.addAlert({type: "info", title: t('calendar.alerts.removeEvent.title'), message: t('calendar.alerts.removeEvent.noneRemoved')});
          break;

        case "93031":
          alertsStore.addAlert({type: "success", title: t('calendar.alerts.removeEvent.title'), message: t('calendar.alerts.removeEvent.success')});

          await loadEvents();
          await loadAuthorEvents();
          await refreshDots();
          break;

        default:
          alertsStore.addAlert({type: "error", title: t('calendar.alerts.removeEvent.title'), message: t('calendar.alerts.removeEvent.unknown')});
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({type: "error", title: t('calendar.alerts.removeEvent.title'), message: t('calendar.alerts.removeEvent.unknown')});
    },
  }).finally((): void => {
    loadingEventId.value = null;
  });
};

const addNewEvent = async (): Promise<void> => {
  if (errors.value.name || errors.value.description) {
    alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.formErrors') });
    return;
  }

  if (!newEventData.value.name || !newEventData.value.endTime) {
    alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.required') });
    return;
  }

  loading.value = true;

  await $fetch("/api/event/add", {
    method: "post",
    body: {
      idUser: newEventData.value.user ? parseInt(newEventData.value.user) : undefined,
      name: newEventData.value.name,
      description: newEventData.value.description ? newEventData.value.description : undefined,
      type: newEventData.value.type ? newEventData.value.type : undefined,
      startDate: newEventData.value.startTime ? newEventData.value.startTime.getTime() : undefined,
      endDate: newEventData.value.endTime.getTime()
    },
    credentials: "include",
    ignoreResponseError: true,
    async onResponse({ response }: any) {
      const resCode: string = response._data.resCode.toString();

      switch (resCode) {
        case "92010":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.noName') });
          break;

        case "92020":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.noEndTime') });
          break;

        case "92030":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.invalidUserId') });
          break;

        case "92040":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.invalidUserIdValue') });
          break;

        case "92050":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.userNotFound') });
          break;

        case "92060":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.invalidEndDate') });
          break;

        case "92070":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.endInPast') });
          break;

        case "92080":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.invalidStartDate') });
          break;

        case "92090":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.sameDayRequired') });
          break;

        case "92100":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.startInPast') });
          break;

        case "92110":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.endAfterStart') });
          break;

        case "92120":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.invalidType') });
          break;

        case "92130":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.forbiddenType') });
          break;

        case "92140":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.nameTooLong') });
          break;

        case "92150":
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.descriptionTooLong') });
          break;

        case "92161":
          alertsStore.addAlert({ type: "success", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.success') });
          resetNewEventData();
          await loadEvents();
          await loadAuthorEvents();
          await refreshDots();
          break;

        default:
          alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.unknown') });
          break;
      }
    },
    onRequestError() {
      alertsStore.addAlert({ type: "error", title: t('calendar.alerts.createEvent.title'), message: t('calendar.alerts.createEvent.unknown') });
    },
  }).finally((): void => {
    loading.value = false;
  });
};

const loadEvents = async (): Promise<void> => {
  if (!selectedDateTime.value) return;

  try {
    eventsPending.value = true;

    const res = await $fetch("/api/event/get", {
      method: "get",
      query: {
        date: selectedDateTime.value,
        amountForPaging: amountForEventsPaging,
        pageNumber: currentEventsPage.value,
      },
      credentials: "include",
    });

    events.value = res.data.events.flat();
    eventsCount.value = res.data.count;
  } catch {
    events.value = [];
    eventsCount.value = 0;
  } finally {
    eventsPending.value = false;
  }
};

const loadAuthorEvents = async (): Promise<void> => {
  if (!selectedDateTime.value) return;

  try {
    authorEventsPending.value = true;

    const res = await $fetch("/api/event/get/maker", {
      method: "get",
      query: {
        date: selectedDateTime.value,
        amountForPaging: amountForEventsPaging,
        pageNumber: currentAuthorEventsPage.value,
      },
      credentials: "include",
    });

    authorEvents.value = res.data.events.flat();
    authorEventsCount.value = res.data.count;
  } catch {
    authorEvents.value = [];
    authorEventsCount.value = 0;
  } finally {
    authorEventsPending.value = false;
  }
};

const { data: usersData, error: usersError, pending: usersPending } = useFetch("/api/user/get", {
  query: {
    amountForPaging: amountForUsersPaging,
    pageNumber: currentUsersPage,
    searchQuery: usersSearchInput,
  },
  method: "get",
  server: false,
  credentials: "include",
  lazy: true,
  immediate: ["admin", "teacher"].includes(role.value),
});

const { data: dotsData, error: dotsError, refresh: refreshDots } = useFetch("/api/event/get/week", {
  query: weekRange,
  method: "get",
  server: false,
  credentials: "include",
  lazy: true,
  immediate: false
});

watch([dotsData, dotsError], (): void => {
  if (dotsError.value) {
    return;
  }

  if (!dotsData.value) return;

  const events: CalendarDotsData[] = dotsData.value.data.events;

  attributes.value.splice(0, attributes.value.length, ...[...events].map((event: CalendarDotsData) => {
    return {
      dot: {
        class: event.type || ""
      },
      dates: [new Date(event.endDate)],
    };
  }));
}, { immediate: true });

watch([usersData, usersError], (): void => {
  if (usersError.value) {
    users.value = [];
    usersCount.value = 0;
    return;
  }

  if (!usersData.value) return;

  users.value = usersData.value.data.users;
  usersCount.value = usersData.value.data.count;
}, { immediate: true });

watch(selectedDateTime, async (date: number | null): Promise<void> => {
  if (!date) return;

  currentEventsPage.value = 1;
  currentAuthorEventsPage.value = 1;

  await loadEvents();
  await loadAuthorEvents();
});

watch(datePicker, (): void => {
  refreshWeekRange();
}, { immediate: true });
</script>

<template>
  <NuxtLayout name="panel">
    <template #header>
      <Navbar>
        <template #left>
          <Breadcrumb :items="[
            { label: t('calendar.title'), to: `/panel/calendar`, icon: 'material-symbols:calendar-month-rounded', active: true },
          ]"/>
        </template>
      </Navbar>
    </template>

    <template #content>
      <div id="calendar">
        <div class="calendar-data">
          <div class="week">
            <VDatePicker class="date-picker" ref="datePicker" :attributes="attributes" expanded transparent bordeless view="weekly" title-position="left" hide-time-header v-model="selectedDate" @did-move="refreshWeekRange" />
          </div>

          <div class="card">
            <div class="events" v-if="selectedDate && (events.length > 0 || authorEvents.length > 0) && !eventsPending && !authorEventsPending">
              <div class="date">
                <h3>{{ selectedDate ? new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(selectedDate) : "" }}</h3>
                <h3>{{ selectedDate ? t('calendar.dayNumber', { day: selectedDate.getDate() }) : "" }}</h3>
              </div>

              <div class="list">
                <div class="event" :class="[event.type || 'default']" v-for="(event, index) in events" :key="index">
                  <div class="left">
                    <div class="icon-div">
                      <Icon class="icon" :name="getIconByEventType(event.type)"></Icon>
                    </div>

                    <div class="info" v-if="loadingEventId !== event.idEvent">
                      <h4>{{ event.name }}</h4>
                      <p>
                        {{ getEventTimeText(event.startDate, event.endDate) }}
                        {{ event.user && event.user.id !== userId ? `- ${event.user.name} ${event.user.surname}` : "" }}
                      </p>
                    </div>

                    <div class="info" v-else>
                      <div class="loading" v-if="loadingEventId !== null">
                        <Loading color="rgba(var(--description-color), 1)" size="5px" />
                      </div>
                    </div>
                  </div>

                  <div class="actions">
                    <Icon class="icon" name="material-symbols:info-rounded" @click="toggleEventInfo(event.idEvent)" v-if="event.idEvent && event.description"></Icon>
                    <Icon class="icon remove" name="material-symbols:delete-rounded" v-if="event.user && event.user.id === userId" @click="removeEvent(event.idEvent)"></Icon>
                  </div>

                  <p class="description" v-if="showEventInfoId === event.idEvent && event.description && event.idEvent">
                    {{ event.description }}
                  </p>
                </div>

                <Pagination :number-of-pages="numberOfEventsPages" :chunk-size="1" v-model="currentEventsPage" @update:model-value="loadEvents" />
              </div>

              <span class="line" v-if="authorEvents.length > 0"></span>

              <div class="list" v-if="authorEvents.length > 0">
                <div class="event" v-for="(event, index) in authorEvents" :key="index" :class="[event.type || 'default']">
                  <div class="left">
                    <div class="icon-div">
                      <Icon class="icon" :name="getIconByEventType(event.type)"></Icon>
                    </div>

                    <div class="info" v-if="loadingEventId !== event.idEvent">
                      <h4>{{ event.name }}</h4>
                      <p>
                        {{ getEventTimeText(event.startDate, event.endDate) }}
                        {{ event.user && event.user.id !== userId ? `- ${event.user.name} ${event.user.surname}` : "" }}
                      </p>
                    </div>

                    <div class="info" v-else>
                      <div class="loading" v-if="loadingEventId !== null">
                        <Loading color="rgba(var(--description-color), 1)" size="5px" />
                      </div>
                    </div>
                  </div>

                  <div class="actions">
                    <Icon class="icon" name="material-symbols:info-rounded" @click="toggleEventInfo(event.idEvent)" v-if="event.idEvent && event.description"></Icon>
                    <Icon class="icon remove" name="material-symbols:delete-rounded" v-if="event.user && event.user.id !== userId" @click="removeEvent(event.idEvent)"></Icon>
                  </div>

                  <p class="description" v-if="showEventInfoId === event.idEvent && event.description && event.idEvent">
                    {{ event.description }}
                  </p>
                </div>

                <Pagination :number-of-pages="numberOfAuthorEventsPages" :chunk-size="1" v-model="currentAuthorEventsPage" @update:model-value="loadAuthorEvents" />
              </div>
            </div>

            <div class="events" v-else-if="selectedDate && (eventsPending || authorEventsPending)">
              <div class="date">
                <h3>{{ selectedDate ? new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(selectedDate) : "" }}</h3>
                <h3>{{ selectedDate ? t('calendar.dayNumber', { day: selectedDate.getDate() }) : "" }}</h3>
              </div>

              <div class="loading">
                <Loading color="rgba(var(--description-color), 1)" size="20px" />
              </div>
            </div>

            <div class="events" v-else-if="selectedDate && events.length === 0 && authorEvents.length === 0 && !eventsPending && !authorEventsPending">
              <div class="date">
                <h3>{{ selectedDate ? new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(selectedDate) : "" }}</h3>
                <h3>{{ selectedDate ? t('calendar.dayNumber', { day: selectedDate.getDate() }) : "" }}</h3>
              </div>

              <p class="error info">{{ t('calendar.noEvents') }}</p>
            </div>

            <div class="events" v-else-if="!selectedDate && (!eventsPending || !authorEventsPending)">
              <p class="error">{{ t('calendar.noDay') }}</p>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="card">
            <div class="section">
              <div class="section-head">
                <h3>{{ t('calendar.form.name') }} <span class="update" v-if="newEventData.name">{{ t('common.updated') }}</span></h3>
                <p>{{ t('calendar.form.nameDescription') }}</p>
              </div>

              <div class="section-content">
                <Input type="text" id="name" :placeholder="t('calendar.form.placeholders.name')" v-model.trim="newEventData.name" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.name.length > 0">{{ errors.name }}</p>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('calendar.form.timeRange') }} <span class="update" v-if="newEventData.endTime || newEventData.startTime">{{ t('common.updated') }}</span></h3>
                <p>{{ t('calendar.form.timeRangeDescription') }}</p>
              </div>

              <div class="section-content">
                <span class="label">{{ t('calendar.form.day') }}</span>
                <VDatePicker expanded transparent bordeless view="weekly" title-position="left" hide-time-header is24hr @update:model-value="onNewEventDaySelect" />
              </div>

              <div class="section-content">
                <div class="line">
                  <div class="start">
                    <span class="label">
                      {{ t('calendar.form.from') }}
                      <Icon class="icon" name="material-symbols:close-rounded" @click="toggleStartTime" v-if="newEventData.startTime"></Icon>
                      <Icon class="icon" name="material-symbols:add-rounded" @click="toggleStartTime" v-else></Icon>
                    </span>
                    <VDatePicker class="time" expanded transparent bordeless mode="time" title-position="left" hide-time-header is24hr v-model="newEventData.startTime" @update:model-value="checkForErrors" />
                  </div>

                  <div class="end">
                    <span class="label">{{ t('calendar.form.to') }}</span>
                    <VDatePicker class="time" expanded transparent bordeless mode="time" hide-time-header is24hr v-model="newEventData.endTime" @update:model-value="checkForErrors" />
                  </div>
                </div>
              </div>
            </div>

            <div class="section" v-if="!newEventData.user || newEventData.user === userId.toString()">
              <div class="section-head">
                <h3>{{ t('calendar.form.type') }} <span class="update" v-if="newEventData.type">{{ t('common.updated') }}</span></h3>
                <p>{{ t('calendar.form.typeDescription') }}</p>
              </div>

              <div class="section-content">
                <InputMenu :items="[
                  { label: t('calendar.form.eventTypes.personal'), value: 'own' },
                  { label: t('calendar.form.eventTypes.task'), value: 'task' },
                ]" :placeholder="t('calendar.form.placeholders.type')" deselect @update:model-value="onTypeSelect" />
              </div>
            </div>

            <div class="section" v-if="checkPermissions(['admin', 'teacher'])">
              <div class="section-head">
                <h3>{{ t('calendar.form.user') }} <span class="update" v-if="newEventData.user">{{ t('common.updated') }}</span></h3>
                <p>{{ t('calendar.form.userDescription') }}</p>
              </div>

              <div class="section-content">
                <InputMenu ref="usersDropdown" v-if="dropDownUsers" :items="dropDownUsers" disable-item-filtering :placeholder="t('calendar.form.placeholders.user')" :loading="usersPending" @search:change="onUsersSearchInputChange" deselect @update:model-value="onUserSelect">
                  <template #row-extra v-if="numberOfUsersPages > 1">
                    <Pagination v-model="currentUsersPage" :number-of-pages="numberOfUsersPages" :chunk-size="1" />
                  </template>
                </InputMenu>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <h3>{{ t('calendar.form.description') }} <span class="update" v-if="newEventData.description">{{ t('common.updated') }}</span></h3>
                <p>{{ t('calendar.form.descriptionDescription') }}</p>
              </div>

              <div class="section-content">
                <Textarea class="textarea" :placeholder="t('calendar.form.placeholders.description')" v-model.trim="newEventData.description" @update:model-value="checkForErrors" />

                <p class="input-error" v-if="errors.description.length > 0">{{ errors.description }}</p>
              </div>
            </div>

            <EditFormFooter :is-loading="loading" :reset-function="resetNewEventData" :submit-function="addNewEvent">
              {{ t('calendar.requiredNote') }}
            </EditFormFooter>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
@use "../../assets/style/calendar";

#calendar {
  display: flex;
  flex-direction: row;
  gap: 30px;
  position: relative;
  height: calc(100svh - 140px);

  .calendar-data {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-height: 0;

    .week {
      position: relative;
      flex-shrink: 0;

      ::v-deep(.vc-header) {
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
      }

      ::v-deep(.vc-weeks) {
        padding: 10px 30px 30px;
      }

      ::v-deep(.vc-dots) {
        position: relative;
        top: 7px;
      }

      ::v-deep(.vc-dot) {
        &.maturita {
          background-color: var(--calendar-event-maturita-dot);
        }

        &.task {
          background-color: var(--calendar-event-task-dot);
        }

        &.own {
          background-color: var(--calendar-event-own-dot);
        }

        &.byOther {
          background-color: var(--calendar-event-byOther-dot);
        }

        background-color: var(--calendar-event-default-dot);
      }
    }

    .events {
      display: flex;
      flex-direction: column;
      gap: 30px;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;
      padding-right: 5px;

      &::-webkit-scrollbar {
        width: 5px;
      }

      .line {
        width: 100%;
        min-height: var(--border-width);
        background: rgba(var(--border-color), 0.5);
      }

      .date {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        h3 {
          font-weight: 700;
          font-size: 20px;
          color: var(--mini-title-color);
        }
      }

      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: 30px;

        &::-webkit-scrollbar {
          width: 5px;
        }

        .event {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;

          &.byOther .left .icon-div {
            background: var(--calendar-event-byOther);
            color: var(--calendar-event-byOther-color);
          }

          &.own .left .icon-div {
            background: var(--calendar-event-own);
            color: var(--calendar-event-own-color);
          }

          &.task .left .icon-div {
            background: var(--calendar-event-task);
            color: var(--calendar-event-task-color);
          }

          &.maturita .left .icon-div {
            background: var(--calendar-event-maturita);
            color: var(--calendar-event-maturita-color);
          }

          .left {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;

            .icon-div {
              padding: 15px;
              border-radius: var(--small-border-radius);
              background: var(--calendar-event-default);
              color: var(--calendar-event-default-color);
              line-height: 0;
              font-size: 20px;
            }

            .info {
              display: flex;
              gap: 5px;
              flex-direction: column;
              flex-wrap: wrap;

              h4 {
                font-size: 16px;
                font-weight: 600;
                color: var(--title-color);
                word-break: break-all;
              }

              p {
                font-size: 16px;
                color: rgba(var(--description-color), 1);
              }
            }
          }

          .actions {
            display: flex;
            gap: 10px;

            .icon {
              font-size: 20px;
              color: rgba(var(--description-color), 1);
              cursor: pointer;
              transition: 0.2s;

              &:hover {
                color: var(--mini-title-color);

                &.remove {
                  color: rgba(var(--actionBar-actions-remove-background), 1);
                }
              }
            }
          }

          .description {
            width: 100%;
            color: rgba(var(--description-color), 1);
            font-size: 16px;
          }
        }
      }
    }
  }

  .card {
    border: var(--border-width) solid rgba(var(--border-color), 0.5);
    border-radius: var(--normal-border-radius);
    background: var(--card-1-background);
    display: flex;
    padding: 30px;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .error {
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(var(--error-color), 1);
      font-size: 16px;
      text-align: center;
      height: 100%;
      width: 100%;
      flex: 1;

      &.info {
        color: rgba(var(--description-color), 1);
      }
    }
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 35px;
    position: relative;
    width: 100%;

    .card {
      padding: 30px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 30px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 5px;
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 30px;
        flex: 1;
        align-items: flex-start;
        border-bottom: 1px solid rgba(var(--border-color), 0.5);
        padding-bottom: 35px;

        .label {
          color: var(--mini-title-color);
          font-size: 16px;
          font-weight: 500;
        }

        input {
          border-radius: var(--normal-border-radius);
          font-size: 16px;
          outline: none;
          padding: 15px;
          border: var(--border-width) solid rgba(var(--border-color), 0.5);
          min-width: 150px;
          background: var(--input-background);
          color: var(--input-color);

          &:focus {
            border-color: rgba(var(--main-color), 1);
          }

          &.error {
            border-color: rgba(var(--error-color), 1);
          }
        }

        .input-error {
          color: rgba(var(--error-color), 1);
          font-size: 16px;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;

          .textarea {
            height: 150px;
            resize: none;
          }
        }

        .section-head {
          display: flex;
          flex-direction: column;
          gap: 10px;

          h3 {
            font-weight: 600;
            font-size: 20px;
            color: var(--title-color);
          }

          p {
            color: rgba(var(--description-color), 1);
            font-size: 16px;
          }

          .update {
            color: rgba(var(--error-color), 1);
          }
        }

        .line {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 10px;
          flex-wrap: wrap;

          input {
            flex: 1;
          }
        }

        .end, .start {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
          width: 100%;
        }

        .start .label {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;

          .icon {
            font-size: 20px;
            color: rgba(var(--description-color), 1);
            cursor: pointer;
            transition: 0.2s;

            &:hover {
              color: var(--mini-title-color);
            }
          }
        }

        .time {
          border: none !important;
          background: none !important;
          width: 100%;
          flex: 1;

          ::v-deep(.vc-time-picker) {
            padding: 0;
            width: 100%;
          }

          ::v-deep(.vc-time-select-group) {
            width: 100%;
            justify-content: center;
          }
        }
      }
    }
  }
}

@media (max-height: 840px) {
  #calendar {
    height: 100%;

    .content, .calendar-data {
      height: 700px;
    }
  }
}

@media (max-width: 1080px) {
  #calendar {
    flex-direction: column;
    height: 100%;

    .calendar-data .card {
      min-height: 200px;
      max-height: 500px;
    }
  }
}

@media (max-width: 400px) {
  #calendar .calendar-data .events .list .event {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>