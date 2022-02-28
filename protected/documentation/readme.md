We want to start pushing everything via events:

- do local checks for # diskspace used, CPU, memory
- if in cluster: send heartbeat with same health information, if a cluster node does not check in, other nodes trigger a warning/error
- frontend analytics events should be sent to backend as well as session start/stop
- performance tracking: use the same algorithm as performance tracker to upgrade service invoke events from debug to like warning


You configure the nabu.frameworks.events.providers.fire service as the event handler for this server.
It can then push to a local database _or_ a cloud endpoint.

The fire will standardize any event into the common format and annotate further where necessary.

# TODO

Limit selects in time (like only the last week or so)
-> for partitioning

# UUID vs string

In the beginning, authenticationId, ownerId and serverId were modelled as strings to allow for flexible storage even though we always use uuids internally.
However, turns out that postgres uses numeric resolving for the UUID type which makes it a _lot_ faster to resolve on UUID than on string comparison (even equals with various index types).

For that reason these key filter fields were updated to uuids for quick lookup.

Note that if you still want to store something other than a uuid, you can add a mapping table where you resolve a non-uuid into a uuid. If the resolving is cached, you still have a massive performance increase.

# Catch All

If you want a catch all notification, write a rule that matches everything?
Very likely you want to match at least _something_ like the severity.

# Clusters

The assumption is that all members of a cluster share the exact same configuration apart from one thing: their name.
This means they likely will/should share the same API key to report events, meaning the server id as we log it, is actually the cluster id.
That means we can select by server id and get events for the whole cluster.

The assumption is, for a particular server id, there is only one server group but potentially multiple members.
We can use this to our advantage to create dynamic groupings which are still correct security wise (meaning, we can check if you have access to a server id and still generate the full cluster).

# Priority

Event priority is meant to be controlled by the people configuring the followup of events.

We generally differentatie these levels:

- priority: 0 -> the default and indicates that there is no followup priority
- priority: 500+ -> important, should follow up as soon as possible (e.g. within business hours)
- priority: 1000+ -> critical, should follow up immediately (earliest possible moment depending on SLA)

In between you are free to choose as many or as few levels as you want to differentate. For example you can decide that everything between 750-1000 should be reported to technical people whereas 500-750 should be infra team.

Once you have "handled" an event, the priority is generally set to 0.