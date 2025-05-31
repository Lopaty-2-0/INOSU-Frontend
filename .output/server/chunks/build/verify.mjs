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

const verify = defineNuxtRouteMiddleware((to) => {
  return;
});

export { verify as default };
//# sourceMappingURL=verify.mjs.map
