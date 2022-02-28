<template id="n-event-tree">
	<div class="n-event-tree">
		<div class="event-summary">
			<div class="started" v-if="minStarted"><span class="key">From:</span><span class="value">{{$services.formatter.date(minStarted, "yyyy MMM dd, HH:mm:ss.SSS")}}</span></div>
			<div class="stopped" v-if="maxStopped"><span class="key">Until:</span><span class="value">{{$services.formatter.date(maxStopped, "yyyy MMM dd, HH:mm:ss.SSS")}}</span></div>
			<div class="by" v-if="alias"><span class="key">User:</span><span class="value">{{alias}}</span><span class="tag" v-if="realm">{{realm}}</span></div>
		</div>
		<n-event-tree-item :events="roots" @select="select" :selected="selected"/>
		<n-event-tree-item :events="untimed" @select="select" :selected="selected"/>
	</div>
</template>

<template id="n-event-tree-item">
	<div class="n-event-tree-item">
		<div v-for="event in events">
			<div @click="select(event)" class="n-event-tree-item-instance"  :class="{'selected': selected && selected.id == event.id}">
				<span class="event-toggle fa" @mouseover="disableSelect = true" @mouseout = "disableSelect = false" @click="toggle(event)" :class="{'fa-chevron-down': isOpen(event), 'fa-chevron-right': !isOpen(event)}" v-if="event.children"></span>
				<input type="range" v-if="false && event.durationPercentage" :value="event.durationPercentage"/>
				<span class="full-duration-bar" v-if="event.durationPercentage">
					<span class="duration-bar" :style="{'width': Math.round(event.durationPercentage) + 'px'}"/>
					<span class="duration">{{event.duration}}</span>
					<span class="duration-percent">{{Math.round(event.durationPercentage)}}%</span>
				</span>
				<span v-if="false" class="event-category">{{event.eventCategory}}</span>
				<span class="event-name" :class="{'danger': event.severity == 'ERROR' }">{{event.eventName}}</span>
				<span class="event-code" :class="{'danger': event.responseCode && event.responseCode >= 400 }" v-if="event.responseCode">{{event.responseCode }}</span>
				<span class="event-code" v-if="event.code">{{event.code }}</span>
				<span class="event-target" v-if="event.requestUri"><span class="event-method tag" v-if="event.method">{{event.method}}</span><a :href="event.requestUri" class="event-uri">{{event.requestUri.replace("//api", "/api")}}</a></span>
				<span class="event-target event-artifact-id" v-else-if="event.artifactId"><span class="artifact-folder">{{event.artifactId.replace(/(.*)\.[^.]+/, "$1")}}.</span><span class="artifact-name">{{event.artifactId.replace(/.*\.([^.]+)/, "$1")}}</span></span>
			</div>
			<n-event-tree-item v-if="event.children && isOpen(event)" :events="event.children" v-bubble:select :selected="selected"/>
		</div>
	</div>
</template>