Vue.view("n-event-tree", {
	props: {
		correlationId: {
			type: String,
			required: true
		}
	},
	data: function() {
		return {
			events: [],
			roots: [],
			untimed: [],
			selected: null,
			minStarted: null,
			maxStarted: null,
			alias: null,
			realm: null
		}
	},
	activate: function(done) {
		var self = this;
		// don't load if we don't have a correlation id!
		if (this.correlationId != null) {
			this.$services.swagger.execute("nabu.frameworks.events.manage.crud.event.services.list", {correlationId: this.correlationId, orderBy: "created" }).then(function(result) {
				if (result.results) {
					// otherwise not reactive?
					result.results.forEach(function(x) {
						x.$open = false;
						x.durationPercentage = 0;
					});
					nabu.utils.arrays.merge(self.events, result.results);
				}
				self.order();
				done();
			}, done);
		}
		else {
			done();
		}
	},
	methods: {
		select: function(event) {
			var result = {};
			nabu.utils.objects.merge(result, event);
			result.parents = null;
			result.children = null;
			result.parent = null;
			this.selected = result;
			this.$emit("selectEvent", result);
		},
		getEvents: function() {
			return {selectEvent: this.$services.swagger.resolve("nabu.frameworks.events.manage.crud.event.types.output") };
		},
		order: function() {
			var self = this;
			var roots = [];
			var untimed = [];
			var minStarted = null;
			var maxStopped = null;
			var alias = null;
			var realm = null;
			this.events.forEach(function(x) {
				// start open
				x.$open = x.severity == "ERROR" || (x.responseCode && x.responseCode >= 400);
				for (var i = 0; i < self.events.length; i++) {
					var y = self.events[i];
					// don't match self
					if (x.id == y.id) {
						continue;
					}
					// if events have the exact same start/end, they will match each other
					// we only want the first match in this case
					if (x.children && x.children.indexOf(y) >= 0) {
						continue;
					}
					// in this check it has to be fully contained, but it can be equal
					// we keep track of all the possible parent matches
					// in a second pass we'll only retain the most specific parent, to avoid recursive sorting
					if (y.started && y.stopped && ((x.started && x.stopped && x.started.getTime() >= y.started.getTime() && x.stopped.getTime() <= y.stopped.getTime()) || (!x.started && !x.stopped && x.created && x.created && x.created.getTime() >= y.started.getTime() && x.created.getTime() <= y.stopped.getTime()))) {
						if (!y.children) {
							y.children = [];
						}
						y.children.push(x);
						if (!x.parents) {
							x.parents = [];
						}
						x.parents.push(y);
					}
				}
				if (x.started && (minStarted == null || minStarted.getTime() > x.started.getTime())) {
					minStarted = x.started;
				}
				if (x.stopped && (maxStopped == null || maxStopped.getTime() < x.stopped.getTime())) {
					maxStopped = x.stopped;
				}
				if (!alias) {
					alias = x.alias;
				}
				if (!realm) {
					realm = x.realm;
				}
			});
			var totalDuration = minStarted && maxStopped ? maxStopped.getTime() - minStarted.getTime() : 0; 
			// second pass to get the most narrow parent
			this.events.filter(function(x) { return untimed.indexOf(x) < 0 }).forEach(function(x) {
				if (x.started && x.stopped && totalDuration > 0) {
					var duration = x.stopped.getTime() - x.started.getTime();
					x.durationPercentage = (duration / totalDuration) * 100;
				}
				if (!x.parents) {
					roots.push(x);
				}
				// if we have multiple parents, must get the closest one
				else if (x.parents.length > 1) {
					var closest = null;
					x.parents.forEach(function(y) {
						if (closest == null || closest.started.getTime() <= y.started.getTime() || closest.stopped.getTime() >= y.stopped.getTime()) {
							if (closest) {
								closest.children.splice(closest.children.indexOf(x), 1);
							}
							closest = y;
						}
						else {
							y.children.splice(y.children.indexOf(x), 1);
						}
					});
					//x.parents = null;
					x.parent = closest;
					if (x.$open) {
						x.parent.$open = true;
					}
				}
			});
			nabu.utils.arrays.merge(this.roots, roots);
			nabu.utils.arrays.merge(this.untimed, untimed);
			this.minStarted = minStarted;
			this.maxStopped = maxStopped;
			this.alias = alias;
			this.realm = realm;
		}
	}
});

Vue.component("n-event-tree-item", {
	template: "#n-event-tree-item",
	props: {
		events: {
			type: Array,
			required: true
		},
		selected: {
			type: Object
		}
	},
	data: function() {
		return {
			disableSelect: false
		}
	},
	methods: {
		select: function(event) {
			if (!this.disableSelect) {
				this.$emit("select", event);
			}
		},
		toggle: function(event) {
			console.log("before", event.$open);
			Vue.set(event, "$open", !event.$open);
			console.log("after", event.$open);
		},
		isOpen: function(event) {
			return event.$open;
		}
	}
})