We want to start pushing everything via events:

- do local checks for # diskspace used, CPU, memory
- if in cluster: send heartbeat with same health information, if a cluster node does not check in, other nodes trigger a warning/error
- frontend analytics events should be sent to backend as well as session start/stop
- performance tracking: use the same algorithm as performance tracker to upgrade service invoke events from debug to like warning


You configure the nabu.microservices.event.providers.fire service as the event handler for this server.
It can then push to a local database _or_ a cloud endpoint.

The fire will standardize any event into the common format and annotate further where necessary.

# TODO

Limit selects in time (like only the last week or so)
-> for partitioning