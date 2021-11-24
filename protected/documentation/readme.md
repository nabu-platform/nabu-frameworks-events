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


# Catch All

If you want a catch all notification, write a rule that matches everything?
Very likely you want to match at least _something_ like the severity.

# Clusters

The assumption is that all members of a cluster share the exact same configuration apart from one thing: their name.
This means they likely will/should share the same API key to report events, meaning the server id as we log it, is actually the cluster id.
That means we can select by server id and get events for the whole cluster.

The assumption is, for a particular server id, there is only one server group but potentially multiple members.
We can use this to our advantage to create dynamic groupings which are still correct security wise (meaning, we can check if you have access to a server id and still generate the full cluster).