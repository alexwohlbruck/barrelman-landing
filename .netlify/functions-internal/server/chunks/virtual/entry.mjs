import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineProdDiagnostics } from 'nostics';
import { ansiFormatter } from 'nostics/formatters/ansi';
import * as import_vue from 'vue';
import { getCurrentScope, ref, watchEffect, getCurrentInstance, onBeforeUnmount, onDeactivated, onActivated, createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, hasInjectionContext, inject, defineAsyncComponent, mergeProps, toRef, shallowRef, isReadonly, defineComponent, useSlots, h, Fragment, useSSRContext, isRef, isShallow, isReactive, toRaw, computed, isVNode, createCommentVNode, watch, Suspense } from 'vue';
import { c as createError, $ as $fetch, p as hasProtocol, l as joinURL, q as defu, w as withQuery, r as sanitizeStatusCode, t as parseURL, f as encodePath, v as decodePath, x as isScriptProtocol } from '../nitro/nitro.mjs';
import { i as injectHead$1, V as VueResolver, b as baseURL, h as headSymbol } from '../routes/renderer.mjs';
import { createMemoryHistory, createRouter, START_LOCATION, RouterView } from 'vue-router';
import sync, { getFrameData } from 'framesync';
import { inertia, animate, velocityPerSecond, cubicBezier, bounceOut, bounceInOut, bounceIn, anticipate, backOut, backInOut, backIn, circOut, circInOut, circIn, easeOut, easeInOut, easeIn, linear } from 'popmotion';
import { number, complex, alpha, filter, px, progressPercentage, degrees, scale, color } from 'style-value-types';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs } from 'vue/server-renderer';
import { walkResolver } from 'unhead/utils';

function useHead(input, options = {}) {
  const head = options.head || injectHead$1();
  return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
  const scope = getCurrentScope();
  if (scope && !scope.active) {
    return { patch() {
    }, dispose() {
    }, _i: -1 };
  }
  const deactivated = ref(false);
  if (options.onRendered && scope) {
    const _onRendered = options.onRendered;
    options = { ...options, onRendered: (ctx) => scope.run(() => _onRendered(ctx)) };
  }
  let entry;
  watchEffect(() => {
    const i = deactivated.value ? {} : walkResolver(input, VueResolver);
    if (entry) {
      entry.patch(i);
    } else {
      entry = head.push(i, options);
    }
  });
  const vm = getCurrentInstance();
  if (vm) {
    onBeforeUnmount(() => {
      entry.dispose();
    });
    onDeactivated(() => {
      deactivated.value = true;
    });
    onActivated(() => {
      deactivated.value = false;
    });
  }
  return entry;
}

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance();
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
	const restores = [];
	for (const leaveHandler of asyncHandlers) {
		const restore = leaveHandler();
		if (restore) restores.push(restore);
	}
	const restore = () => {
		for (const restore of restores) restore();
	};
	let awaitable = function_();
	if (awaitable && typeof awaitable === "object" && "catch" in awaitable) awaitable = awaitable.catch((error) => {
		restore();
		throw error;
	});
	return [awaitable, restore];
}

