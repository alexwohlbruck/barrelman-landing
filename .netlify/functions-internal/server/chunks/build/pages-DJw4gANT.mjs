import { u as useRuntimeConfig, a as useHead$1, _ as _plugin_vue_export_helper_default, $ as $fetch$1 } from '../virtual/entry.mjs';
import { defineComponent, ref, mergeProps, unref, resolveDirective, withCtx, createTextVNode, createVNode, resolveDynamicComponent, createElementBlock, computed, watch, shallowRef, watchEffect, toValue, toDisplayString, openBlock, createBlock, createCommentVNode, hasInjectionContext, getCurrentInstance, inject, getCurrentScope, onScopeDispose, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrGetDirectiveProps, ssrRenderVNode, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderSlot } from 'vue/server-renderer';
import { X, Menu, ArrowRight, BookOpen, Search, MapPin, Layers, Navigation, Waypoints, Clock, Shapes, Bike, Users, Globe, Scale, ArrowUpRight, Check, Minus, ArrowLeft, Copy, Loader } from 'lucide-vue-next';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import 'framesync';
import 'popmotion';
import 'style-value-types';
import 'unhead/utils';

//#region app/components/BrandMark.vue?vue&type=script&setup=true&lang.ts
var BrandMark_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BrandMark",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The mark: an eight-point rose with a ring at its centre — the crow's nest
		* seen from above, sitting where the axis of the compass would be. The
		* barrelman is the man at the middle of the rose, which is the whole joke.
		*
		* Hand-authored rather than reusing <CompassRose>: that one's limb and
		* thirty-two points turn to mud below about 40px, and this has to survive
		* 20px in a nav bar. The two halves of each point are filled at different
		* opacities instead of fill-versus-stroke, because a hairline stroke
		* disappears entirely at that size.
		*/
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				viewBox: "0 0 32 32",
				fill: "none",
				"aria-hidden": "true",
				xmlns: "http://www.w3.org/2000/svg"
			}, _attrs))}><g fill="currentColor"><path d="M16 16 L16 13 L22.72 9.28 Z" opacity="0.75"></path><path d="M16 16 L22.72 9.28 L19 16 Z" opacity="0.35"></path><path d="M16 16 L19 16 L22.72 22.72 Z" opacity="0.75"></path><path d="M16 16 L22.72 22.72 L16 19 Z" opacity="0.35"></path><path d="M16 16 L16 19 L9.28 22.72 Z" opacity="0.75"></path><path d="M16 16 L9.28 22.72 L13 16 Z" opacity="0.35"></path><path d="M16 16 L13 16 L9.28 9.28 Z" opacity="0.75"></path><path d="M16 16 L9.28 9.28 L16 13 Z" opacity="0.35"></path><path d="M16 16 L12.82 12.82 L16 1 Z" fill="var(--rubric, #b4472e)"></path><path d="M16 16 L16 1 L19.18 12.82 Z" fill="var(--rubric, #b4472e)" opacity="0.45"></path><path d="M16 16 L19.18 12.82 L31 16 Z"></path><path d="M16 16 L31 16 L19.18 19.18 Z" opacity="0.45"></path><path d="M16 16 L19.18 19.18 L16 31 Z"></path><path d="M16 16 L16 31 L12.82 19.18 Z" opacity="0.45"></path><path d="M16 16 L12.82 19.18 L1 16 Z"></path><path d="M16 16 L1 16 L12.82 12.82 Z" opacity="0.45"></path></g><circle cx="16" cy="16" r="3.6" fill="var(--nest-fill, #fff9f3)"></circle><circle cx="16" cy="16" r="3.6" stroke="currentColor" stroke-width="1.1"></circle></svg>`);
		};
	}
});
//#endregion
//#region app/components/BrandMark.vue
var _sfc_setup$14 = BrandMark_vue_vue_type_script_setup_true_lang_default.setup;
BrandMark_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BrandMark.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var BrandMark_default = Object.assign(BrandMark_vue_vue_type_script_setup_true_lang_default, { __name: "BrandMark" });
//#endregion
//#region app/components/SiteNav.vue?vue&type=script&setup=true&lang.ts
var SiteNav_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SiteNav",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The nav, matching Parchment's: a floating glass pill.
		*
		* This was a ruled title band that started transparent and only gained a
		* background once you scrolled — which meant that at the top of the page, the
		* one place everyone sees first, the links sat directly on the rhumb network
		* with nothing behind them. It is now filled at all times, the way Parchment's
		* is, so there is no state in which it is unreadable.
		*
		* Two deliberate deviations from Parchment's version:
		*
		* - Paper rather than white glass. Parchment floats over a photographic map,
		*   so `bg-white/40` reads as glass there; over this sheet, which is already
		*   near-white, white-on-white would leave the pill invisible again. Tinted
		*   paper plus a rule gives it an edge.
		* - Capped at the content measure. Parchment's `lg:w-[60%]` has no content
		*   below it to relate to; here it would be narrower than the page at 1440
		*   and wider than it at 1920. `max-w-5xl` pins it to the same column
		*   everything else uses once the viewport is wide enough to matter.
		*
		* The pill is the one rounded thing on an otherwise squared sheet. That is the
		* point — it floats above the chart rather than being drawn on it.
		*/
		const { public: config } = useRuntimeConfig();
		const links = [
			{
				href: "#capabilities",
				label: "Capabilities"
			},
			{
				href: "#pricing",
				label: "Pricing"
			},
			{
				href: config.docsUrl,
				label: "Docs",
				external: true
			},
			{
				href: config.githubUrl,
				label: "Source",
				external: true
			}
		];
		const open = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_BrandMark = BrandMark_default;
			_push(`<nav${ssrRenderAttrs(mergeProps({
				class: ["nav-pill", { "nav-pill-open": open.value }],
				"aria-label": "Primary"
			}, _attrs))}><div class="flex items-center justify-between gap-6"><a href="#top" class="flex shrink-0 items-center gap-2 text-ink">`);
			_push(ssrRenderComponent(_component_BrandMark, { class: "size-[1.375rem]" }, null, _parent));
			_push(`<span class="display text-lg leading-none">Barrelman</span></a><ul class="hidden items-center gap-7 text-ink-soft md:flex"><!--[-->`);
			ssrRenderList(links, (link) => {
				_push(`<li><a${ssrRenderAttr("href", link.href)}${ssrRenderAttr("target", link.external ? "_blank" : void 0)}${ssrRenderAttr("rel", link.external ? "noopener" : void 0)} class="transition-colors hover:text-ink">${ssrInterpolate(link.label)}</a></li>`);
			});
			_push(`<!--]--></ul><div class="flex shrink-0 items-center gap-1"><a${ssrRenderAttr("href", unref(config).consoleUrl)} class="hidden rounded-full px-3 py-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:block"> Sign in </a><a${ssrRenderAttr("href", unref(config).consoleUrl)} class="btn-ink rounded-full px-4 py-1.5">Get a key</a><button class="ml-1 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink md:hidden"${ssrRenderAttr("aria-expanded", open.value)} aria-label="Toggle navigation">`);
			if (open.value) _push(ssrRenderComponent(unref(X), {
				class: "size-5",
				"stroke-width": "1.5"
			}, null, _parent));
			else _push(ssrRenderComponent(unref(Menu), {
				class: "size-5",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</button></div></div>`);
			if (open.value) {
				_push(`<ul class="mt-1 flex flex-col border-t border-rule pt-1 md:hidden"><!--[-->`);
				ssrRenderList(links, (link) => {
					_push(`<li><a${ssrRenderAttr("href", link.href)}${ssrRenderAttr("target", link.external ? "_blank" : void 0)}${ssrRenderAttr("rel", link.external ? "noopener" : void 0)} class="block rounded-lg px-2 py-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink">${ssrInterpolate(link.label)}</a></li>`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			_push(`</nav>`);
		};
	}
});
//#endregion
//#region app/components/SiteNav.vue
var _sfc_setup$13 = SiteNav_vue_vue_type_script_setup_true_lang_default.setup;
SiteNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteNav.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var SiteNav_default = Object.assign(SiteNav_vue_vue_type_script_setup_true_lang_default, { __name: "SiteNav" });
//#endregion
//#region app/components/CompassRose.vue?vue&type=script&setup=true&lang.ts
var C = 100;
/** One point of the rose: tip at `reach`, shoulders at `waist` either side. */
var CompassRose_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CompassRose",
	__ssrInlineRender: true,
	props: {
		graduated: {
			type: Boolean,
			default: true
		},
		rubricNorth: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		/**
		* A compass rose, constructed rather than drawn.
		*
		* Thirty-two points, a graduated limb and the fleur-de-lis north — the whole
		* thing is generated from angles, so it stays exact at any size and the ratios
		* can be tuned in one place. Hand-authoring 32 paths would have been the same
		* picture and unmaintainable.
		*
		* Every point is two triangles meeting at the axis: the anticlockwise half
		* inked, the clockwise half left as paper. That alternation is what makes a
		* rose read as three-dimensional on a flat sheet, and it is why the shape
		* survives being shrunk to 20px in a nav bar.
		*/
		const props = __props;
		function at(deg, r) {
			const rad = deg * Math.PI / 180;
			return `${(C + r * Math.sin(rad)).toFixed(2)} ${(C - r * Math.cos(rad)).toFixed(2)}`;
		}
		function point(deg, reach, waist, spread) {
			const tip = at(deg, reach);
			return {
				deg,
				dark: `M${C} ${C} L${at(deg - spread, waist)} L${tip} Z`,
				light: `M${C} ${C} L${tip} L${at(deg + spread, waist)} Z`
			};
		}
		const cardinals = computed(() => [
			0,
			90,
			180,
			270
		].map((d) => point(d, 82, 26, 45)));
		const ordinals = computed(() => [
			45,
			135,
			225,
			315
		].map((d) => point(d, 58, 18, 45)));
		const halves = computed(() => [
			22.5,
			67.5,
			112.5,
			157.5,
			202.5,
			247.5,
			292.5,
			337.5
		].map((d) => point(d, 46, 11, 22.5)));
		const quarters = computed(() => Array.from({ length: 16 }, (_, i) => 11.25 + i * 22.5).map((d) => point(d, 34, 6, 11.25)));
		/** Graduations on the limb: every 5°, longer on each 30°. */
		const ticks = computed(() => Array.from({ length: 72 }, (_, i) => {
			const deg = i * 5;
			const major = deg % 30 === 0;
			return {
				deg,
				from: at(deg, major ? 86 : 89),
				to: at(deg, 93),
				major
			};
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${ssrRenderAttrs(mergeProps({
				viewBox: "0 0 200 200",
				fill: "none",
				"aria-hidden": "true",
				xmlns: "http://www.w3.org/2000/svg"
			}, _attrs))}>`);
			if (props.graduated) {
				_push(`<g stroke="currentColor"><circle cx="100" cy="100" r="95" stroke-width="0.8" opacity="0.65"></circle><circle cx="100" cy="100" r="93" stroke-width="0.5" opacity="0.4"></circle><circle cx="100" cy="100" r="86" stroke-width="0.5" opacity="0.4"></circle><circle cx="100" cy="100" r="60" stroke-width="0.4" opacity="0.25"></circle><!--[-->`);
				ssrRenderList(ticks.value, (tick) => {
					_push(`<path${ssrRenderAttr("d", `M${tick.from} L${tick.to}`)}${ssrRenderAttr("stroke-width", tick.major ? .9 : .5)}${ssrRenderAttr("opacity", tick.major ? .7 : .35)}></path>`);
				});
				_push(`<!--]--></g>`);
			} else _push(`<!---->`);
			_push(`<g opacity="0.5"><!--[-->`);
			ssrRenderList(quarters.value, (p) => {
				_push(`<!--[--><path${ssrRenderAttr("d", p.dark)} fill="currentColor" opacity="0.55"></path><path${ssrRenderAttr("d", p.light)} fill="none" stroke="currentColor" stroke-width="0.4"></path><!--]-->`);
			});
			_push(`<!--]--></g><g opacity="0.75"><!--[-->`);
			ssrRenderList(halves.value, (p) => {
				_push(`<!--[--><path${ssrRenderAttr("d", p.dark)} fill="currentColor" opacity="0.6"></path><path${ssrRenderAttr("d", p.light)} fill="none" stroke="currentColor" stroke-width="0.5"></path><!--]-->`);
			});
			_push(`<!--]--></g><!--[-->`);
			ssrRenderList(ordinals.value, (p) => {
				_push(`<!--[--><path${ssrRenderAttr("d", p.dark)} fill="currentColor" opacity="0.8"></path><path${ssrRenderAttr("d", p.light)} fill="none" stroke="currentColor" stroke-width="0.7"></path><!--]-->`);
			});
			_push(`<!--]--><!--[-->`);
			ssrRenderList(cardinals.value, (p) => {
				_push(`<!--[--><path${ssrRenderAttr("d", p.dark)}${ssrRenderAttr("fill", props.rubricNorth && p.deg === 0 ? "var(--rubric)" : "currentColor")}></path><path${ssrRenderAttr("d", p.light)} fill="none" stroke="currentColor" stroke-width="0.9"></path><!--]-->`);
			});
			_push(`<!--]-->`);
			if (props.graduated) _push(`<path d="M100 2 L103.4 11.4 L100 8.6 L96.6 11.4 Z"${ssrRenderAttr("fill", props.rubricNorth ? "var(--rubric)" : "currentColor")}></path>`);
			else _push(`<!---->`);
			_push(`<circle cx="100" cy="100" r="3.4" fill="currentColor"></circle><circle cx="100" cy="100" r="6.5" stroke="currentColor" stroke-width="0.6"></circle></svg>`);
		};
	}
});
//#endregion
//#region app/components/CompassRose.vue
var _sfc_setup$12 = CompassRose_vue_vue_type_script_setup_true_lang_default.setup;
CompassRose_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CompassRose.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var CompassRose_default = Object.assign(CompassRose_vue_vue_type_script_setup_true_lang_default, { __name: "CompassRose" });
//#endregion
//#region app/components/RhumbLines.vue?vue&type=script&setup=true&lang.ts
/**
* The viewBox aspect is deliberately close to the hero's own.
*
* `slice` scales to cover, so the zoom factor is the *larger* of the two axis
* ratios — a wide 1200x700 artwork in a tall hero was magnified over 2x, and
* the rose swelled to dominate the page at some widths while looking right at
* others. Keeping the artwork tallish holds the scale near 1 across the range.
*/
var W = 1200;
var H = 1e3;
/**
* Hubs, placed off the centre line so the web doesn't look symmetrical.
*
* `sway` is how many degrees each rose turns at the extremes of the viewport.
* They differ, and one runs backwards, so the three networks slide across each
* other instead of turning as a single rigid sheet.
*
* The closing band's sky answers the same two drivers, and deliberately does
* not do this: those stars are one sphere at one distance, so they turn
* together and the depth comes from how far each sits from the meridian. Three
* charts on a table may slide over each other; a sky may not.
*/
var SWAY_MARGIN = 1.08;
var OVERSCAN = 1.18;
/** Radius of the drawn rose at the principal hub. */
var ROSE = 104;
/** The single scalar every bundle's angle is a multiple of. */
var RhumbLines_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "RhumbLines",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The rhumb-line network — the web of loxodromes radiating from wind roses
		* that covers every portolan chart, and the single feature that makes a
		* drawing read as a sea chart rather than a map.
		*
		* The colouring is the historical convention, not decoration: the eight
		* principal winds are inked, the eight half-winds green, the sixteen
		* quarter-winds red. Rendering all thirty-two the same weight would give a
		* starburst; the three-tier hierarchy is what makes it legible as a network.
		*
		* Generated from angles so the geometry stays exact.
		*
		* The one moving part is a slow sway of each rose, driven by the cursor and by
		* how far the hero has scrolled. It has to clear two thresholds at once: large
		* enough to register at all — the first pass ran at two degrees and was
		* invisible, because the lines are hairlines at 15-26% opacity and a two-degree
		* turn moves them less than their own stroke width near the hub — and small
		* enough that it never pulls the eye off the headline sitting on top of it. Six
		* degrees, eased slowly, is where a chart reads as being turned on a table
		* rather than as a video.
		*
		* Scroll matters for more than variety: `pointermove` never fires on a touch
		* screen and rarely for someone navigating by keyboard, so cursor alone left
		* the chart frozen for both. An earlier version covered that with a permanent
		* idle drift, which bought it with a sixty-times-a-second repaint of the most
		* expensive region on the page. Scroll gives the same reassurance that the
		* page is alive and costs nothing while the page is still.
		*/
		const hubs = [
			{
				x: 890,
				y: 320,
				sway: 6
			},
			{
				x: 200,
				y: 170,
				sway: -4.2
			},
			{
				x: 400,
				y: 870,
				sway: 3.1
			}
		];
		/**
		* How far each bundle's lines actually need to run: to the corner of the
		* artwork furthest from that hub, plus a margin so the sway cannot swing an
		* endpoint inside the frame and open a wedge at a corner.
		*/
		function reach(hub) {
			return Math.max(...[
				[0, 0],
				[W, 0],
				[0, H],
				[W, H]
			].map(([cx, cy]) => Math.hypot(cx - hub.x, cy - hub.y))) * SWAY_MARGIN;
		}
		/**
		* Each bundle is drawn zoomed by this much about its own hub.
		*
		* It began as a fix for a seam: rotating a *rasterised* layer swings its far
		* edge inward and shows the empty corner it came from. Redrawing the geometry
		* every frame cannot produce that seam, so nothing here needs it any more —
		* but the zoom had been in the shipped look for long enough to be the look,
		* and dropping it pulls the whole network 18% smaller. Kept deliberately, as
		* composition rather than as a workaround.
		*/
		function frame(hub) {
			const f = (n) => +n.toFixed(2);
			return [
				f(hub.x - hub.x / OVERSCAN),
				f(hub.y - hub.y / OVERSCAN),
				f(W / OVERSCAN),
				f(H / OVERSCAN)
			].join(" ");
		}
		/**
		* The three weights, in draw order. Grouping by weight rather than by angle is
		* what makes a bundle three stroke calls instead of thirty-two.
		*/
		const TIERS = [
			{
				key: "principal",
				cssVar: "--ink",
				width: 1,
				alpha: .26
			},
			{
				key: "half",
				cssVar: "--verdigris",
				width: .7,
				alpha: .2
			},
			{
				key: "quarter",
				cssVar: "--rubric",
				width: .7,
				alpha: .15
			}
		];
		const bundles = hubs.map((hub) => {
			const r = reach(hub);
			const tiers = TIERS.map((t) => ({
				...t,
				segs: []
			}));
			const byKey = {
				principal: tiers[0],
				half: tiers[1],
				quarter: tiers[2]
			};
			for (let i = 0; i < 32; i++) {
				const deg = i * 11.25;
				const rad = deg * Math.PI / 180;
				byKey[deg % 90 === 0 ? "principal" : deg % 45 === 0 ? "half" : "quarter"].segs.push({
					x1: hub.x,
					y1: hub.y,
					x2: +(hub.x + r * Math.sin(rad)).toFixed(1),
					y2: +(hub.y - r * Math.cos(rad)).toFixed(1)
				});
			}
			return {
				hub,
				tiers,
				viewBox: frame(hub)
			};
		});
		/**
		* The network is redrawn into one canvas, and that is the whole trick.
		*
		* Four attempts got here, and the three failures are worth recording because
		* the standard advice caused two of them.
		*
		* A reactive `angles` array assigned inside the frame loop invalidated the
		* component every frame, so Vue re-rendered and diffed ninety-six `<line>`
		* vnodes sixty times a second.
		*
		* `will-change: transform` on each `<g>` was worse. Inside an SVG a layer is
		* sized from the element's *geometry* bounding box, and lines radiating from a
		* hub cover several times the artwork, so three layers came to 92 megapixels.
		*
		* Moving the hint to the `<svg>` — a replaced element, so its layer is its CSS
		* box — got that down to 28 device megapixels across three layers. Still 5.6x
		* the viewport, ~112MB of texture for a background of hairlines, and paid
		* again on every re-raster as the hero scrolled. Dropping the promotion traded
		* that for a full repaint of the hero on every frame of the sway instead:
		* measured under a driven cursor, 475 paints and 618 raster tasks a second.
		*
		* The mistake common to all three is treating this as a *transform* problem.
		* It is not: the artwork is ninety-six hairlines, and the reason moving it is
		* expensive is that the renderer is obliged to keep a pixel-exact copy of a
		* five-megapixel vector scene on either side of the move. Redraw it instead
		* and there is nothing to preserve — a clear and nine stroke calls, into a
		* single buffer the size of the hero and no larger. No layout, no display list
		* to rebuild, no layer tree to recommit, and no texture held open while idle.
		*
		* The earlier note here dismissed canvas as "re-stroking ninety-six lines over
		* ~8 megapixels every frame". That conflated the size of the buffer with the
		* pixels a stroke actually touches: hairlines cover a thousandth of it, and
		* the clear is a fill the GPU does not feel.
		*/
		const root = ref(null);
		ref(null);
		ref(null);
		/**
		* Swapped on at mount, which drops the server-rendered SVG fallback and puts
		* the canvas in its place. Vue flushes that DOM change on a microtask and the
		* first draw happens in the same task, so both land before the browser paints
		* and the exchange is never visible. With JS off the fallback simply stays.
		*/
		const live = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_CompassRose = CompassRose_default;
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "root",
				ref: root
			}, _attrs))}>`);
			if (!live.value) {
				_push(`<!--[-->`);
				ssrRenderList(unref(bundles), (bundle, b) => {
					_push(`<svg class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100"${ssrRenderAttr("viewBox", bundle.viewBox)} preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><!--[-->`);
					ssrRenderList(bundle.tiers, (tier) => {
						_push(`<g${ssrRenderAttr("stroke", `var(${tier.cssVar})`)}><!--[-->`);
						ssrRenderList(tier.segs, (seg, s) => {
							_push(`<line${ssrRenderAttr("x1", seg.x1)}${ssrRenderAttr("y1", seg.y1)}${ssrRenderAttr("x2", seg.x2)}${ssrRenderAttr("y2", seg.y2)}${ssrRenderAttr("stroke-width", tier.width)}${ssrRenderAttr("opacity", tier.alpha)}></line>`);
						});
						_push(`<!--]--></g>`);
					});
					_push(`<!--]-->`);
					if (b > 0) _push(`<circle${ssrRenderAttr("cx", bundle.hub.x)}${ssrRenderAttr("cy", bundle.hub.y)} r="46" stroke="var(--ink)" stroke-width="0.8" opacity="0.24"></circle>`);
					else _push(ssrRenderComponent(_component_CompassRose, {
						x: bundle.hub.x - ROSE,
						y: bundle.hub.y - ROSE,
						width: 208,
						height: 208,
						class: "text-ink",
						style: { "opacity": "0.3" }
					}, null, _parent));
					_push(`</svg>`);
				});
				_push(`<!--]-->`);
			} else {
				_push(`<!--[--><canvas class="absolute inset-0 h-full w-full opacity-45 sm:opacity-100" aria-hidden="true"></canvas><div class="absolute opacity-[0.135] will-change-transform sm:opacity-30" aria-hidden="true">`);
				_push(ssrRenderComponent(_component_CompassRose, { class: "h-full w-full text-ink" }, null, _parent));
				_push(`</div><!--]-->`);
			}
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/RhumbLines.vue
var _sfc_setup$11 = RhumbLines_vue_vue_type_script_setup_true_lang_default.setup;
RhumbLines_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RhumbLines.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var RhumbLines_default = Object.assign(RhumbLines_vue_vue_type_script_setup_true_lang_default, { __name: "RhumbLines" });
//#endregion
//#region node_modules/nuxt/dist/app/components/server-placeholder.js
var ServerPlaceholder = defineComponent({
	name: "ServerPlaceholder",
	render() {
		return createElementBlock("div");
	}
});
//#endregion
//#region app/components/PlaceCard.vue?vue&type=script&setup=true&lang.ts
var PlaceCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PlaceCard",
	__ssrInlineRender: true,
	props: {
		place: {},
		clickable: { type: Boolean }
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		/**
		* A place, rendered the way the Parchment app renders one.
		*
		* Not a port. The app's PlaceCard is 295 lines wired into vue-i18n, a place
		* service, a theme store and two internal primitives, none of which exist
		* here. This is a reimplementation of its *shape* against the same scale
		* table (components/ui/item-row/scale.ts): circle icon, semibold title, and
		* detail lines a step down, on a lit card at the app's radius.
		*
		* It takes the API response verbatim, which is the point of showing it in the
		* demo. What you see is what /search returns.
		*/
		const props = __props;
		const emit = __emit;
		/**
		* `amenity/cafe` reads as a database row, not a label. The app resolves these
		* through i18n; here the tail of the pair is close enough and stays honest
		* about what the API returned.
		*/
		const placeType = computed(() => {
			const raw = props.place.categories?.[0];
			if (!raw) return null;
			return (raw.split("/").pop() ?? raw).replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
		});
		const street = computed(() => {
			const a = props.place.address;
			if (!a?.street) return null;
			return [a.housenumber, a.street].filter(Boolean).join(" ");
		});
		const distance = computed(() => {
			const m = props.place.distance_m;
			if (m == null) return null;
			return m < 1e3 ? `${Math.round(m)} m` : `${(m / 1e3).toFixed(1)} km`;
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.clickable ? "button" : "article"), mergeProps({
				type: __props.clickable ? "button" : void 0,
				class: ["depth flex w-full items-start gap-2.5 rounded-lg border border-rule bg-paper px-2.5 py-2 text-left transition-colors", __props.clickable ? "cursor-pointer hover:border-ink-soft hover:bg-paper-aged" : ""],
				onClick: ($event) => __props.clickable && emit("select", __props.place)
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"${_scopeId}>`);
						_push(ssrRenderComponent(unref(MapPin), {
							class: "size-4",
							"stroke-width": "1.5"
						}, null, _parent, _scopeId));
						_push(`</span><div class="min-w-0 flex-1"${_scopeId}><h4 class="truncate text-sm font-semibold text-ink"${_scopeId}>${ssrInterpolate(__props.place.name)}</h4><p class="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-soft"${_scopeId}>`);
						if (placeType.value) _push(`<span${_scopeId}>${ssrInterpolate(placeType.value)}</span>`);
						else _push(`<!---->`);
						if (placeType.value && distance.value) _push(`<span class="text-ink-faint"${_scopeId}>·</span>`);
						else _push(`<!---->`);
						if (distance.value) _push(`<span class="tabular-nums"${_scopeId}>${ssrInterpolate(distance.value)}</span>`);
						else _push(`<!---->`);
						_push(`</p>`);
						if (street.value) _push(`<p class="mt-0.5 truncate text-xs text-ink-soft"${_scopeId}>${ssrInterpolate(street.value)}</p>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("span", { class: "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand" }, [createVNode(unref(MapPin), {
						class: "size-4",
						"stroke-width": "1.5"
					})]), createVNode("div", { class: "min-w-0 flex-1" }, [
						createVNode("h4", { class: "truncate text-sm font-semibold text-ink" }, toDisplayString(__props.place.name), 1),
						createVNode("p", { class: "mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-soft" }, [
							placeType.value ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(placeType.value), 1)) : createCommentVNode("", true),
							placeType.value && distance.value ? (openBlock(), createBlock("span", {
								key: 1,
								class: "text-ink-faint"
							}, "·")) : createCommentVNode("", true),
							distance.value ? (openBlock(), createBlock("span", {
								key: 2,
								class: "tabular-nums"
							}, toDisplayString(distance.value), 1)) : createCommentVNode("", true)
						]),
						street.value ? (openBlock(), createBlock("p", {
							key: 0,
							class: "mt-0.5 truncate text-xs text-ink-soft"
						}, toDisplayString(street.value), 1)) : createCommentVNode("", true)
					])];
				}),
				_: 1
			}), _parent);
		};
	}
});
//#endregion
//#region app/components/PlaceCard.vue
var _sfc_setup$10 = PlaceCard_vue_vue_type_script_setup_true_lang_default.setup;
PlaceCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlaceCard.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var PlaceCard_default = Object.assign(PlaceCard_vue_vue_type_script_setup_true_lang_default, { __name: "PlaceCard" });
//#endregion
//#region app/components/DemoWidget.vue?vue&type=script&setup=true&lang.ts
var control = "rounded-md border border-rule-strong bg-paper px-2 py-1 text-fine text-ink transition-colors hover:border-ink-soft focus:outline-none focus-visible:outline-2 focus-visible:outline-rubric";
var DemoWidget_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "DemoWidget",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The hero demo. Type in it, drag the pin, click a result.
		*
		* Everything goes through /api/demo/<group>, which fixes the endpoint and the
		* request shape server-side and validates every value it accepts. Nothing here
		* can widen that surface by editing the page, which is what keeps an
		* interactive demo from being a free API console.
		*
		* The curl sample is generated from the same state that drives the fetch, so
		* what you read is what was sent. Two sources would drift within a week.
		*/
		const PLACES = [
			{
				id: "times-square",
				label: "Times Square",
				lat: 40.758,
				lng: -73.9855
			},
			{
				id: "brooklyn-bridge",
				label: "Brooklyn Bridge",
				lat: 40.7061,
				lng: -73.9969
			},
			{
				id: "central-park",
				label: "Central Park",
				lat: 40.7812,
				lng: -73.9665
			},
			{
				id: "jfk-airport",
				label: "JFK Airport",
				lat: 40.6413,
				lng: -73.7781
			}
		];
		const MODES = [
			"foot",
			"bike",
			"car"
		];
		const MINUTES = [
			5,
			10,
			15,
			20
		];
		const tabs = [
			{
				id: "search",
				label: "Search"
			},
			{
				id: "geocode",
				label: "Geocode"
			},
			{
				id: "spatial",
				label: "Spatial"
			},
			{
				id: "isochrone",
				label: "Isochrones"
			},
			{
				id: "tiles",
				label: "Tiles"
			}
		];
		const active = ref("search");
		const query = ref("coffee");
		const place = ref("times-square");
		const mode = ref("foot");
		const minutes = ref(10);
		/** Spatial reads in two directions: what contains the point, and what it holds. */
		const direction = ref("parents");
		/** The area whose children are being listed, picked from the parents list. */
		const parent = ref(null);
		/** A place opened from a search result. */
		const detail = ref(null);
		const dragged = ref(null);
		const preset = computed(() => PLACES.find((p) => p.id === place.value) ?? PLACES[0]);
		const origin = computed(() => dragged.value ?? preset.value);
		function onMarkerMove(lat, lng) {
			dragged.value = {
				lat: Math.round(lat * 1e4) / 1e4,
				lng: Math.round(lng * 1e4) / 1e4
			};
		}
		const state = ref({ status: "loading" });
		const copied = ref(false);
		/** Which endpoint the current view actually calls. */
		const group = computed(() => {
			if (detail.value) return "place";
			if (active.value === "spatial") return direction.value;
			return active.value;
		});
		const request = computed(() => {
			const { lat, lng } = origin.value;
			const auth = "  -H \"Authorization: Bearer brm_live_...\"";
			const base = "https://api.barrelman.dev";
			switch (group.value) {
				case "place": return `curl "${base}/place/${detail.value?.id}" \\\n${auth}`;
				case "search": return `curl "${base}/search" \\\n${auth} \\\n  -d '{"query":"${query.value || "coffee"}","lat":${lat},"lng":${lng}}'`;
				case "geocode": return `curl "${base}/geocode/reverse\\\n?lat=${lat}&lng=${lng}" \\\n${auth}`;
				case "parents": return `curl "${base}/contains?lat=${lat}&lng=${lng}" \\\n${auth}`;
				case "children": return `curl "${base}/children?id=${parent.value?.id ?? "…"}" \\\n${auth}`;
				case "isochrone": return `curl "${base}/isochrone?lat=${lat}&lng=${lng}\\\n&mode=${mode.value}&durations=${minutes.value * 60}" \\\n${auth}`;
				default: return `map.addSource("barrelman", {\n  type: "vector",\n  tiles: [\n    "${base}/tiles/parchment_roads/" +\n    "{z}/{x}/{y}?api_key=brm_live_..."\n  ]\n})`;
			}
		});
		const caption = computed(() => {
			switch (group.value) {
				case "place": return "One place, by OSM id.";
				case "search": return "Ranked by text match and distance. Pick one to look it up.";
				case "geocode": return "Every area containing the point, smallest first.";
				case "parents": return "Areas containing the pin. Pick one to look inside it.";
				case "children": return `Inside ${parent.value?.name ?? "the area"}.`;
				case "isochrone": return "Reachable area, drawn from the GeoJSON polygon.";
				default: return "Vector tiles straight out of PostGIS.";
			}
		});
		/** Groups whose response is a list of places, rendered as cards. */
		const CARD_GROUPS = /* @__PURE__ */ new Set([
			"search",
			"geocode",
			"parents",
			"children"
		]);
		const places = computed(() => {
			const s = state.value;
			if (s.status !== "ok" || !CARD_GROUPS.has(group.value)) return [];
			return Array.isArray(s.body) ? s.body : [];
		});
		/** The opened place, once its own record comes back. */
		const detailPlace = computed(() => {
			const s = state.value;
			if (group.value !== "place") return null;
			return s.status === "ok" ? s.body ?? detail.value : detail.value;
		});
		/**
		* The isochrone response already carries a FeatureCollection under
		* `isochrones`, so it goes straight to MapLibre. Shape-checked rather than
		* assumed: a response change should mean "no overlay", not a throw.
		*/
		const overlay = computed(() => {
			const s = state.value;
			if (active.value !== "isochrone" || s.status !== "ok") return void 0;
			const iso = s.body?.isochrones;
			return iso?.type === "FeatureCollection" && iso.features?.length ? iso : void 0;
		});
		/**
		* Isochrones are a shape on a map, so the map takes the whole panel and the
		* request sits above it. Splitting the panel gave the polygon a third of the
		* width and raw JSON two thirds, which is backwards for the one endpoint whose
		* answer is a picture.
		*/
		const mapOnly = computed(() => active.value === "isochrone");
		const mapIsOutput = computed(() => active.value === "tiles");
		const pinnable = computed(() => !detail.value && ["geocode", "spatial"].includes(active.value));
		/** The whole response. The pane scrolls, so there is nothing to protect. */
		const body = computed(() => {
			const s = state.value;
			return s.status === "ok" ? JSON.stringify(s.body, null, 2) : "";
		});
		let seq = 0;
		async function load() {
			const g = group.value;
			if (g === "tiles") return;
			if (g === "children" && !parent.value) return;
			const mine = ++seq;
			state.value = { status: "loading" };
			try {
				const params = { place: place.value };
				if (dragged.value) {
					params.lat = String(dragged.value.lat);
					params.lng = String(dragged.value.lng);
				}
				if (g === "search") params.q = query.value || "coffee";
				if (g === "isochrone") {
					params.mode = mode.value;
					params.minutes = String(minutes.value);
				}
				if (g === "children") params.id = parent.value.id;
				if (g === "place") params.id = detail.value.id;
				const data = await $fetch$1(`/api/demo/${g}`, { params });
				if (mine === seq) state.value = {
					status: "ok",
					body: data
				};
			} catch {
				if (mine === seq) state.value = {
					status: "error",
					message: "Live response unavailable right now."
				};
			}
		}
		let debounce;
		function loadSoon(delay = 350) {
			clearTimeout(debounce);
			debounce = setTimeout(load, delay);
		}
		function onSelect(p) {
			if (active.value === "search") detail.value = p;
			else if (active.value === "spatial" && direction.value === "parents") {
				parent.value = p;
				direction.value = "children";
			}
		}
		const canGoBack = computed(() => !!detail.value || direction.value === "children");
		watch([
			active,
			direction,
			detail,
			parent
		], () => load());
		watch(place, () => (dragged.value = null, loadSoon(0)));
		watch([
			mode,
			minutes,
			dragged
		], () => loadSoon(0));
		watch(query, () => loadSoon());
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoMap = ServerPlaceholder;
			const _component_PlaceCard = PlaceCard_default;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="relative z-10 -mb-px flex items-end gap-1 overflow-x-auto pl-5"><!--[-->`);
			ssrRenderList(tabs, (tab) => {
				_push(`<button class="${ssrRenderClass([active.value === tab.id ? "border-b-0 border-rule-strong bg-paper-aged pt-2 text-ink" : "border-rule bg-paper-deep/60 pt-1.5 text-ink-soft hover:bg-paper-deep hover:text-ink", "shrink-0 rounded-t-md border px-4 pb-2 font-mono text-fine transition-colors"])}"${ssrRenderAttr("aria-pressed", active.value === tab.id)}>${ssrInterpolate(tab.label)}</button>`);
			});
			_push(`<!--]--></div><div class="depth overflow-hidden rounded-lg border border-rule-strong bg-paper-aged"><div class="flex h-[46px] items-center gap-2 overflow-x-auto border-b border-rule px-4">`);
			if (canGoBack.value) {
				_push(`<button class="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-fine text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink">`);
				_push(ssrRenderComponent(unref(ArrowLeft), {
					class: "size-3.5",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(` Back </button>`);
			} else _push(`<!---->`);
			if (active.value === "search" && !detail.value) {
				_push(`<div class="relative min-w-0 flex-1">`);
				_push(ssrRenderComponent(unref(Search), {
					class: "pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(`<input${ssrRenderAttr("value", query.value)} type="text" maxlength="48" spellcheck="false" aria-label="Search query" placeholder="coffee" class="${ssrRenderClass([control, "w-full !pl-8"])}"></div>`);
			} else _push(`<!---->`);
			if (active.value === "isochrone") {
				_push(`<!--[--><select aria-label="Travel mode" class="${ssrRenderClass(control)}"><!--[-->`);
				ssrRenderList(MODES, (m) => {
					_push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(mode.value) ? ssrLooseContain(mode.value, m) : ssrLooseEqual(mode.value, m)) ? " selected" : ""}>${ssrInterpolate(m)}</option>`);
				});
				_push(`<!--]--></select><select aria-label="Minutes" class="${ssrRenderClass(control)}"><!--[-->`);
				ssrRenderList(MINUTES, (m) => {
					_push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(minutes.value) ? ssrLooseContain(minutes.value, m) : ssrLooseEqual(minutes.value, m)) ? " selected" : ""}>${ssrInterpolate(m)} min</option>`);
				});
				_push(`<!--]--></select><!--]-->`);
			} else _push(`<!---->`);
			if (active.value !== "tiles" && !detail.value) {
				_push(`<select aria-label="Origin" class="${ssrRenderClass([control, "ml-auto"])}"><!--[-->`);
				ssrRenderList(PLACES, (p) => {
					_push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(place.value) ? ssrLooseContain(place.value, p.id) : ssrLooseEqual(place.value, p.id)) ? " selected" : ""}>${ssrInterpolate(p.label)}</option>`);
				});
				_push(`<!--]--></select>`);
			} else _push(`<!---->`);
			_push(`<button class="${ssrRenderClass([active.value === "tiles" || detail.value ? "ml-auto" : "", "shrink-0 p-1 text-ink-soft transition-colors hover:text-ink"])}"${ssrRenderAttr("aria-label", copied.value ? "Copied" : "Copy request")}>`);
			if (copied.value) _push(ssrRenderComponent(unref(Check), {
				class: "size-3.5 text-verdigris",
				"stroke-width": "1.5"
			}, null, _parent));
			else _push(ssrRenderComponent(unref(Copy), {
				class: "size-3.5",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</button></div><div class="h-[360px] overflow-hidden">`);
			if (mapOnly.value) {
				_push(`<div class="flex h-full flex-col"><pre class="ruled overflow-x-auto border-b border-rule px-5 font-mono text-[12px] leading-[22px] text-ink" style="${ssrRenderStyle({
					"padding-top": "14px",
					"padding-bottom": "14px",
					"background-position": "0 14px"
				})}"><code>${ssrInterpolate(request.value)}</code></pre><div class="flex min-h-0 flex-1 flex-col p-3">`);
				_push(ssrRenderComponent(_component_DemoMap, {
					lat: origin.value.lat,
					lng: origin.value.lng,
					overlay: overlay.value,
					draggable: "",
					class: "min-h-0 flex-1",
					onMove: onMarkerMove
				}, null, _parent));
				_push(`<p class="caption mt-1.5">${ssrInterpolate(caption.value)} Drag the pin. <span class="font-mono">${ssrInterpolate(origin.value.lat)}, ${ssrInterpolate(origin.value.lng)}</span></p></div></div>`);
			} else {
				_push(`<div class="grid h-full md:grid-cols-2"><div class="flex flex-col overflow-y-auto border-b border-rubric/30 md:border-b-0 md:border-r"><pre class="ruled overflow-x-auto px-5 font-mono text-[12px] leading-[22px] text-ink" style="${ssrRenderStyle({
					"padding-top": "14px",
					"padding-bottom": "14px",
					"background-position": "0 14px"
				})}"><code>${ssrInterpolate(request.value)}</code></pre>`);
				if (pinnable.value) {
					_push(`<div class="flex min-h-0 flex-1 flex-col border-t border-rule px-4 pb-3 pt-3">`);
					_push(ssrRenderComponent(_component_DemoMap, {
						lat: origin.value.lat,
						lng: origin.value.lng,
						draggable: "",
						class: "min-h-[120px] flex-1",
						onMove: onMarkerMove
					}, null, _parent));
					_push(`<p class="caption mt-1.5"> Drag the pin. <span class="font-mono">${ssrInterpolate(origin.value.lat)}, ${ssrInterpolate(origin.value.lng)}</span></p></div>`);
				} else _push(`<!---->`);
				_push(`</div><div class="flex flex-col overflow-y-auto px-5 py-3.5"><p class="caption mb-2">${ssrInterpolate(caption.value)}</p>`);
				if (mapIsOutput.value) _push(ssrRenderComponent(_component_DemoMap, {
					lat: origin.value.lat,
					lng: origin.value.lng,
					class: "h-[240px] shrink-0"
				}, null, _parent));
				else if (state.value.status === "loading") {
					_push(`<div class="flex items-center gap-2 text-ink-soft">`);
					_push(ssrRenderComponent(unref(Loader), {
						class: "size-3.5 animate-spin",
						"stroke-width": "1.5"
					}, null, _parent));
					_push(`<span class="caption">Calling the API…</span></div>`);
				} else if (state.value.status === "error") _push(`<p class="caption">${ssrInterpolate(state.value.message)}</p>`);
				else if (detailPlace.value) {
					_push(`<div class="flex flex-col gap-2">`);
					_push(ssrRenderComponent(_component_PlaceCard, { place: detailPlace.value }, null, _parent));
					_push(`<pre class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"><code>${ssrInterpolate(body.value)}</code></pre></div>`);
				} else if (places.value.length) {
					_push(`<div class="flex flex-col gap-1.5"><!--[-->`);
					ssrRenderList(places.value, (p) => {
						_push(ssrRenderComponent(_component_PlaceCard, {
							key: p.id,
							place: p,
							clickable: active.value === "search" || active.value === "spatial" && direction.value === "parents",
							onSelect
						}, null, _parent));
					});
					_push(`<!--]--></div>`);
				} else if (!body.value || body.value === "[]") _push(`<p class="caption">Nothing here.</p>`);
				else _push(`<pre class="overflow-x-auto font-mono text-[12px] leading-[22px] text-ink-soft"><code>${ssrInterpolate(body.value)}</code></pre>`);
				_push(`</div></div>`);
			}
			_push(`</div></div></div>`);
		};
	}
});
//#endregion
//#region app/components/DemoWidget.vue
var _sfc_setup$9 = DemoWidget_vue_vue_type_script_setup_true_lang_default.setup;
DemoWidget_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DemoWidget.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var DemoWidget_default = Object.assign(DemoWidget_vue_vue_type_script_setup_true_lang_default, { __name: "DemoWidget" });
//#endregion
//#region node_modules/@vueuse/shared/index.mjs
function tryOnScopeDispose(fn) {
	if (getCurrentScope()) {
		onScopeDispose(fn);
		return true;
	}
	return false;
}
var localProvidedStateMap = /* @__PURE__ */ new WeakMap();
var injectLocal = /* @__NO_SIDE_EFFECTS__ */ (...args) => {
	var _a;
	const key = args[0];
	const instance = (_a = getCurrentInstance()) == null ? void 0 : _a.proxy;
	if (instance == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
	if (instance && localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance)) return localProvidedStateMap.get(instance)[key];
	return inject(...args);
};
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
function pxValue(px) {
	return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
//#endregion
//#region node_modules/@vueuse/core/index.mjs
var defaultWindow = void 0;
function unrefElement(elRef) {
	var _a;
	const plain = toValue(elRef);
	return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
	const cleanups = [];
	const cleanup = () => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
	};
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	const stopWatch = watchImmediate(() => {
		var _a, _b;
		return [
			(_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options]) => {
		cleanup();
		if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		cleanups.push(...raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone)))));
	}, { flush: "post" });
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(cleanup);
	return stop;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
	const isMounted = shallowRef(false);
	if (getCurrentInstance()) ;
	return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
	const isMounted = /* @__PURE__ */ useMounted();
	return computed(() => {
		isMounted.value;
		return Boolean(callback());
	});
}
var ssrWidthSymbol = Symbol("vueuse-ssr-width");
// @__NO_SIDE_EFFECTS__
function useSSRWidth() {
	const ssrWidth = hasInjectionContext() ? /* @__PURE__ */ injectLocal(ssrWidthSymbol, null) : null;
	return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
function useMediaQuery(query, options = {}) {
	const { window = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
	const ssrSupport = shallowRef(typeof ssrWidth === "number");
	const mediaQuery = shallowRef();
	const matches = shallowRef(false);
	const handler = (event) => {
		matches.value = event.matches;
	};
	watchEffect(() => {
		if (ssrSupport.value) {
			ssrSupport.value = !isSupported.value;
			const queryStrings = toValue(query).split(",");
			matches.value = queryStrings.some((queryString) => {
				const not = queryString.includes("not all");
				const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				let res = Boolean(minWidth || maxWidth);
				if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
				if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
				return not ? !res : res;
			});
			return;
		}
		if (!isSupported.value) return;
		mediaQuery.value = window.matchMedia(toValue(query));
		matches.value = mediaQuery.value.matches;
	});
	useEventListener(mediaQuery, "change", handler, { passive: true });
	return computed(() => matches.value);
}
// @__NO_SIDE_EFFECTS__
function usePreferredReducedMotion(options) {
	const isReduced = useMediaQuery("(prefers-reduced-motion: reduce)", options);
	return computed(() => {
		if (isReduced.value) return "reduce";
		return "no-preference";
	});
}
//#endregion
//#region app/components/SiteHero.vue?vue&type=script&setup=true&lang.ts
var SiteHero_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SiteHero",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Hero.
		*
		* Parchment leads with a rendered globe; this leads with a chart and a request
		* on it, because the audience is someone deciding whether to spend an
		* afternoon integrating. The rose sits behind the title rather than beside it —
		* on a real chart the rose is *under* the lettering, and letting the type
		* cross it is what makes the sheet feel drawn rather than assembled.
		*/
		const { public: config } = useRuntimeConfig();
		/**
		* v-motion animates inline styles from JS, so the reduced-motion media query
		* in the stylesheet cannot reach it — the variants have to be withheld here
		* instead. Passing no variants leaves the element in its natural state, which
		* is visible, so nothing is stranded at `opacity: 0`.
		*/
		const reducedMotion = /* @__PURE__ */ usePreferredReducedMotion();
		/**
		* The most recent shipped endpoint, for the announcement chip.
		*
		* Hand-maintained. Nothing generates release notes yet, so this is the one
		* place on the site that goes stale on its own: update it when something
		* ships, and delete the chip rather than leave a six-month-old "New" on it.
		*/
		const latest = {
			title: "Reverse geocoding: every place at a coordinate",
			href: `${config.docsUrl}#tag/geocoding`
		};
		const fadeUp = (delay) => reducedMotion.value === "reduce" ? {} : {
			initial: {
				opacity: 0,
				y: 18
			},
			enter: {
				opacity: 1,
				y: 0,
				transition: {
					duration: .7,
					delay
				}
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RhumbLines = RhumbLines_default;
			const _component_DemoWidget = DemoWidget_default;
			const _directive_motion = resolveDirective("motion");
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "top",
				class: "band overflow-hidden pt-32 sm:pt-36"
			}, _attrs))}><div class="pointer-events-none absolute inset-0 z-0"><div class="graticule absolute inset-0 opacity-70"></div>`);
			_push(ssrRenderComponent(_component_RhumbLines, { class: "absolute inset-0 h-full w-full" }, null, _parent));
			_push(`<div class="absolute inset-0" style="${ssrRenderStyle({ "background": "radial-gradient(\n            ellipse 58% 42% at 50% 32%,\n            rgba(255, 249, 243, 0.88) 0%,\n            rgba(255, 249, 243, 0.74) 34%,\n            rgba(255, 249, 243, 0.38) 62%,\n            transparent 88%\n          )" })}"></div></div><div class="measure relative z-10"><div${ssrRenderAttrs(mergeProps(fadeUp(0), { class: "flex justify-center" }, ssrGetDirectiveProps(_ctx, _directive_motion)))}><a${ssrRenderAttr("href", latest.href)} class="depth group inline-flex max-w-full items-center gap-2.5 rounded-full border border-rule-strong bg-paper/75 py-1 pl-1 pr-3 backdrop-blur-sm transition-all duration-150 hover:border-ink-soft hover:bg-paper-aged"><span class="legend rounded-full bg-rubric/10 px-2 py-1 text-rubric">New</span><span class="truncate text-caption text-ink-soft transition-colors group-hover:text-ink">${ssrInterpolate(latest.title)}</span>`);
			_push(ssrRenderComponent(unref(ArrowRight), {
				class: "size-3.5 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-ink-soft",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</a></div><h1${ssrRenderAttrs(mergeProps(fadeUp(.08), { class: "display mx-auto mt-7 max-w-4xl text-balance text-center text-[clamp(2.2rem,5.2vw,3.9rem)] text-ink" }, ssrGetDirectiveProps(_ctx, _directive_motion)))}> From coordinates to <span class="text-brand">shipped features</span></h1><p${ssrRenderAttrs(mergeProps(fadeUp(.16), { class: "mx-auto mt-7 max-w-2xl text-center text-lead leading-relaxed text-ink-soft" }, ssrGetDirectiveProps(_ctx, _directive_motion)))}> A geospatial data API for search, geocoding, vector tiles, routing, isochrones and live transit. Open data, open standards, open source. </p><div${ssrRenderAttrs(mergeProps(fadeUp(.24), { class: "mt-9 flex flex-wrap items-center justify-center gap-3" }, ssrGetDirectiveProps(_ctx, _directive_motion)))}><a${ssrRenderAttr("href", unref(config).consoleUrl)} class="btn-ink group max-sm:w-full"> Start free `);
			_push(ssrRenderComponent(unref(ArrowRight), {
				class: "size-4 transition-transform group-hover:translate-x-0.5",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</a><a${ssrRenderAttr("href", unref(config).docsUrl)} class="btn-rule max-sm:w-full">`);
			_push(ssrRenderComponent(unref(BookOpen), {
				class: "size-4",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(` Read the docs </a></div><div${ssrRenderAttrs(mergeProps(fadeUp(.38), { class: "mx-auto mt-14 max-w-3xl" }, ssrGetDirectiveProps(_ctx, _directive_motion)))}>`);
			_push(ssrRenderComponent(_component_DemoWidget, null, null, _parent));
			_push(`</div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/SiteHero.vue
var _sfc_setup$8 = SiteHero_vue_vue_type_script_setup_true_lang_default.setup;
SiteHero_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteHero.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var SiteHero_default = Object.assign(SiteHero_vue_vue_type_script_setup_true_lang_default, { __name: "SiteHero" });
//#endregion
//#region app/components/SectionHead.vue?vue&type=script&setup=true&lang.ts
var SectionHead_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SectionHead",
	__ssrInlineRender: true,
	props: {
		label: {},
		title: {},
		measure: {}
	},
	setup(__props) {
		/**
		* The heading block every section opens with, kept in one place so the three
		* of them can't drift apart: engraved legend label, a ruled fleuron, the
		* title in Exposure, and the lede.
		*/
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: __props.measure ?? "max-w-2xl" }, _attrs))}><p class="eyebrow">${ssrInterpolate(__props.label)}</p><div class="fleuron mt-3 max-w-24"><span class="size-1.5 rotate-45 bg-rule-strong"></span></div><h2 class="display mt-5 text-balance text-[clamp(1.9rem,3.6vw,2.9rem)] text-ink">${ssrInterpolate(__props.title)}</h2>`);
			if (_ctx.$slots.default) {
				_push(`<p class="mt-4 text-lead leading-relaxed text-ink-soft">`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</p>`);
			} else _push(`<!---->`);
			_push(`</header>`);
		};
	}
});
//#endregion
//#region app/components/SectionHead.vue
var _sfc_setup$7 = SectionHead_vue_vue_type_script_setup_true_lang_default.setup;
SectionHead_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SectionHead.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var SectionHead_default = Object.assign(SectionHead_vue_vue_type_script_setup_true_lang_default, { __name: "SectionHead" });
//#endregion
//#region app/components/CapabilityGrid.vue?vue&type=script&setup=true&lang.ts
var CapabilityGrid_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "CapabilityGrid",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The endpoint groups.
		*
		* Drawn as a chart legend: one table on bare paper, no cards, no gaps.
		*
		* The per-group credit cost used to sit in a gutter here as a depth sounding.
		* It is gone — this section answers "what does it do", and the pricing table
		* two sections down answers "what does it cost". Splitting them also removes
		* the one place on the page that duplicated CREDIT_COSTS from barrelman's
		* src/billing/plans.ts and could silently drift out of date.
		*
		* Rows are shaded in alternation rather than ruled. With the sounding column
		* gone there is no gutter holding the eye to the left edge, and a stripe tracks
		* a long blurb back to its name better than a hairline between rows does.
		*/
		const groups = [
			{
				icon: Search,
				name: "Search",
				blurb: "Full-text, trigram, abbreviation and semantic layers over 20M+ named places. Fast enough for autocomplete."
			},
			{
				icon: MapPin,
				name: "Geocoding",
				blurb: "Forward and reverse, with the full admin hierarchy attached to every result."
			},
			{
				icon: Layers,
				name: "Vector tiles",
				blurb: "POIs, roads, buildings, water and boundaries as MVT, straight out of PostGIS. Style them yourself."
			},
			{
				icon: Navigation,
				name: "Routing",
				blurb: "Turn-by-turn for car, bike and foot. Custom vehicle profiles and elevation included."
			},
			{
				icon: Waypoints,
				name: "Transit",
				blurb: "Multimodal trip planning over GTFS, with GTFS-RT positions and live departures."
			},
			{
				icon: Clock,
				name: "Isochrones",
				blurb: "Reachability polygons for any mode and duration. Where can you get in fifteen minutes?"
			},
			{
				icon: Shapes,
				name: "Spatial",
				blurb: "Point-in-polygon and children-of-an-area queries against real OSM geometry."
			},
			{
				icon: Bike,
				name: "Shared mobility",
				blurb: "GBFS systems, stations and live availability, folded into trip planning."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_SectionHead = SectionHead_default;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "capabilities",
				class: "band border-t border-rule"
			}, _attrs))}><div class="hatch pointer-events-none absolute inset-0 z-0 opacity-25"></div><div class="measure relative z-10">`);
			_push(ssrRenderComponent(_component_SectionHead, {
				label: "Capabilities",
				title: "The map stack you were going to build"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Barrelman provides the core mapping APIs behind modern geospatial applications. We created the infrastructure we wished already existed, so you don&#39;t have to. `);
					else return [createTextVNode(" Barrelman provides the core mapping APIs behind modern geospatial applications. We created the infrastructure we wished already existed, so you don't have to. ")];
				}),
				_: 1
			}, _parent));
			_push(`<dl class="depth mt-12 overflow-hidden rounded-lg border border-rule-strong bg-paper"><!--[-->`);
			ssrRenderList(groups, (group) => {
				_push(`<div class="grid items-baseline gap-x-4 px-5 py-4 odd:bg-paper-aged sm:grid-cols-[11rem_1fr] sm:gap-x-6 sm:py-3.5"><dt class="flex items-baseline gap-2.5 font-medium tracking-tight text-ink">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(group.icon), {
					class: "size-4 shrink-0 translate-y-0.5 text-ink-soft",
					"stroke-width": "1.5"
				}, null), _parent);
				_push(` ${ssrInterpolate(group.name)}</dt><dd class="mt-1.5 text-body leading-relaxed text-ink-soft sm:mt-0">${ssrInterpolate(group.blurb)}</dd></div>`);
			});
			_push(`<!--]--></dl></div></section>`);
		};
	}
});
//#endregion
//#region app/components/CapabilityGrid.vue
var _sfc_setup$6 = CapabilityGrid_vue_vue_type_script_setup_true_lang_default.setup;
CapabilityGrid_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CapabilityGrid.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var CapabilityGrid_default = Object.assign(CapabilityGrid_vue_vue_type_script_setup_true_lang_default, { __name: "CapabilityGrid" });
//#endregion
//#region app/components/OpenStreetMapBand.vue?vue&type=script&setup=true&lang.ts
var OpenStreetMapBand_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "OpenStreetMapBand",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The provenance of the chart: where the data actually comes from.
		*
		* Every endpoint above is only as good as the map underneath it, and that map
		* is OpenStreetMap — surveyed by hand, given freely, owned by no one. This band
		* names the source and says why it is the reason the rest of the page can make
		* the promises it does: global reach, current data, and no basemap to rent.
		*
		* The three figures are set as soundings — the mariner's depth marks — in the
		* same mono/rubric vocabulary the capability legend uses, so they read as
		* measurements taken off the chart rather than marketing numerals.
		*/
		const soundings = [
			{
				icon: Users,
				figure: "10M+",
				label: "Mapmakers",
				body: "A worldwide community keeps it current: survey agencies, cyclists, and locals adding the street they live on."
			},
			{
				icon: Globe,
				figure: "Global",
				label: "Coverage",
				body: "Every country, down to footpaths, building entrances and platform edges. No regions to license around."
			},
			{
				icon: Scale,
				figure: "Open",
				label: "License",
				body: "Free and openly licensed under the ODbL. Your app is never renting the basemap by the view."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_SectionHead = SectionHead_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "band border-t border-rule-strong bg-paper-deep/70" }, _attrs))}><div class="hatch pointer-events-none absolute inset-0 z-0 opacity-70"></div><div class="measure relative z-10">`);
			_push(ssrRenderComponent(_component_SectionHead, {
				label: "Built on OpenStreetMap",
				title: "The whole world, mapped by hand"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Barrelman is built on OpenStreetMap, the free, openly licensed map of the world maintained by a global community. It is why coverage reaches every country, why the data stays current, and why you never rent the basemap. `);
					else return [createTextVNode(" Barrelman is built on OpenStreetMap, the free, openly licensed map of the world maintained by a global community. It is why coverage reaches every country, why the data stays current, and why you never rent the basemap. ")];
				}),
				_: 1
			}, _parent));
			_push(`<dl class="depth mt-12 grid overflow-hidden rounded-lg border border-rule-strong bg-paper sm:grid-cols-3"><!--[-->`);
			ssrRenderList(soundings, (sounding) => {
				_push(`<div class="border-b border-rule p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:p-7 sm:last:border-r-0"><dd class="font-mono text-[1.75rem] leading-none tabular-nums text-rubric">${ssrInterpolate(sounding.figure)}</dd><dt class="mt-3 flex items-center gap-2">`);
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sounding.icon), {
					class: "size-3.5 shrink-0 text-ink-soft",
					"stroke-width": "1.5"
				}, null), _parent);
				_push(`<span class="legend text-ink-soft">${ssrInterpolate(sounding.label)}</span></dt><p class="mt-2.5 text-body leading-relaxed text-ink-soft">${ssrInterpolate(sounding.body)}</p></div>`);
			});
			_push(`<!--]--></dl><div class="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3"><p class="caption"> Map data © OpenStreetMap contributors, under the Open Database License. </p><a href="https://www.openstreetmap.org/about" target="_blank" rel="noopener" class="link group inline-flex items-center gap-1.5 text-sm font-medium text-rubric"> About OpenStreetMap `);
			_push(ssrRenderComponent(unref(ArrowUpRight), {
				class: "size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</a></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/OpenStreetMapBand.vue
var _sfc_setup$5 = OpenStreetMapBand_vue_vue_type_script_setup_true_lang_default.setup;
OpenStreetMapBand_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OpenStreetMapBand.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var OpenStreetMapBand_default = Object.assign(OpenStreetMapBand_vue_vue_type_script_setup_true_lang_default, { __name: "OpenStreetMapBand" });
//#endregion
//#region app/components/PricingTable.vue?vue&type=script&setup=true&lang.ts
var PricingTable_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "PricingTable",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Pricing, set as a table of rates rather than four floating cards — the
		* columns share their rules, so it reads as one printed schedule.
		*
		* These figures mirror PLANS in barrelman's src/billing/plans.ts. They are
		* duplicated rather than fetched so the marketing site stays a static build
		* with no runtime dependency on the API — but that means a repricing has to be
		* copied here. `GET /account/plans` is the source of truth if the two ever
		* disagree.
		*/
		const { public: config } = useRuntimeConfig();
		const tiers = [
			{
				id: "free",
				name: "Free",
				price: "$0",
				blurb: "Evaluation, prototypes, local development.",
				credits: "100,000 credits",
				rate: "300 req/min",
				overage: "Stops at the limit",
				commercial: false,
				cta: "Get a key",
				href: config.consoleUrl
			},
			{
				id: "developer",
				name: "Developer",
				price: "$19",
				cadence: "/mo",
				blurb: "Production traffic, sensibly priced.",
				credits: "1,000,000 credits",
				rate: "900 req/min",
				overage: "$0.03 / 1k after",
				commercial: true,
				cta: "Choose Developer",
				href: config.consoleUrl,
				featured: true
			},
			{
				id: "business",
				name: "Business",
				price: "$99",
				cadence: "/mo",
				blurb: "Room to grow without a call.",
				credits: "10,000,000 credits",
				rate: "1,800 req/min",
				overage: "$0.018 / 1k after",
				commercial: true,
				cta: "Choose Business",
				href: config.consoleUrl
			},
			{
				id: "scale",
				name: "Scale",
				price: "$299",
				cadence: "/mo",
				blurb: "High volume, priority capacity.",
				credits: "40,000,000 credits",
				rate: "6,000 req/min",
				overage: "$0.012 / 1k after",
				commercial: true,
				cta: "Choose Scale",
				href: config.consoleUrl
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_CompassRose = CompassRose_default;
			const _component_SectionHead = SectionHead_default;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "pricing",
				class: "band border-t border-rule"
			}, _attrs))}>`);
			_push(ssrRenderComponent(_component_CompassRose, { class: "pointer-events-none absolute -left-32 bottom-12 hidden w-[26rem] text-ink opacity-[0.07] xl:block" }, null, _parent));
			_push(`<div class="measure relative">`);
			_push(ssrRenderComponent(_component_SectionHead, {
				label: "Rates",
				title: "One balance, every endpoint"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` No per-product plans. No separate keys. `);
					else return [createTextVNode(" No per-product plans. No separate keys. ")];
				}),
				_: 1
			}, _parent));
			_push(`<div class="depth mt-14 grid overflow-hidden rounded-lg border border-rule-strong md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
			ssrRenderList(tiers, (tier) => {
				_push(`<article class="${ssrRenderClass([tier.featured ? "bg-paper-aged" : "bg-paper", "relative flex flex-col border-b border-r border-rule-strong p-6"])}">`);
				if (tier.featured) _push(`<div class="absolute -left-px -right-px top-0 h-[3px] bg-rubric"></div>`);
				else _push(`<!---->`);
				if (tier.featured) _push(`<span class="legend absolute right-4 top-3.5 text-rubric"> Most popular </span>`);
				else _push(`<!---->`);
				_push(`<h3 class="font-medium tracking-tight text-ink">${ssrInterpolate(tier.name)}</h3><div class="mt-3 flex items-baseline gap-1"><span class="display text-4xl text-ink">${ssrInterpolate(tier.price)}</span>`);
				if (tier.cadence) _push(`<span class="text-sm text-ink-soft">${ssrInterpolate(tier.cadence)}</span>`);
				else _push(`<!---->`);
				_push(`</div><p class="mt-3 text-body leading-relaxed text-ink-soft">${ssrInterpolate(tier.blurb)}</p><ul class="mb-6 mt-5 flex flex-col gap-2.5 text-body"><li class="flex items-start gap-2">`);
				_push(ssrRenderComponent(unref(Check), {
					class: "mt-0.5 size-4 shrink-0 text-verdigris",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(`<span class="font-mono text-fine text-ink">${ssrInterpolate(tier.credits)}</span></li><li class="flex items-start gap-2">`);
				_push(ssrRenderComponent(unref(Check), {
					class: "mt-0.5 size-4 shrink-0 text-verdigris",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(`<span class="font-mono text-fine text-ink">${ssrInterpolate(tier.rate)}</span></li><li class="flex items-start gap-2 text-ink-soft">`);
				if (tier.commercial) _push(ssrRenderComponent(unref(Check), {
					class: "mt-0.5 size-4 shrink-0 text-verdigris",
					"stroke-width": "1.5"
				}, null, _parent));
				else _push(ssrRenderComponent(unref(Minus), {
					class: "mt-0.5 size-4 shrink-0 text-ink-soft opacity-60",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(`<span>${ssrInterpolate(tier.commercial ? "Commercial use" : "Non-commercial use")}</span></li><li class="flex items-start gap-2 text-ink-soft">`);
				if (tier.commercial) _push(ssrRenderComponent(unref(Check), {
					class: "mt-0.5 size-4 shrink-0 text-verdigris",
					"stroke-width": "1.5"
				}, null, _parent));
				else _push(ssrRenderComponent(unref(Minus), {
					class: "mt-0.5 size-4 shrink-0 text-ink-soft opacity-60",
					"stroke-width": "1.5"
				}, null, _parent));
				_push(`<span>${ssrInterpolate(tier.overage)}</span></li></ul><a${ssrRenderAttr("href", tier.href)} class="${ssrRenderClass([tier.featured ? "btn-ink w-full" : "btn-rule w-full", "mt-auto"])}">${ssrInterpolate(tier.cta)}</a></article>`);
			});
			_push(`<!--]--></div><div class="cartouche mt-8 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8"><div><h3 class="font-medium tracking-tight text-ink">Enterprise</h3><p class="mt-1.5 max-w-xl text-body leading-relaxed text-ink-soft"> Custom volume, an SLA, and a dedicated or self-hosted deployment. Up to and including the whole stack on your own hardware. </p></div><a href="mailto:sales@barrelman.dev?subject=Enterprise%20plan" class="btn-rule shrink-0"> Talk to us </a></div><p class="caption mt-6"> Prices in USD. Overage is metered per credit, never rounded up to a block. </p></div></section>`);
		};
	}
});
//#endregion
//#region app/components/PricingTable.vue
var _sfc_setup$4 = PricingTable_vue_vue_type_script_setup_true_lang_default.setup;
PricingTable_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PricingTable.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var PricingTable_default = Object.assign(PricingTable_vue_vue_type_script_setup_true_lang_default, { __name: "PricingTable" });
//#endregion
//#region app/components/StarField.vue?vue&type=script&setup=true&lang.ts
/**
* How much of the sphere's width the band shows. At 1 the limb sits exactly on
* the left and right edges, so stars fade out precisely as they leave; wider
* than that and they would wink out mid-air.
*/
var SPREAD_X = 1;
/** Latitude is squashed: the band is far wider than it is tall. */
var SPREAD_Y = .62;
/**
* Tilt of the pole, radians. Without it every star travels dead horizontally
* and the sphere collapses back into a sideways slide — the speed still
* varies, but nothing curves, and curvature is what the eye actually reads as
* rotation. Matching the globe's own 23.5° would be too steep for a band this
* shallow; ten degrees is enough to bend the paths.
*/
var TILT = .175;
/**
* Apparent magnitude, over the range the naked eye works in: about 1 for the
* few that name constellations, about 6.3 for the faintest anyone can pick out
* on a dark night at sea.
*/
var MAG_BRIGHT = 1.2;
var MAG_FAINT = 6.2;
/**
* How steeply the sky fills up as it gets fainter.
*
* Real counts go as `10^0.6m` — roughly four times as many stars in each
* magnitude as in the one above it, which is why the sky has some twenty
* thousand stars to sixth magnitude and about fifteen to first.
*
* A field of a couple of hundred cannot have that ratio and still have a
* bright end: sampled at the real slope every last star lands within a
* magnitude of the limit, which is not only dim but *uniform* — same flux, so
* same size and same opacity, and the sky comes out as evenly spaced identical
* dust. Under half the real slope the shape is still the true one, many faint
* against a handful bright with the count rising smoothly between, but spread
* over enough of the range that the sky has a hierarchy to read.
*/
var MAG_SLOPE = .26;
/** Inverse of the cumulative count, so a uniform draw lands on that curve. */
var COUNT = 145;
/**
* Stars in the galactic band, on top of the evenly scattered ones.
*
* The Milky Way is the one feature that makes a sky read as *the* sky rather
* than as scattered dots, and it is not a painted streak — it is the disc of
* the galaxy seen edge-on, which is to say a great many stars too faint to
* separate, crowded along one great circle. So it is built the way it looks:
* more stars, all of them at the faint limit, gathered about a circle set at
* an angle to the sky's own axis.
*/
var BAND_COUNT = 55;
/** Inclination of that circle to the sphere's equator, radians. */
var BAND_TILT = .62;
/** Scatter either side of it, radians. Roughly the width of the real thing. */
var BAND_SPREAD = .13;
var StarField_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StarField",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The night sky over the closing band — stars on a celestial sphere, turning.
		*
		* Three things had to be true at once, and they pull against each other.
		*
		* **Sparkle** is stars going off at different times. A stack of
		* `radial-gradient`s, which this used to be, can only be animated as one
		* thing, so every star in it brightens on the same clock; at any amplitude
		* worth seeing that reads as the whole panel pulsing. So each star is an
		* element, with its own duration and a negative delay that drops it at a
		* random point in its cycle.
		*
		* **Drift** is the sky turning overhead. Sliding the field sideways is the
		* cheap version and looks it, because everything moves at one speed. Real
		* stars sit on a sphere: they accelerate through the meridian and slow toward
		* the horizon, and that foreshortening is the whole tell. So each star has a
		* longitude and a latitude, the longitude advances, and the projection does
		* the rest — `x = cos(lat)·sin(lon)` is fastest at `lon = 0` and stalls at the
		* limb for free.
		*
		* **Swing** is the same sphere answering the reader, on the pattern the rhumb
		* network uses in the hero: pointer and scroll, each eased toward on its own
		* budget and its own clock, because a glance around a sky and the band itself
		* travelling past are not the same motion and should not share a ceiling.
		* It exists because the drift alone is deliberately too slow to watch — an
		* hour a turn — so all the work the sphere does was invisible unless you left
		* the page open and came back. A few degrees of longitude under the cursor
		* shows it in a second: stars near the meridian slide, stars near the limb
		* barely move, and the paths bend. That difference is the sphere, and it is
		* the thing worth being able to see.
		*
		* Sparkle is kept apart from the other two so neither has to know about it:
		* the outer element is position, written from the animation loop, and the
		* inner one is sparkle, left entirely to CSS. Both want the `transform`
		* property, and one would otherwise overwrite the other every frame.
		*/
		/** mulberry32 — small, fast, and identical on both sides of the render. */
		function rng(seed) {
			return () => {
				seed = seed + 1831565813 | 0;
				let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
				t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
				return ((t ^ t >>> 14) >>> 0) / 4294967296;
			};
		}
		/** Box–Muller, for the scatter either side of the galactic band. */
		function gauss(rand) {
			return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
		}
		/**
		* A full turn of the sky, in seconds. About an hour: at the width of this band
		* that is a couple of pixels a second, which is under the rate at which motion
		* registers as motion. You should never catch a star drifting — you should only
		* notice, coming back, that the sky is not where you left it.
		*/
		const COS_TILT = Math.cos(TILT);
		const SIN_TILT = Math.sin(TILT);
		/**
		* A point on the sphere, projected into the band as percentages.
		*
		* Orthographic, which is right for something meant to be at infinity, and
		* means the only depth cue is `z` — used to fade stars out as they reach the
		* limb rather than to scale them.
		*
		* The tilt arrives as its sine and cosine rather than as an angle because it
		* is no longer constant — the pointer nods it — and this runs a couple of
		* hundred times a frame.
		*/
		function project(star, turn, cosTilt, sinTilt) {
			const lon = star.lon + turn;
			const x = star.cosLat * Math.sin(lon);
			const y = star.sinLat;
			return {
				x: (x * cosTilt - y * sinTilt) * 50 * SPREAD_X,
				y: (x * sinTilt + y * cosTilt) * 50 * SPREAD_Y,
				z: star.cosLat * Math.cos(lon)
			};
		}
		function magnitudeAt(u, bright = MAG_BRIGHT, faint = MAG_FAINT) {
			const a = 10 ** (MAG_SLOPE * bright);
			const b = 10 ** (MAG_SLOPE * faint);
			return Math.log10(a + u * (b - a)) / MAG_SLOPE;
		}
		/**
		* Spectral classes and the colours they actually show, with roughly the mix a
		* naked-eye sky has — heavy on white and yellow-white, a fifth of it warm.
		*
		* Stars are not white dots. They are not saturated either: the tint is there
		* in the bright ones (Rigel is blue, Betelgeuse and Antares are orange) and
		* gone in the faint ones, because colour vision fails before brightness does.
		* So saturation rides on flux below, and the faintest stars come out the
		* paper white the rest of the page is drawn in.
		*/
		const CLASSES = [
			{
				share: .06,
				rgb: [
					155,
					176,
					255
				]
			},
			{
				share: .14,
				rgb: [
					202,
					216,
					255
				]
			},
			{
				share: .26,
				rgb: [
					248,
					247,
					255
				]
			},
			{
				share: .3,
				rgb: [
					255,
					244,
					234
				]
			},
			{
				share: .16,
				rgb: [
					255,
					210,
					161
				]
			},
			{
				share: .08,
				rgb: [
					255,
					180,
					130
				]
			}
		];
		/** `--paper`. What a star with no colour left in it should be. */
		const PAPER = [
			255,
			249,
			243
		];
		function classFor(u) {
			let acc = 0;
			for (const c of CLASSES) {
				acc += c.share;
				if (u <= acc) return c.rgb;
			}
			return CLASSES[CLASSES.length - 1].rgb;
		}
		const TAN_BAND = Math.tan(BAND_TILT);
		/**
		* Where the band crosses the equator.
		*
		* A quarter turn, which is what puts the crossing in the middle of the window
		* the panel shows and runs the band corner to corner. Left at zero the circle
		* is symmetric about the centre of the view, so it comes out as a shallow arc
		* dipping behind the planet — the right shape for a great circle seen down its
		* own node, and the wrong one for a sky, where the Milky Way is the thing that
		* cuts across everything else.
		*/
		const BAND_NODE = Math.PI / 2;
		/**
		* Latitude of the galactic band at a given longitude.
		*
		* The band is the great circle perpendicular to a pole tilted off the sphere's
		* own, so its points are the ones with `p·n = 0`; solving that for latitude is
		* this. Doing it this way rather than walking the circle keeps every band star
		* inside the longitudes the panel can actually show.
		*/
		function bandLatAt(lon) {
			return Math.atan(-Math.cos(lon - BAND_NODE) * TAN_BAND);
		}
		/**
		* Evaluated once at module scope, from a fixed seed, so the server and the
		* client generate the same sky and the markup hydrates without a mismatch.
		* `Math.random()` here would repaint every star on hydration.
		*/
		const stars = (() => {
			const rand = rng(20260805);
			const out = [];
			const add = (lon, lat, mag, dim) => {
				const flux = 10 ** (-0.4 * (mag - MAG_BRIGHT));
				const sat = Math.min(1, flux ** .28);
				const color = classFor(rand()).map((c, i) => Math.round(PAPER[i] + (c - PAPER[i]) * sat));
				const size = .8 + 2.7 * flux ** .42;
				const glow = flux >= .05 ? 1.6 + 5.5 * flux : 0;
				out.push({
					lon,
					cosLat: Math.cos(lat),
					sinLat: Math.sin(lat),
					size: `${size.toFixed(2)}px`,
					color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
					opacity: +Math.min(1, (.18 + .82 * flux ** .42) * dim).toFixed(3),
					duration: `${(2.4 + rand() * 5.5).toFixed(2)}s`,
					delay: `${(rand() * -9).toFixed(2)}s`,
					glow: glow ? `0 0 ${glow.toFixed(1)}px ${(glow / 2).toFixed(1)}px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.35)` : "none",
					sparkle: flux > .16,
					left: "",
					top: "",
					edge: "1"
				});
			};
			const someLon = () => (rand() * 2 - 1) * (Math.PI / 2 + .5);
			for (let i = 0; i < COUNT; i++) add(someLon(), Math.asin(rand() * 2 - 1) * .85, magnitudeAt(rand()), 1);
			for (let i = 0; i < BAND_COUNT; i++) {
				const lon = someLon();
				const lat = bandLatAt(lon) + gauss(rand) * BAND_SPREAD;
				add(lon, Math.max(-1.3, Math.min(1.3, lat)), magnitudeAt(rand(), 5.2, 6.6), .7);
			}
			for (const star of out) {
				const p = project(star, 0, COS_TILT, SIN_TILT);
				star.left = `${(50 + p.x).toFixed(3)}%`;
				star.top = `${(50 + p.y).toFixed(3)}%`;
				star.edge = p.z <= 0 ? "0" : Math.min(1, p.z / .3).toFixed(3);
			}
			return out;
		})();
		const root = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				ref_key: "root",
				ref: root,
				class: "pointer-events-none absolute inset-0 overflow-hidden",
				"aria-hidden": "true"
			}, _attrs))} data-v-8fcef50c><!--[-->`);
			ssrRenderList(unref(stars), (star, i) => {
				_push(`<span class="absolute" style="${ssrRenderStyle({
					left: star.left,
					top: star.top,
					opacity: star.edge
				})}" data-v-8fcef50c><span class="${ssrRenderClass([star.sparkle ? "star-bright" : "", "star block rounded-full"])}" style="${ssrRenderStyle({
					width: star.size,
					height: star.size,
					background: star.color,
					boxShadow: star.glow,
					"--star-opacity": star.opacity,
					"--star-duration": star.duration,
					"--star-delay": star.delay
				})}" data-v-8fcef50c></span></span>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region app/components/StarField.vue
var _sfc_setup$3 = StarField_vue_vue_type_script_setup_true_lang_default.setup;
StarField_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StarField.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var StarField_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StarField_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8fcef50c"]]), { __name: "StarField" });
//#endregion
//#region app/components/ClosingCta.vue?vue&type=script&setup=true&lang.ts
var ClosingCta_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ClosingCta",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The page turns to night here, and stays there through the footer.
		*
		* Parchment's --space is the ground: one dark region, at the end, where the
		* lookout actually works. It earns the name — everything above is the chart on
		* the table, this is the watch — and it gives the closing ask the only real
		* contrast on the page without introducing a colour the brand doesn't own.
		*
		* The globe sits under the ask, cropped by the bottom edge so only its upper
		* limb shows. A whole planet floating in the middle would be a logo; a horizon
		* is a place, which is the word the headline is trading on. It also puts the
		* atmosphere's rim light exactly where the section meets the footer, so the two
		* dark bands read as one sky rather than two panels.
		*/
		const { public: config } = useRuntimeConfig();
		/** Three's payload arrives late; fade the globe in rather than popping it. */
		const globeReady = ref(false);
		/**
		* Start the globe's textures downloading with the page, not with the globe.
		*
		* `ClosingGlobe` is `.client`, so nothing it asks for can be requested until
		* ~600KB of three has been fetched, parsed and run. Measured cold, that put the
		* first byte of a texture at 2.4s against a load event at 0.44s — two seconds
		* where the connection is idle and the globe is a blank hole at the foot of the
		* page. Anyone who scrolled straight down watched it assemble, which is why it
		* read as loading *on* scroll; it never was gated on scroll.
		*
		* Declared here rather than in the globe for exactly that reason: this
		* component is server-rendered, so the links are in the markup the parser sees
		* and the fetches overlap the three chunk instead of queueing behind it.
		*
		* `fetchpriority: low` because 1.2MB of planet five screens down must never
		* compete with the hero, and `crossorigin` because three's ImageLoader sets
		* `crossOrigin = 'anonymous'` — without it the preload key does not match the
		* image request and the browser downloads both textures a second time.
		*/
		useHead$1({ link: [{
			rel: "preload",
			as: "image",
			type: "image/webp",
			href: "/textures/earth_albedo.webp",
			crossorigin: "",
			fetchpriority: "low"
		}, {
			rel: "preload",
			as: "image",
			type: "image/webp",
			href: "/textures/clouds.webp",
			crossorigin: "",
			fetchpriority: "low"
		}] });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_StarField = StarField_default;
			const _component_ClosingGlobe = ServerPlaceholder;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "nightfall relative overflow-hidden" }, _attrs))}><div class="starfield pointer-events-none absolute inset-0"></div>`);
			_push(ssrRenderComponent(_component_StarField, null, null, _parent));
			_push(`<div class="relative z-10 mx-auto max-w-2xl px-6 pb-16 pt-28 text-center"><h2 class="display mt-5 text-[clamp(2rem,4.4vw,3.2rem)] text-paper"> The world is waiting </h2><p class="mt-5 text-lead leading-relaxed text-fog"> Everything is mapped, go build something worth the trip. </p><div class="mt-9 flex flex-wrap items-center justify-center gap-3"><a${ssrRenderAttr("href", unref(config).consoleUrl)} class="btn-brass group"> Create an API key `);
			_push(ssrRenderComponent(unref(ArrowRight), {
				class: "size-4 transition-transform group-hover:translate-x-0.5",
				"stroke-width": "1.5"
			}, null, _parent));
			_push(`</a><a${ssrRenderAttr("href", unref(config).docsUrl)} class="btn-night">Read the docs</a></div></div><div class="relative h-[clamp(7.5rem,18vw,15rem)] select-none" style="${ssrRenderStyle({ "--globe": "max(108vw, 46rem)" })}"><div class="${ssrRenderClass([unref(globeReady) ? "opacity-100" : "opacity-0", "absolute left-1/2 aspect-square w-[var(--globe)] -translate-x-1/2 transition-opacity duration-1000 ease-out"])}" style="${ssrRenderStyle({ "top": "calc(var(--globe) * -0.0872 + 3rem)" })}">`);
			_push(ssrRenderComponent(_component_ClosingGlobe, { onReady: ($event) => globeReady.value = true }, null, _parent));
			_push(`</div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/ClosingCta.vue
var _sfc_setup$2 = ClosingCta_vue_vue_type_script_setup_true_lang_default.setup;
ClosingCta_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ClosingCta.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ClosingCta_default = Object.assign(ClosingCta_vue_vue_type_script_setup_true_lang_default, { __name: "ClosingCta" });
//#endregion
//#region app/components/SiteFooter.vue?vue&type=script&setup=true&lang.ts
var SiteFooter_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SiteFooter",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Continues the night band from <ClosingCta> — one dark region at the foot of
		* the sheet rather than two, so the page reads as chart-then-watch instead of
		* alternating stripes.
		*/
		const { public: config } = useRuntimeConfig();
		const columns = [
			{
				title: "Product",
				links: [
					{
						label: "Capabilities",
						href: "#capabilities"
					},
					{
						label: "Pricing",
						href: "#pricing"
					},
					{
						label: "Console",
						href: config.consoleUrl
					},
					{
						label: "Status",
						href: `${config.apiUrl}/health`
					}
				]
			},
			{
				title: "Developers",
				links: [
					{
						label: "API reference",
						href: config.docsUrl
					},
					{
						label: "GitHub",
						href: config.githubUrl
					},
					{
						label: "Self-hosting",
						href: `${config.githubUrl}#quick-start-production`
					},
					{
						label: "Changelog",
						href: `${config.githubUrl}/releases`
					}
				]
			},
			{
				title: "Legal",
				links: [
					{
						label: "Terms",
						href: "/terms"
					},
					{
						label: "Privacy",
						href: "/privacy"
					},
					{
						label: "Attribution",
						href: "https://www.openstreetmap.org/copyright"
					}
				]
			}
		];
		const year = (/* @__PURE__ */ new Date()).getFullYear();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_BrandMark = BrandMark_default;
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "nightfall border-t border-paper/10 py-16" }, _attrs))}><div class="measure"><div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><a href="#top" class="flex items-center gap-2 text-paper" style="${ssrRenderStyle({
				"--nest-fill": "#081628",
				"--rubric": "#e0714f"
			})}">`);
			_push(ssrRenderComponent(_component_BrandMark, { class: "size-6" }, null, _parent));
			_push(`<span class="display text-[1.35rem]">Barrelman</span></a><p class="mt-4 max-w-xs text-body leading-relaxed text-fog"> A crew member stationed in a ship&#39;s crow&#39;s nest, serving as a navigational aid by surveying the horizon. </p></div><!--[-->`);
			ssrRenderList(columns, (column) => {
				_push(`<div><h3 class="legend text-brass">${ssrInterpolate(column.title)}</h3><ul class="mt-4 flex flex-col gap-2.5 text-sm"><!--[-->`);
				ssrRenderList(column.links, (link) => {
					_push(`<li><a${ssrRenderAttr("href", link.href)} class="text-fog transition-colors hover:text-paper">${ssrInterpolate(link.label)}</a></li>`);
				});
				_push(`<!--]--></ul></div>`);
			});
			_push(`<!--]--></div><div class="mt-14 border-t border-paper/10 pt-6 text-caption text-fog"><p>© ${ssrInterpolate(unref(year))} Barrelman</p></div></div></footer>`);
		};
	}
});
//#endregion
//#region app/components/SiteFooter.vue
var _sfc_setup$1 = SiteFooter_vue_vue_type_script_setup_true_lang_default.setup;
SiteFooter_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SiteFooter.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var SiteFooter_default = Object.assign(SiteFooter_vue_vue_type_script_setup_true_lang_default, { __name: "SiteFooter" });
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* The section order is the argument:
		* what it is → prove it (log) → what it does → why us → what it costs → sign up.
		*
		* Each section is a self-contained component so any of them can be replaced,
		* reordered or dropped without touching the others.
		*
		* The paper sections are wrapped so the neatline can be drawn around them as
		* one sheet; the night band and the footer fall outside it, past the edge of
		* the chart.
		*/
		return (_ctx, _push, _parent, _attrs) => {
			const _component_SiteNav = SiteNav_default;
			const _component_SiteHero = SiteHero_default;
			const _component_CapabilityGrid = CapabilityGrid_default;
			const _component_OpenStreetMapBand = OpenStreetMapBand_default;
			const _component_PricingTable = PricingTable_default;
			const _component_ClosingCta = ClosingCta_default;
			const _component_SiteFooter = SiteFooter_default;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_SiteNav, null, null, _parent));
			_push(`<main><div class="relative"><div class="neatline" aria-hidden="true"></div>`);
			_push(ssrRenderComponent(_component_SiteHero, null, null, _parent));
			_push(ssrRenderComponent(_component_CapabilityGrid, null, null, _parent));
			_push(ssrRenderComponent(_component_OpenStreetMapBand, null, null, _parent));
			_push(ssrRenderComponent(_component_PricingTable, null, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(_component_ClosingCta, null, null, _parent));
			_push(`</main>`);
			_push(ssrRenderComponent(_component_SiteFooter, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-DJw4gANT.mjs.map
