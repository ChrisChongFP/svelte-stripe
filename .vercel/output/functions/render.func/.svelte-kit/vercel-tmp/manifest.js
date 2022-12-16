export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".well-known/apple-developer-merchantid-domain-association","favicon.png","logos/stripe.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		entry: {"file":"_app/immutable/start-9afe1eae.js","imports":["_app/immutable/start-9afe1eae.js","_app/immutable/chunks/index-7f3551f2.js","_app/immutable/chunks/singletons-c1916556.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
