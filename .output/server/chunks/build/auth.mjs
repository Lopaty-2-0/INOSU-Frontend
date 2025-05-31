import { i as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:path';
import 'node:crypto';
import 'pinia';
import 'vue-router';
import 'vue/server-renderer';

const auth = defineNuxtRouteMiddleware(async (from, to) => {
  return;
});

export { auth as default };
//# sourceMappingURL=auth.mjs.map