//#region \0rolldown/runtime.js
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp$2(target, name, {
		get: all[name],
		enumerable: true
	});
	__defProp$2(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp$2(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
var colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
ansiFormatter(colors);
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
//#endregion
//#region node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.5.1";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const contextCaller = async function(hooks, args) {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/nuxt/dist/app/utils.js
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
//#endregion
//#region node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = () => {
	return useNuxtApp()?.$router;
};
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = scope.parent;
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const { protocol } = new URL(toPath, "http://localhost");
		if (protocol && isScriptProtocol(protocol)) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError$1(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	await nuxtApp.runWithContext(() => showError(error));
};
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError$1 = (error) => {
	if (typeof error !== "string" && error.statusText) error.message ??= error.statusText;
	const nuxtError = createError(error);
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch.create({ baseURL: baseURL() });
var $fetch$1 = globalThis.$fetch;
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey$1 = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/nuxt/dist/app/components/utils.js
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION) return false;
	if (generateRouteKey(to) !== generateRouteKey(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(selector) {
	try {
		const elem = (void 0).querySelector(selector);
		if (elem) return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
	} catch {}
	return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	...router_options_default
};
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/validate.js
var middleware$1 = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError$1({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var sensitiveMatcher = (m, p) => {
	return [];
};
var foldedMatcher = sensitiveMatcher;
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = (path) => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.sensitive ? defu({}, ...sensitiveMatcher().map((r) => r.data).reverse()) : defu({}, ...foldedMatcher("", typeof path === "string" ? path.toLowerCase() : path).map((r) => r.data).reverse());
//#endregion
//#region node_modules/nuxt/dist/app/composables/manifest.js
var routeRulesMatcher = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default;
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [middleware$1, /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
var namedMiddleware = {};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froutes.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default = [{
	name: "index",
	path: "/",
	component: () => import('../build/pages-DJw4gANT.mjs')
}];
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
		const history = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default : virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey$1({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey$1({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = /* @__PURE__ */ useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const result = await nuxtApp.runWithContext(() => middleware(to, from));
						if (result === false || result instanceof Error) {
							const error = result || createError$1({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createError$1(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		});
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.onError(async () => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			await nuxtApp.callHook("page:loading:end");
		});
		router.afterEach((to) => {
			if (to.matched.length === 0 && !error.value) return nuxtApp.runWithContext(() => showError(createError$1({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject(headSymbol);
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead$1(input, options = {}) {
	return useHead(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcomponents.plugin.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default = /* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" });
//#endregion
//#region node_modules/nuxt/dist/app/compat/capi.js
var install = () => {};
function set(target, key, val) {
	if (Array.isArray(target)) {
		target.length = Math.max(target.length, key);
		target.splice(key, 1, val);
		return val;
	}
	target[key] = val;
	return val;
}
function del(target, key) {
	if (Array.isArray(target)) {
		target.splice(key, 1);
		return;
	}
	delete target[key];
}
//#endregion
//#region node_modules/nuxt/dist/app/compat/vue-demi.js
var vue_demi_exports = /* @__PURE__ */ __exportAll({
	Vue2: () => void 0,
	del: () => del,
	install: () => install,
	isVue2: () => false,
	isVue3: () => true,
	set: () => set
});
__reExport(vue_demi_exports, import_vue);
//#endregion
//#region node_modules/@vueuse/motion/node_modules/@vueuse/shared/index.mjs
function tryOnScopeDispose(fn) {
	if ((0, vue_demi_exports.getCurrentScope)()) {
		(0, vue_demi_exports.onScopeDispose)(fn);
		return true;
	}
	return false;
}
function toValue$1(r) {
	return typeof r === "function" ? r() : (0, vue_demi_exports.unref)(r);
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var notNullish = (val) => val != null;
var toString = Object.prototype.toString;
var isObject$1 = (val) => toString.call(val) === "[object Object]";
var noop = () => {};
function getLifeCycleTarget(target) {
	return (0, vue_demi_exports.getCurrentInstance)();
}
function tryOnUnmounted(fn, target) {
	if (getLifeCycleTarget()) (0, vue_demi_exports.onUnmounted)(fn, target);
}
//#endregion
//#region node_modules/@vueuse/motion/node_modules/@vueuse/core/index.mjs
function unrefElement(elRef) {
	var _a;
	const plain = toValue$1(elRef);
	return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
var defaultWindow = void 0;
function useEventListener(...args) {
	let target;
	let events;
	let listeners;
	let options;
	if (typeof args[0] === "string" || Array.isArray(args[0])) {
		[events, listeners, options] = args;
		target = defaultWindow;
	} else [target, events, listeners, options] = args;
	if (!target) return noop;
	if (!Array.isArray(events)) events = [events];
	if (!Array.isArray(listeners)) listeners = [listeners];
	const cleanups = [];
	const cleanup = () => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
	};
	const register = (el, event, listener, options2) => {
		el.addEventListener(event, listener, options2);
		return () => el.removeEventListener(event, listener, options2);
	};
	const stopWatch = (0, vue_demi_exports.watch)(() => [unrefElement(target), toValue$1(options)], ([el, options2]) => {
		cleanup();
		if (!el) return;
		const optionsClone = isObject$1(options2) ? { ...options2 } : options2;
		cleanups.push(...events.flatMap((event) => {
			return listeners.map((listener) => register(el, event, listener, optionsClone));
		}));
	}, {
		immediate: true,
		flush: "post"
	});
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(stop);
	return stop;
}
function useMounted() {
	const isMounted = (0, vue_demi_exports.ref)(false);
	const instance = (0, vue_demi_exports.getCurrentInstance)();
	if (instance) (0, vue_demi_exports.onMounted)(() => {
		isMounted.value = true;
	}, instance);
	return isMounted;
}
function useSupported(callback) {
	const isMounted = useMounted();
	return (0, vue_demi_exports.computed)(() => {
		isMounted.value;
		return Boolean(callback());
	});
}
function useIntersectionObserver(target, callback, options = {}) {
	const { root, rootMargin = "0px", threshold = .1, window = defaultWindow, immediate = true } = options;
	const isSupported = useSupported(() => window && "IntersectionObserver" in window);
	const targets = (0, vue_demi_exports.computed)(() => {
		const _target = toValue$1(target);
		return (Array.isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish);
	});
	let cleanup = noop;
	const isActive = (0, vue_demi_exports.ref)(immediate);
	const stopWatch = isSupported.value ? (0, vue_demi_exports.watch)(() => [
		targets.value,
		unrefElement(root),
		isActive.value
	], ([targets2, root2]) => {
		cleanup();
		if (!isActive.value) return;
		if (!targets2.length) return;
		const observer = new IntersectionObserver(callback, {
			root: unrefElement(root2),
			rootMargin,
			threshold
		});
		targets2.forEach((el) => el && observer.observe(el));
		cleanup = () => {
			observer.disconnect();
			cleanup = noop;
		};
	}, {
		immediate,
		flush: "post"
	}) : noop;
	const stop = () => {
		cleanup();
		stopWatch();
		isActive.value = false;
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		isActive,
		pause() {
			cleanup();
			isActive.value = false;
		},
		resume() {
			isActive.value = true;
		},
		stop
	};
}
//#endregion
//#region node_modules/@vueuse/motion/dist/index.mjs
var motionState = {};
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
	__defNormalProp$1(obj, key + "" , value);
	return value;
};
var SubscriptionManager = class {
	constructor() {
		__publicField$1(this, "subscriptions", /* @__PURE__ */ new Set());
	}
	add(handler) {
		this.subscriptions.add(handler);
		return () => this.subscriptions.delete(handler);
	}
	notify(a, b, c) {
		if (!this.subscriptions.size) return;
		for (const handler of this.subscriptions) handler(a, b, c);
	}
	clear() {
		this.subscriptions.clear();
	}
};
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
	__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
function isFloat(value) {
	return !Number.isNaN(Number.parseFloat(value));
}
var MotionValue = class {
	/**
	* init - The initiating value
	* config - Optional configuration options
	*/
	constructor(init) {
		/**
		* The current state of the `MotionValue`.
		*/
		__publicField(this, "current");
		/**
		* The previous state of the `MotionValue`.
		*/
		__publicField(this, "prev");
		/**
		* Duration, in milliseconds, since last updating frame.
		*/
		__publicField(this, "timeDelta", 0);
		/**
		* Timestamp of the last time this `MotionValue` was updated.
		*/
		__publicField(this, "lastUpdated", 0);
		/**
		* Functions to notify when the `MotionValue` updates.
		*/
		__publicField(this, "updateSubscribers", new SubscriptionManager());
		/**
		* A reference to the currently-controlling Popmotion animation
		*/
		__publicField(this, "stopAnimation");
		/**
		* Tracks whether this value can output a velocity.
		*/
		__publicField(this, "canTrackVelocity", false);
		/**
		* Update and notify `MotionValue` subscribers.
		*
		* @param v
		* @param render
		*/
		__publicField(this, "updateAndNotify", (v) => {
			this.prev = this.current;
			this.current = v;
			const { delta, timestamp } = getFrameData();
			if (this.lastUpdated !== timestamp) {
				this.timeDelta = delta;
				this.lastUpdated = timestamp;
			}
			sync.postRender(this.scheduleVelocityCheck);
			this.updateSubscribers.notify(this.current);
		});
		/**
		* Schedule a velocity check for the next frame.
		*/
		__publicField(this, "scheduleVelocityCheck", () => sync.postRender(this.velocityCheck));
		/**
		* Updates `prev` with `current` if the value hasn't been updated this frame.
		* This ensures velocity calculations return `0`.
		*/
		__publicField(this, "velocityCheck", ({ timestamp }) => {
			if (!this.canTrackVelocity) this.canTrackVelocity = isFloat(this.current);
			if (timestamp !== this.lastUpdated) this.prev = this.current;
		});
		this.prev = this.current = init;
		this.canTrackVelocity = isFloat(this.current);
	}
	/**
	* Adds a function that will be notified when the `MotionValue` is updated.
	*
	* It returns a function that, when called, will cancel the subscription.
	*/
	onChange(subscription) {
		return this.updateSubscribers.add(subscription);
	}
	clearListeners() {
		this.updateSubscribers.clear();
	}
	/**
	* Sets the state of the `MotionValue`.
	*
	* @param v
	* @param render
	*/
	set(v) {
		this.updateAndNotify(v);
	}
	/**
	* Returns the latest state of `MotionValue`
	*
	* @returns - The latest state of `MotionValue`
	*/
	get() {
		return this.current;
	}
	/**
	* Get previous value.
	*
	* @returns - The previous latest state of `MotionValue`
	*/
	getPrevious() {
		return this.prev;
	}
	/**
	* Returns the latest velocity of `MotionValue`
	*
	* @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
	*/
	getVelocity() {
		return this.canTrackVelocity ? velocityPerSecond(Number.parseFloat(this.current) - Number.parseFloat(this.prev), this.timeDelta) : 0;
	}
	/**
	* Registers a new animation to control this `MotionValue`. Only one
	* animation can drive a `MotionValue` at one time.
	*/
	start(animation) {
		this.stop();
		return new Promise((resolve) => {
			const { stop } = animation(resolve);
			this.stopAnimation = stop;
		}).then(() => this.clearAnimation());
	}
	/**
	* Stop the currently active animation.
	*/
	stop() {
		if (this.stopAnimation) this.stopAnimation();
		this.clearAnimation();
	}
	/**
	* Returns `true` if this value is currently animating.
	*/
	isAnimating() {
		return !!this.stopAnimation;
	}
	/**
	* Clear the current animation reference.
	*/
	clearAnimation() {
		this.stopAnimation = null;
	}
	/**
	* Destroy and clean up subscribers to this `MotionValue`.
	*/
	destroy() {
		this.updateSubscribers.clear();
		this.stop();
	}
};
function getMotionValue(init) {
	return new MotionValue(init);
}
var { isArray } = Array;
function useMotionValues() {
	const motionValues = ref({});
	const stop = (keys) => {
		const destroyKey = (key) => {
			if (!motionValues.value[key]) return;
			motionValues.value[key].stop();
			motionValues.value[key].destroy();
			delete motionValues.value[key];
		};
		if (keys) if (isArray(keys)) keys.forEach(destroyKey);
		else destroyKey(keys);
		else Object.keys(motionValues.value).forEach(destroyKey);
	};
	const get = (key, from, target) => {
		if (motionValues.value[key]) return motionValues.value[key];
		const motionValue = getMotionValue(from);
		motionValue.onChange((v) => target[key] = v);
		motionValues.value[key] = motionValue;
		return motionValue;
	};
	tryOnUnmounted(stop);
	return {
		motionValues,
		get,
		stop
	};
}
function isKeyframesTarget(v) {
	return Array.isArray(v);
}
function underDampedSpring() {
	return {
		type: "spring",
		stiffness: 500,
		damping: 25,
		restDelta: .5,
		restSpeed: 10
	};
}
function criticallyDampedSpring(to) {
	return {
		type: "spring",
		stiffness: 550,
		damping: to === 0 ? 2 * Math.sqrt(550) : 30,
		restDelta: .01,
		restSpeed: 10
	};
}
function overDampedSpring(to) {
	return {
		type: "spring",
		stiffness: 550,
		damping: to === 0 ? 100 : 30,
		restDelta: .01,
		restSpeed: 10
	};
}
function linearTween() {
	return {
		type: "keyframes",
		ease: "linear",
		duration: 300
	};
}
function keyframes(values) {
	return {
		type: "keyframes",
		duration: 800,
		values
	};
}
var defaultTransitions = {
	default: overDampedSpring,
	x: underDampedSpring,
	y: underDampedSpring,
	z: underDampedSpring,
	rotate: underDampedSpring,
	rotateX: underDampedSpring,
	rotateY: underDampedSpring,
	rotateZ: underDampedSpring,
	scaleX: criticallyDampedSpring,
	scaleY: criticallyDampedSpring,
	scale: criticallyDampedSpring,
	backgroundColor: linearTween,
	color: linearTween,
	opacity: linearTween
};
function getDefaultTransition(valueKey, to) {
	let transitionFactory;
	if (isKeyframesTarget(to)) transitionFactory = keyframes;
	else transitionFactory = defaultTransitions[valueKey] || defaultTransitions.default;
	return {
		to,
		...transitionFactory(to)
	};
}
var int = {
	...number,
	transform: Math.round
};
var valueTypes = {
	color,
	backgroundColor: color,
	outlineColor: color,
	fill: color,
	stroke: color,
	borderColor: color,
	borderTopColor: color,
	borderRightColor: color,
	borderBottomColor: color,
	borderLeftColor: color,
	borderWidth: px,
	borderTopWidth: px,
	borderRightWidth: px,
	borderBottomWidth: px,
	borderLeftWidth: px,
	borderRadius: px,
	radius: px,
	borderTopLeftRadius: px,
	borderTopRightRadius: px,
	borderBottomRightRadius: px,
	borderBottomLeftRadius: px,
	width: px,
	maxWidth: px,
	height: px,
	maxHeight: px,
	size: px,
	top: px,
	right: px,
	bottom: px,
	left: px,
	padding: px,
	paddingTop: px,
	paddingRight: px,
	paddingBottom: px,
	paddingLeft: px,
	margin: px,
	marginTop: px,
	marginRight: px,
	marginBottom: px,
	marginLeft: px,
	rotate: degrees,
	rotateX: degrees,
	rotateY: degrees,
	rotateZ: degrees,
	scale,
	scaleX: scale,
	scaleY: scale,
	scaleZ: scale,
	skew: degrees,
	skewX: degrees,
	skewY: degrees,
	distance: px,
	translateX: px,
	translateY: px,
	translateZ: px,
	x: px,
	y: px,
	z: px,
	perspective: px,
	transformPerspective: px,
	opacity: alpha,
	originX: progressPercentage,
	originY: progressPercentage,
	originZ: px,
	zIndex: int,
	filter,
	WebkitFilter: filter,
	fillOpacity: alpha,
	strokeOpacity: alpha,
	numOctaves: int
};
var getValueType = (key) => valueTypes[key];
function getValueAsType(value, type) {
	return type && typeof value === "number" && type.transform ? type.transform(value) : value;
}
function getAnimatableNone(key, value) {
	let defaultValueType = getValueType(key);
	if (defaultValueType !== filter) defaultValueType = complex;
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
var easingLookup = {
	linear,
	easeIn,
	easeInOut,
	easeOut,
	circIn,
	circInOut,
	circOut,
	backIn,
	backInOut,
	backOut,
	anticipate,
	bounceIn,
	bounceInOut,
	bounceOut
};
function easingDefinitionToFunction(definition) {
	if (Array.isArray(definition)) {
		const [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (typeof definition === "string") return easingLookup[definition];
	return definition;
}
function isEasingArray(ease) {
	return Array.isArray(ease) && typeof ease[0] !== "number";
}
function isAnimatable(key, value) {
	if (key === "zIndex") return false;
	if (typeof value === "number" || Array.isArray(value)) return true;
	if (typeof value === "string" && complex.test(value) && !value.startsWith("url(")) return true;
	return false;
}
function hydrateKeyframes(options) {
	if (Array.isArray(options.to) && options.to[0] === null) {
		options.to = [...options.to];
		options.to[0] = options.from;
	}
	return options;
}
function convertTransitionToAnimationOptions({ ease, times, delay, ...transition }) {
	const options = { ...transition };
	if (times) options.offset = times;
	if (ease) options.ease = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
	if (delay) options.elapsed = -delay;
	return options;
}
function getPopmotionAnimationOptions(transition, options, key) {
	if (Array.isArray(options.to)) {
		if (!transition.duration) transition.duration = 800;
	}
	hydrateKeyframes(options);
	if (!isTransitionDefined(transition)) transition = {
		...transition,
		...getDefaultTransition(key, options.to)
	};
	return {
		...options,
		...convertTransitionToAnimationOptions(transition)
	};
}
function isTransitionDefined({ delay, repeat, repeatType, repeatDelay, from, ...transition }) {
	return !!Object.keys(transition).length;
}
function getValueTransition(transition, key) {
	return transition[key] || transition.default || transition;
}
function getAnimation(key, value, target, transition, onComplete) {
	const valueTransition = getValueTransition(transition, key);
	let origin = valueTransition.from === null || valueTransition.from === void 0 ? value.get() : valueTransition.from;
	const isTargetAnimatable = isAnimatable(key, target);
	if (origin === "none" && isTargetAnimatable && typeof target === "string") origin = getAnimatableNone(key, target);
	const isOriginAnimatable = isAnimatable(key, origin);
	function start(complete) {
		const options = {
			from: origin,
			to: target,
			velocity: transition.velocity ? transition.velocity : value.getVelocity(),
			onUpdate: (v) => value.set(v)
		};
		return valueTransition.type === "inertia" || valueTransition.type === "decay" ? inertia({
			...options,
			...valueTransition
		}) : animate({
			...getPopmotionAnimationOptions(valueTransition, options, key),
			onUpdate: (v) => {
				options.onUpdate(v);
				if (valueTransition.onUpdate) valueTransition.onUpdate(v);
			},
			onComplete: () => {
				if (onComplete) onComplete();
				if (complete) complete();
			}
		});
	}
	function set(complete) {
		value.set(target);
		if (onComplete) onComplete();
		if (complete) complete();
		return { stop: () => {} };
	}
	return !isOriginAnimatable || !isTargetAnimatable || valueTransition.type === false ? set : start;
}
function useMotionTransitions() {
	const { motionValues, stop, get } = useMotionValues();
	const push = (key, value, target, transition = {}, onComplete) => {
		const from = target[key];
		const motionValue = get(key, from, target);
		if (transition && transition.immediate) {
			motionValue.set(value);
			return;
		}
		const animation = getAnimation(key, motionValue, value, transition, onComplete);
		motionValue.start(animation);
	};
	return {
		motionValues,
		stop,
		push
	};
}
function useMotionControls(motionProperties, variants = {}, { motionValues, push, stop } = useMotionTransitions()) {
	const _variants = unref(variants);
	const isAnimating = ref(false);
	watch(motionValues, (newVal) => {
		isAnimating.value = Object.values(newVal).filter((value) => value.isAnimating()).length > 0;
	}, {
		immediate: true,
		deep: true
	});
	const getVariantFromKey = (variant) => {
		if (!_variants || !_variants[variant]) throw new Error(`The variant ${variant} does not exist.`);
		return _variants[variant];
	};
	const apply = (variant) => {
		if (typeof variant === "string") variant = getVariantFromKey(variant);
		const animations = Object.entries(variant).map(([key, value]) => {
			if (key === "transition") return void 0;
			return new Promise((resolve) => push(key, value, motionProperties, variant.transition || getDefaultTransition(key, variant[key]), resolve));
		}).filter(Boolean);
		async function waitForComplete() {
			await Promise.all(animations);
			variant.transition?.onComplete?.();
		}
		return Promise.all([waitForComplete()]);
	};
	const set = (variant) => {
		const variantData = isObject$1(variant) ? variant : getVariantFromKey(variant);
		Object.entries(variantData).forEach(([key, value]) => {
			if (key === "transition") return;
			push(key, value, motionProperties, { immediate: true });
		});
	};
	const leave = async (done) => {
		let leaveVariant;
		if (_variants) {
			if (_variants.leave) leaveVariant = _variants.leave;
			if (!_variants.leave && _variants.initial) leaveVariant = _variants.initial;
		}
		if (!leaveVariant) {
			done();
			return;
		}
		await apply(leaveVariant);
		done();
	};
	return {
		isAnimating,
		apply,
		set,
		leave,
		stop
	};
}
function registerEventListeners({ target, state, variants, apply }) {
	const _variants = unref(variants);
	const hovered = ref(false);
	const tapped = ref(false);
	const focused = ref(false);
	const mutableKeys = computed(() => {
		let result = [...Object.keys(state.value || {})];
		if (!_variants) return result;
		if (_variants.hovered) result = [...result, ...Object.keys(_variants.hovered)];
		if (_variants.tapped) result = [...result, ...Object.keys(_variants.tapped)];
		if (_variants.focused) result = [...result, ...Object.keys(_variants.focused)];
		return result;
	});
	const computedProperties = computed(() => {
		const result = {};
		Object.assign(result, state.value);
		if (hovered.value && _variants.hovered) Object.assign(result, _variants.hovered);
		if (tapped.value && _variants.tapped) Object.assign(result, _variants.tapped);
		if (focused.value && _variants.focused) Object.assign(result, _variants.focused);
		for (const key in result) if (!mutableKeys.value.includes(key)) delete result[key];
		return result;
	});
	if (_variants.hovered) {
		useEventListener(target, "mouseenter", () => hovered.value = true);
		useEventListener(target, "mouseleave", () => {
			hovered.value = false;
			tapped.value = false;
		});
	}
	if (_variants.tapped) ;
	if (_variants.focused) {
		useEventListener(target, "focus", () => focused.value = true);
		useEventListener(target, "blur", () => focused.value = false);
	}
	watch([
		hovered,
		tapped,
		focused
	], () => {
		apply(computedProperties.value);
	});
}
function registerLifeCycleHooks({ set, target, variants, variant }) {
	const _variants = unref(variants);
	watch(() => target, () => {
		if (!_variants) return;
		if (_variants.initial) {
			set("initial");
			variant.value = "initial";
		}
		if (_variants.enter) variant.value = "enter";
	}, {
		immediate: true,
		flush: "pre"
	});
}
function registerVariantsSync({ state, apply }) {
	watch(state, (newVal) => {
		if (newVal) apply(newVal);
	}, { immediate: true });
}
function registerVisibilityHooks({ target, variants, variant }) {
	const _variants = unref(variants);
	if (_variants && (_variants.visible || _variants.visibleOnce)) useIntersectionObserver(target, ([{ isIntersecting }]) => {
		if (_variants.visible) if (isIntersecting) variant.value = "visible";
		else variant.value = "initial";
		else if (_variants.visibleOnce) {
			if (isIntersecting && variant.value !== "visibleOnce") variant.value = "visibleOnce";
			else if (!variant.value) variant.value = "initial";
		}
	});
}
function useMotionFeatures(instance, options = {
	syncVariants: true,
	lifeCycleHooks: true,
	visibilityHooks: true,
	eventListeners: true
}) {
	if (options.lifeCycleHooks) registerLifeCycleHooks(instance);
	if (options.syncVariants) registerVariantsSync(instance);
	if (options.visibilityHooks) registerVisibilityHooks(instance);
	if (options.eventListeners) registerEventListeners(instance);
}
function reactiveStyle(props = {}) {
	const state = reactive({ ...props });
	const style = ref({});
	watch(state, () => {
		const result = {};
		for (const [key, value] of Object.entries(state)) result[key] = getValueAsType(value, getValueType(key));
		style.value = result;
	}, {
		immediate: true,
		deep: true
	});
	return {
		state,
		style
	};
}
function usePermissiveTarget(target, onTarget) {
	watch(() => unrefElement(target), (el) => {
		if (!el) return;
		onTarget(el);
	}, { immediate: true });
}
var translateAlias = {
	x: "translateX",
	y: "translateY",
	z: "translateZ"
};
function reactiveTransform(props = {}, enableHardwareAcceleration = true) {
	const state = reactive({ ...props });
	const transform = ref("");
	watch(state, (newVal) => {
		let result = "";
		let hasHardwareAcceleration = false;
		if (enableHardwareAcceleration && (newVal.x || newVal.y || newVal.z)) {
			const str = [
				newVal.x || 0,
				newVal.y || 0,
				newVal.z || 0
			].map((val) => getValueAsType(val, px)).join(",");
			result += `translate3d(${str}) `;
			hasHardwareAcceleration = true;
		}
		for (const [key, value] of Object.entries(newVal)) {
			if (enableHardwareAcceleration && (key === "x" || key === "y" || key === "z")) continue;
			const valueAsType = getValueAsType(value, getValueType(key));
			result += `${translateAlias[key] || key}(${valueAsType}) `;
		}
		if (enableHardwareAcceleration && !hasHardwareAcceleration) result += "translateZ(0px) ";
		transform.value = result.trim();
	}, {
		immediate: true,
		deep: true
	});
	return {
		state,
		transform
	};
}
var transformAxes = [
	"",
	"X",
	"Y",
	"Z"
];
var order = [
	"perspective",
	"translate",
	"scale",
	"rotate",
	"skew"
];
var transformProps = [
	"transformPerspective",
	"x",
	"y",
	"z"
];
order.forEach((operationKey) => {
	transformAxes.forEach((axesKey) => {
		const key = operationKey + axesKey;
		transformProps.push(key);
	});
});
var transformPropSet = new Set(transformProps);
function isTransformProp(key) {
	return transformPropSet.has(key);
}
var transformOriginProps = /* @__PURE__ */ new Set([
	"originX",
	"originY",
	"originZ"
]);
function isTransformOriginProp(key) {
	return transformOriginProps.has(key);
}
function splitValues(variant) {
	const transform = {};
	const style = {};
	Object.entries(variant).forEach(([key, value]) => {
		if (isTransformProp(key) || isTransformOriginProp(key)) transform[key] = value;
		else style[key] = value;
	});
	return {
		transform,
		style
	};
}
function variantToStyle(variant) {
	const { transform: _transform, style: _style } = splitValues(variant);
	const { transform } = reactiveTransform(_transform);
	const { style } = reactiveStyle(_style);
	if (transform.value) style.value.transform = transform.value;
	return style.value;
}
function useElementStyle(target, onInit) {
	let _cache;
	let _target;
	const { state, style } = reactiveStyle();
	usePermissiveTarget(target, (el) => {
		_target = el;
		for (const key of Object.keys(valueTypes)) {
			if (el.style[key] === null || el.style[key] === "" || isTransformProp(key) || isTransformOriginProp(key)) continue;
			state[key] = el.style[key];
		}
		if (_cache) Object.entries(_cache).forEach(([key, value]) => el.style[key] = value);
		if (onInit) onInit(state);
	});
	watch(style, (newVal) => {
		if (!_target) {
			_cache = newVal;
			return;
		}
		for (const key in newVal) _target.style[key] = newVal[key];
	}, { immediate: true });
	return { style: state };
}
function parseTransform(transform) {
	const transforms = transform.trim().split(/\) |\)/);
	if (transforms.length === 1) return {};
	const parseValues = (value) => {
		if (value.endsWith("px") || value.endsWith("deg")) return Number.parseFloat(value);
		if (Number.isNaN(Number(value))) return Number(value);
		return value;
	};
	return transforms.reduce((acc, transform2) => {
		if (!transform2) return acc;
		const [name, transformValue] = transform2.split("(");
		const values = transformValue.split(",").map((val) => {
			return parseValues(val.endsWith(")") ? val.replace(")", "") : val.trim());
		});
		const value = values.length === 1 ? values[0] : values;
		return {
			...acc,
			[name]: value
		};
	}, {});
}
function stateFromTransform(state, transform) {
	Object.entries(parseTransform(transform)).forEach(([key, value]) => {
		const axes = [
			"x",
			"y",
			"z"
		];
		if (key === "translate3d") {
			if (value === 0) {
				axes.forEach((axis) => state[axis] = 0);
				return;
			}
			value.forEach((axisValue, index) => state[axes[index]] = axisValue);
			return;
		}
		value = Number.parseFloat(`${value}`);
		if (key === "translateX") {
			state.x = value;
			return;
		}
		if (key === "translateY") {
			state.y = value;
			return;
		}
		if (key === "translateZ") {
			state.z = value;
			return;
		}
		state[key] = value;
	});
}
function useElementTransform(target, onInit) {
	let _cache;
	let _target;
	const { state, transform } = reactiveTransform();
	usePermissiveTarget(target, (el) => {
		_target = el;
		if (el.style.transform) stateFromTransform(state, el.style.transform);
		if (_cache) el.style.transform = _cache;
		if (onInit) onInit(state);
	});
	watch(transform, (newValue) => {
		if (!_target) {
			_cache = newValue;
			return;
		}
		_target.style.transform = newValue;
	}, { immediate: true });
	return { transform: state };
}
function objectEntries(obj) {
	return Object.entries(obj);
}
function useMotionProperties(target, defaultValues) {
	const motionProperties = reactive({});
	const apply = (values) => Object.entries(values).forEach(([key, value]) => motionProperties[key] = value);
	const { style } = useElementStyle(target, apply);
	const { transform } = useElementTransform(target, apply);
	watch(motionProperties, (newVal) => {
		objectEntries(newVal).forEach(([key, value]) => {
			const target2 = isTransformProp(key) ? transform : style;
			if (target2[key] && target2[key] === value) return;
			target2[key] = value;
		});
	}, {
		immediate: true,
		deep: true
	});
	usePermissiveTarget(target, () => defaultValues);
	return {
		motionProperties,
		style,
		transform
	};
}
function useMotionVariants(variants = {}) {
	const _variants = unref(variants);
	const variant = ref();
	return {
		state: computed(() => {
			if (!variant.value) return;
			return _variants[variant.value];
		}),
		variant
	};
}
function useMotion(target, variants = {}, options) {
	const { motionProperties } = useMotionProperties(target);
	const { variant, state } = useMotionVariants(variants);
	const instance = {
		target,
		variant,
		variants,
		state,
		motionProperties,
		...useMotionControls(motionProperties, variants)
	};
	useMotionFeatures(instance, options);
	return instance;
}
var transitionKeys = ["delay", "duration"];
var directivePropsKeys = [
	"initial",
	"enter",
	"leave",
	"visible",
	"visible-once",
	"visibleOnce",
	"hovered",
	"tapped",
	"focused",
	...transitionKeys
];
function isTransitionKey(val) {
	return transitionKeys.includes(val);
}
function resolveVariants(node, variantsRef) {
	const target = node.props ? node.props : node.data && node.data.attrs ? node.data.attrs : {};
	if (target) {
		if (target.variants && isObject$1(target.variants)) variantsRef.value = {
			...variantsRef.value,
			...target.variants
		};
		for (let key of directivePropsKeys) {
			if (!target || !target[key]) continue;
			if (isTransitionKey(key) && typeof target[key] === "number") {
				for (const variantKey of [
					"enter",
					"visible",
					"visibleOnce"
				]) {
					const variantConfig = variantsRef.value[variantKey];
					if (variantConfig == null) continue;
					variantConfig.transition ?? (variantConfig.transition = {});
					variantConfig.transition[key] = target[key];
				}
				continue;
			}
			if (isObject$1(target[key])) {
				const prop = target[key];
				if (key === "visible-once") key = "visibleOnce";
				variantsRef.value[key] = prop;
			}
		}
	}
}
function directive(variants, isPreset = false) {
	const register = (el, binding, node) => {
		const key = binding.value && typeof binding.value === "string" ? binding.value : node.key;
		if (key && motionState[key]) motionState[key].stop();
		const variantsObject = isPreset ? structuredClone(toRaw(variants) || {}) : variants || {};
		const variantsRef = ref(variantsObject);
		if (typeof binding.value === "object") variantsRef.value = binding.value;
		resolveVariants(node, variantsRef);
		const motionInstance = useMotion(el, variantsRef, {
			eventListeners: true,
			lifeCycleHooks: true,
			syncVariants: true,
			visibilityHooks: false
		});
		el.motionInstance = motionInstance;
		if (key) motionState[key] = motionInstance;
	};
	const mounted = (el, _binding, _node) => {
		el.motionInstance && registerVisibilityHooks(el.motionInstance);
	};
	return {
		created: register,
		mounted,
		getSSRProps(binding, node) {
			let { initial: bindingInitial } = binding.value || node && node?.props || {};
			bindingInitial = unref(bindingInitial);
			const initial = defu({}, variants?.initial || {}, bindingInitial || {});
			if (!initial || Object.keys(initial).length === 0) return;
			return { style: variantToStyle(initial) };
		}
	};
}
var presets = {
	__proto__: null,
	fade: {
		initial: { opacity: 0 },
		enter: { opacity: 1 }
	},
	fadeVisible: {
		initial: { opacity: 0 },
		visible: { opacity: 1 }
	},
	fadeVisibleOnce: {
		initial: { opacity: 0 },
		visibleOnce: { opacity: 1 }
	},
	pop: {
		initial: {
			scale: 0,
			opacity: 0
		},
		enter: {
			scale: 1,
			opacity: 1
		}
	},
	popVisible: {
		initial: {
			scale: 0,
			opacity: 0
		},
		visible: {
			scale: 1,
			opacity: 1
		}
	},
	popVisibleOnce: {
		initial: {
			scale: 0,
			opacity: 0
		},
		visibleOnce: {
			scale: 1,
			opacity: 1
		}
	},
	rollBottom: {
		initial: {
			y: 100,
			rotate: 90,
			opacity: 0
		},
		enter: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollLeft: {
		initial: {
			x: -100,
			rotate: 90,
			opacity: 0
		},
		enter: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollRight: {
		initial: {
			x: 100,
			rotate: -90,
			opacity: 0
		},
		enter: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollTop: {
		initial: {
			y: -100,
			rotate: -90,
			opacity: 0
		},
		enter: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleBottom: {
		initial: {
			y: 100,
			rotate: 90,
			opacity: 0
		},
		visible: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleLeft: {
		initial: {
			x: -100,
			rotate: 90,
			opacity: 0
		},
		visible: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleOnceBottom: {
		initial: {
			y: 100,
			rotate: 90,
			opacity: 0
		},
		visibleOnce: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleOnceLeft: {
		initial: {
			x: -100,
			rotate: 90,
			opacity: 0
		},
		visibleOnce: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleOnceRight: {
		initial: {
			x: 100,
			rotate: -90,
			opacity: 0
		},
		visibleOnce: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleOnceTop: {
		initial: {
			y: -100,
			rotate: -90,
			opacity: 0
		},
		visibleOnce: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleRight: {
		initial: {
			x: 100,
			rotate: -90,
			opacity: 0
		},
		visible: {
			x: 0,
			rotate: 0,
			opacity: 1
		}
	},
	rollVisibleTop: {
		initial: {
			y: -100,
			rotate: -90,
			opacity: 0
		},
		visible: {
			y: 0,
			rotate: 0,
			opacity: 1
		}
	},
	slideBottom: {
		initial: {
			y: 100,
			opacity: 0
		},
		enter: {
			y: 0,
			opacity: 1
		}
	},
	slideLeft: {
		initial: {
			x: -100,
			opacity: 0
		},
		enter: {
			x: 0,
			opacity: 1
		}
	},
	slideRight: {
		initial: {
			x: 100,
			opacity: 0
		},
		enter: {
			x: 0,
			opacity: 1
		}
	},
	slideTop: {
		initial: {
			y: -100,
			opacity: 0
		},
		enter: {
			y: 0,
			opacity: 1
		}
	},
	slideVisibleBottom: {
		initial: {
			y: 100,
			opacity: 0
		},
		visible: {
			y: 0,
			opacity: 1
		}
	},
	slideVisibleLeft: {
		initial: {
			x: -100,
			opacity: 0
		},
		visible: {
			x: 0,
			opacity: 1
		}
	},
	slideVisibleOnceBottom: {
		initial: {
			y: 100,
			opacity: 0
		},
		visibleOnce: {
			y: 0,
			opacity: 1
		}
	},
	slideVisibleOnceLeft: {
		initial: {
			x: -100,
			opacity: 0
		},
		visibleOnce: {
			x: 0,
			opacity: 1
		}
	},
	slideVisibleOnceRight: {
		initial: {
			x: 100,
			opacity: 0
		},
		visibleOnce: {
			x: 0,
			opacity: 1
		}
	},
	slideVisibleOnceTop: {
		initial: {
			y: -100,
			opacity: 0
		},
		visibleOnce: {
			y: 0,
			opacity: 1
		}
	},
	slideVisibleRight: {
		initial: {
			x: 100,
			opacity: 0
		},
		visible: {
			x: 0,
			opacity: 1
		}
	},
	slideVisibleTop: {
		initial: {
			y: -100,
			opacity: 0
		},
		visible: {
			y: 0,
			opacity: 1
		}
	}
};
function slugify(str) {
	const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
	const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
	const p = new RegExp(a.split("").join("|"), "g");
	return str.toString().replace(/[A-Z]/g, (s) => `-${s}`).toLowerCase().replace(/\s+/g, "-").replace(p, (c) => b.charAt(a.indexOf(c))).replace(/&/g, "-and-").replace(/[^\w\-]+/g, "").replace(/-{2,}/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}
var CUSTOM_PRESETS = Symbol("");
var MotionComponentProps = {
	preset: {
		type: String,
		required: false
	},
	instance: {
		type: Object,
		required: false
	},
	variants: {
		type: Object,
		required: false
	},
	initial: {
		type: Object,
		required: false
	},
	enter: {
		type: Object,
		required: false
	},
	leave: {
		type: Object,
		required: false
	},
	visible: {
		type: Object,
		required: false
	},
	visibleOnce: {
		type: Object,
		required: false
	},
	hovered: {
		type: Object,
		required: false
	},
	tapped: {
		type: Object,
		required: false
	},
	focused: {
		type: Object,
		required: false
	},
	delay: {
		type: [Number, String],
		required: false
	},
	duration: {
		type: [Number, String],
		required: false
	}
};
function isObject(val) {
	return Object.prototype.toString.call(val) === "[object Object]";
}
function clone(v) {
	if (Array.isArray(v)) return v.map(clone);
	if (isObject(v)) {
		const res = {};
		for (const key in v) res[key] = clone(v[key]);
		return res;
	}
	return v;
}
function setupMotionComponent(props) {
	const instances = reactive({});
	const customPresets = inject(CUSTOM_PRESETS, {});
	const preset = computed(() => {
		if (props.preset == null) return {};
		if (customPresets != null && props.preset in customPresets) return structuredClone(toRaw(customPresets)[props.preset]);
		if (props.preset in presets) return structuredClone(presets[props.preset]);
		return {};
	});
	const propsConfig = computed(() => ({
		initial: props.initial,
		enter: props.enter,
		leave: props.leave,
		visible: props.visible,
		visibleOnce: props.visibleOnce,
		hovered: props.hovered,
		tapped: props.tapped,
		focused: props.focused
	}));
	function applyTransitionHelpers(config, values) {
		for (const transitionKey of ["delay", "duration"]) {
			if (values[transitionKey] == null) continue;
			const transitionValueParsed = Number.parseInt(values[transitionKey]);
			for (const variantKey of [
				"enter",
				"visible",
				"visibleOnce"
			]) {
				const variantConfig = config[variantKey];
				if (variantConfig == null) continue;
				variantConfig.transition ?? (variantConfig.transition = {});
				variantConfig.transition[transitionKey] = transitionValueParsed;
			}
		}
		return config;
	}
	const motionConfig = computed(() => {
		return applyTransitionHelpers({ ...defu({}, propsConfig.value, preset.value, props.variants || {}) }, props);
	});
	function setNodeInstance(node, index, style) {
		var _a;
		node.props ?? (node.props = {});
		(_a = node.props).style ?? (_a.style = {});
		node.props.style = {
			...node.props.style,
			...style
		};
		const elementMotionConfig = applyTransitionHelpers(clone(motionConfig.value), node.props);
		node.props.onVnodeMounted = ({ el }) => {
			instances[index] = useMotion(el, elementMotionConfig);
		};
		node.props.onVnodeUpdated = ({ el }) => {
			const styles = variantToStyle(instances[index].state);
			for (const [key, val] of Object.entries(styles)) el.style[key] = val;
		};
		return node;
	}
	return {
		motionConfig,
		setNodeInstance
	};
}
var MotionComponent = defineComponent({
	name: "Motion",
	props: {
		...MotionComponentProps,
		is: {
			type: [String, Object],
			default: "div"
		}
	},
	setup(props) {
		const slots = useSlots();
		const { motionConfig, setNodeInstance } = setupMotionComponent(props);
		return () => {
			const style = variantToStyle(motionConfig.value.initial || {});
			const node = h(props.is, void 0, slots);
			setNodeInstance(node, 0, style);
			return node;
		};
	}
});
var MotionGroupComponent = defineComponent({
	name: "MotionGroup",
	props: {
		...MotionComponentProps,
		is: {
			type: [String, Object],
			required: false
		}
	},
	setup(props) {
		const slots = useSlots();
		const { motionConfig, setNodeInstance } = setupMotionComponent(props);
		return () => {
			const style = variantToStyle(motionConfig.value.initial || {});
			const nodes = slots.default?.() || [];
			for (let i = 0; i < nodes.length; i++) {
				const n = nodes[i];
				if (n.type === Fragment && Array.isArray(n.children)) n.children.forEach(function setChildInstance(child, index) {
					if (child == null) return;
					if (Array.isArray(child)) {
						setChildInstance(child, index);
						return;
					}
					if (typeof child === "object") setNodeInstance(child, index, style);
				});
				else setNodeInstance(n, i, style);
			}
			if (props.is) return h(props.is, void 0, nodes);
			return nodes;
		};
	}
});
var MotionPlugin = { install(app, options) {
	app.directive("motion", directive());
	if (!options || options && !options.excludePresets) for (const key in presets) {
		const preset = presets[key];
		app.directive(`motion-${slugify(key)}`, directive(preset, true));
	}
	if (options && options.directives) for (const key in options.directives) {
		const variants = options.directives[key];
		if (!variants.initial && false);
		app.directive(`motion-${key}`, directive(variants, true));
	}
	app.provide(CUSTOM_PRESETS, options?.directives);
	app.component("Motion", MotionComponent);
	app.component("MotionGroup", MotionGroupComponent);
} };
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	plugin,
	virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default,
	/* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
		const config = /* @__PURE__ */ useRuntimeConfig();
		nuxtApp.vueApp.use(MotionPlugin, config.public.motion);
	})
];
//#endregion
//#region node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region app/app.vue
var _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_NuxtPage = page_default;
	_push(`<div${ssrRenderAttrs(_attrs)}>`);
	_push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
	_push(`</div>`);
}
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var app_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import('../build/error-404-CIicuKxY.mjs'));
		const _Error = defineAsyncComponent(() => import('../build/error-500-B-0dffc5.mjs'));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { $fetch$1 as $, _plugin_vue_export_helper_default as _, useHead$1 as a, useRouter as b, useNuxtApp as c, nuxtLinkDefaults as d, encodeRoutePath as e, entry as f, navigateTo as n, resolveRouteObject as r, useRuntimeConfig as u };
//# sourceMappingURL=entry.mjs.map
